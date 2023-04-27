import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, Transition } from '@headlessui/react'
import { Prisma, User, User_gender } from '@prisma/client'
import classNames from 'classnames'
import { GraphQLError } from 'graphql'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import { Button, Modal, TableColFilter, TableColSort, UserProfile } from 'components'
import { LanguagesMap } from 'configs'
import { Common } from 'constantss'
import { GendersMap, UserActiveMap, UserRolesMap } from 'enums'
import { useRequest } from 'hooks'
import { IGetUsersParams, IGetUsersResponse, UserContact } from 'interfaces'
import { getAuthCookie, Utilities } from 'utils'

type AdminProps = {
  userToken: User
}

type GetUsersGQLResponse = GQLResponse<{ getUsers: IGetUsersResponse }>
type ForgotPasswordGQLResponse = GQLResponse<{ forgotPassword: { message: string } }>
type DeactivateAccountGQLResponse = GQLResponse<{ deactivateAccount: { message: string } }>
type ActivateAccountGQLResponse = GQLResponse<{ activateAccount: { message: string } }>

const Admin: NextPage<AdminProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const [users, setUsers] = useState<UserContact[]>([])
  const [usersErrors, setUsersErrors] = useState<GraphQLError[]>([])
  const [getUsersParams, setGetUsersParams] = useState<IGetUsersParams>({
    offset: 0,
    limit: Common.PAGINATION.LIMIT,
    query: '',
    genders: GendersMap,
    roles: UserRolesMap,
    languages: LanguagesMap,
    active: null,
    order_by: 'id',
    sort: Prisma.SortOrder.asc,
  })
  const [getUsersCount, setGetUsersCount] = useState<number>(0)
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false)
  const [isDeactivateAccountModalOpen, setIsDeactivateAccountModalOpen] = useState<boolean>(false)
  const [isActivateAccountModalOpen, setIsActivateAccountModalOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<UserContact>({} as UserContact)

  const getUsers = (): void => {
    setUsers([])
    setGetUsersCount(0)
    setUsersErrors([])

    useRequest<GetUsersGQLResponse>(
      `query {
        getUsers(
          params: {
            offset: ${getUsersParams.offset},
            limit: ${getUsersParams.limit},
            query: "${getUsersParams.query}",
            genders: ${JSON.stringify(getUsersParams.genders)},
            roles: ${JSON.stringify(getUsersParams.roles)},
            languages: ${JSON.stringify(getUsersParams.languages)},
            active: ${getUsersParams.active},
            order_by: "${getUsersParams.order_by}",
            sort: "${getUsersParams.sort}"
          }
        ) {
          results {
            id,
            first_name,
            last_name,
            gender,
            birth_date,
            email,
            username,
            role_id,
            language,
            active
            created_at,
            updated_at,
            Contact {
              address_line_1,
              address_line_2,
              city,
              region,
              country,
              postal_code,
              phone_number,
              phone_number_ext
            }
            Doctor {
              department_id
              image_name
              start_date
              end_date
            }
            Patient {
              medical_id
              height
              weight
            }
          }
          count
        }
      }`
    ).then((value: GetUsersGQLResponse) => {
      if (value.data) {
        setUsers(value.data.getUsers.results)
        setGetUsersCount(value.data.getUsers.count)
      }
      if (value.errors) setUsersErrors(value.errors)
    })
  }

  const addUser = (): void => {
    setSelectedUser({} as UserContact)
    setIsUserProfileModalOpen(true)
  }

  const setItemsPerPage = (resultsPerPage: number): void => {
    setGetUsersParams({ ...getUsersParams, offset: 0, limit: resultsPerPage })
  }

  const filterResultsByQuery = (query: string): void => {
    const queryLength = query.trim().length
    if (queryLength === 0 || queryLength >= Common.SEARCH.QUERY_MIN_LENGTH) {
      setGetUsersParams({ ...getUsersParams, offset: 0, query })
    }
  }

  const orderBy = (field: string): void => {
    let sort: Prisma.SortOrder = Prisma.SortOrder.asc

    if (field === getUsersParams.order_by) {
      if (getUsersParams.sort === Prisma.SortOrder.asc) {
        sort = Prisma.SortOrder.desc
      }
    }

    setGetUsersParams({ ...getUsersParams, order_by: field, sort })
  }

  const ariaSort = (field: string): 'none' | 'ascending' | 'descending' => {
    return getUsersParams.order_by !== field
      ? 'none'
      : getUsersParams.sort === Prisma.SortOrder.asc
      ? 'ascending'
      : 'descending'
  }

  const isFirstPage = (): boolean => getUsersParams.offset <= 0

  const isLastPage = (): boolean => getUsersParams.offset + getUsersParams.limit >= getUsersCount

  const goToPreviousPage = (): void => {
    setGetUsersParams({ ...getUsersParams, offset: getUsersParams.offset - getUsersParams.limit })
  }

  const goToNextPage = (): void => {
    setGetUsersParams({ ...getUsersParams, offset: getUsersParams.offset + getUsersParams.limit })
  }

  const sendResetPasswordLink = async (user: User): Promise<void> => {
    const { data, errors } = await useRequest<ForgotPasswordGQLResponse>(
      `mutation { forgotPassword(input: { email: "${user.email}" }) { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.forgotPassword.message}`, { ns: 'api', email: user.email }))
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  const deactivateAccount = async (): Promise<void> => {
    const { data, errors } = await useRequest<DeactivateAccountGQLResponse>(
      `mutation { deactivateAccount(id: ${selectedUser?.id}) { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.deactivateAccount.message}`, { ns: 'api' }))
      setIsDeactivateAccountModalOpen(false)
      getUsers()
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  const activateAccount = async (): Promise<void> => {
    const { data, errors } = await useRequest<ActivateAccountGQLResponse>(
      `mutation { activateAccount(id: ${selectedUser?.id}) { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.activateAccount.message}`, { ns: 'api' }))
      setIsActivateAccountModalOpen(false)
      getUsers()
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  useEffect(
    () => {
      getUsers()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getUsersParams]
  )

  return (
    <>
      <h2>{t('TITLE', { ns: 'admin' })}</h2>

      <div className="w-full md:w-fit">
        <Button type="button" className="bg-light-mode-success dark:bg-dark-mode-success" onClick={() => addUser()}>
          {t('ADD_USER', { ns: 'admin' })}
        </Button>
      </div>

      <div className="table-filter">
        <div className="table-filter__items-per-page">
          <label htmlFor="itemsPerPage">{t('TABLE.FILTER.ITEMS_PER_PAGE')}</label>
          <select
            id="itemsPerPage"
            defaultValue={getUsersParams.limit}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setItemsPerPage(+event.target.value)}
          >
            {Common.PAGINATION.RESULTS_PER_PAGE.map((limit: number, key: number) => (
              <option key={key} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
        <div className="table-filter__search">
          <label htmlFor="search">{t('TABLE.FILTER.SEARCH')}</label>
          <input
            id="search"
            type="search"
            onInput={(event: FormEvent<HTMLInputElement>) =>
              filterResultsByQuery((event.target as HTMLInputElement).value)
            }
          />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="admin-console">
          <thead>
            <tr>
              <th className="group column-id sticky-start" aria-sort={ariaSort('id')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.ID')}
                  <TableColSort columnName="id" params={getUsersParams} onClick={() => orderBy('id')} />
                </div>
              </th>
              <th className="group column-first-name sticky-start" aria-sort={ariaSort('first_name')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.FIRST_NAME')}
                  <TableColSort columnName="first_name" params={getUsersParams} onClick={() => orderBy('first_name')} />
                </div>
              </th>
              <th className="group column-last-name sticky-start" aria-sort={ariaSort('last_name')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.LAST_NAME')}
                  <TableColSort columnName="last_name" params={getUsersParams} onClick={() => orderBy('last_name')} />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.GENDER')}
                  <TableColFilter
                    list={GendersMap}
                    selectedValues={getUsersParams.genders}
                    translationPrefix="GENDERS"
                    onChange={(genders: User_gender[]) => setGetUsersParams({ ...getUsersParams, genders })}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('birth_date')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.BIRTH_DATE')}
                  <TableColSort columnName="birth_date" params={getUsersParams} onClick={() => orderBy('birth_date')} />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('email')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.EMAIL')}
                  <TableColSort columnName="email" params={getUsersParams} onClick={() => orderBy('email')} />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('username')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.USERNAME')}
                  <TableColSort columnName="username" params={getUsersParams} onClick={() => orderBy('username')} />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.ROLE')}
                  <TableColFilter
                    list={UserRolesMap}
                    selectedValues={getUsersParams.roles}
                    translationPrefix="USER_ROLES"
                    onChange={(roles: number[]) => setGetUsersParams({ ...getUsersParams, roles })}
                  />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.LANGUAGE')}
                  <TableColFilter
                    list={LanguagesMap}
                    selectedValues={getUsersParams.languages}
                    translationPrefix="LANGUAGES"
                    onChange={(languages: string[]) => setGetUsersParams({ ...getUsersParams, languages })}
                  />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.ACTIVE')}
                  <TableColFilter
                    list={UserActiveMap}
                    selectedValues={getUsersParams.active === null ? UserActiveMap : [getUsersParams.active]}
                    translationPrefix="USER_ACTIVE"
                    onChange={(active: boolean[]) => {
                      setGetUsersParams({ ...getUsersParams, active: active.length === 1 ? active[0] : null })
                    }}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('created_at')}>
                <div className="table-column-wrapper">
                  {t('CREATED_AT')}
                  <TableColSort columnName="created_at" params={getUsersParams} onClick={() => orderBy('created_at')} />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('updated_at')}>
                <div className="table-column-wrapper">
                  {t('UPDATED_AT')}
                  <TableColSort columnName="updated_at" params={getUsersParams} onClick={() => orderBy('updated_at')} />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: UserContact) => {
              return usersErrors && usersErrors.length > 0 ? (
                <tr>
                  <td colSpan={12}>{usersErrors[0].message}</td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td className="column-id sticky-start">{user.id}</td>
                  <td className="column-first-name sticky-start">{user.first_name}</td>
                  <td className="column-last-name sticky-start">{user.last_name}</td>
                  <td>{t(`GENDERS.${user.gender}`)}</td>
                  <td>{Utilities.formatISOToStringDate(user.birth_date)}</td>
                  <td>{user.email}</td>
                  <td>{user.username ?? '--'}</td>
                  <td>{t(`USER_ROLES.${user.role_id}`)}</td>
                  <td>{user.language}</td>
                  <td>{t(`USER_ACTIVE.${String(user.active).toUpperCase()}`)}</td>
                  <td>{user.created_at && Utilities.dateFormat(user.created_at, router, 'PPpp')}</td>
                  <td>{Utilities.dateFormat(user.updated_at, router, 'PPpp')}</td>
                  <td className="sticky-end">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="w-full px-4 py-2 hover:text-highlight">
                          <FontAwesomeIcon
                            icon="ellipsis-vertical"
                            aria-label={t('TABLE.ACTIONS.TOGGLE_DROPDOWN', { ns: 'admin' })}
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute z-10 right-0 min-w-max p-2 divide-y divide-light-mode-border rounded-md shadow-lg bg-light-mode-foreground origin-top-right dark:divide-dark-mode-border dark:bg-dark-mode-foreground dark:text-dark-mode-text">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    { 'bg-light-mode-background dark:bg-dark-mode-background': active },
                                    'group flex gap-2 items-center w-full px-1 py-2 rounded-md text-light-mode-text dark:text-dark-mode-text'
                                  )}
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsUserProfileModalOpen(true)
                                  }}
                                >
                                  <FontAwesomeIcon icon="user-edit" />
                                  {t('TABLE.ACTIONS.EDIT_USER', { ns: 'admin' })}
                                </button>
                              )}
                            </Menu.Item>
                            {user.id != 1 && user.id != props.userToken.id && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={classNames(
                                      { 'bg-light-mode-background dark:bg-dark-mode-background': active },
                                      'group flex gap-2 items-center w-full px-1 py-2 rounded-md text-light-mode-text dark:text-dark-mode-text'
                                    )}
                                    onClick={() => {
                                      sendResetPasswordLink(user)
                                    }}
                                  >
                                    <FontAwesomeIcon icon="key" />
                                    {t('TABLE.ACTIONS.RESET_PASSWORD', { ns: 'admin' })}
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                          </div>
                          <div className={classNames({ hidden: user.id == 1 }, 'px-1 py-1')}>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    { 'bg-light-mode-background dark:bg-dark-mode-background': active },
                                    { '!text-light-mode-error dark:!text-dark-mode-error': user.active },
                                    { '!text-light-mode-success dark:!text-dark-mode-success': !user.active },
                                    'group flex gap-2 items-center w-full px-1 py-2 rounded-md text-light-mode-text dark:text-dark-mode-text'
                                  )}
                                  onClick={() => {
                                    setSelectedUser(user)
                                    user.active
                                      ? setIsDeactivateAccountModalOpen(true)
                                      : setIsActivateAccountModalOpen(true)
                                  }}
                                >
                                  <FontAwesomeIcon icon={user.active ? 'lock' : 'lock-open'} />
                                  {t(`TABLE.ACTIONS.${user.active ? 'DEACTIVATE' : 'ACTIVATE'}_ACCOUNT`, {
                                    ns: 'admin',
                                  })}
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="table-pagination__items-displayed">
          {t('TABLE.PAGINATION.CURRENT_PAGE', {
            offset: getUsersParams.offset === 0 ? 1 : getUsersParams.offset,
            lastItem:
              getUsersParams.offset + getUsersParams.limit >= getUsersCount
                ? getUsersCount
                : getUsersParams.offset + getUsersParams.limit,
            total: getUsersCount,
          })}
        </div>
        <div className="table-pagination__navigation">
          <ol>
            <li>
              <Button type="button" disabled={isFirstPage()} onClick={() => goToPreviousPage()}>
                <FontAwesomeIcon icon="chevron-left" />
              </Button>
            </li>
            <li>
              <Button type="button" disabled={isLastPage()} onClick={() => goToNextPage()}>
                <FontAwesomeIcon icon="chevron-right" />
              </Button>
            </li>
          </ol>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        user={selectedUser}
        isModal
        isModalOpen={isUserProfileModalOpen}
        onCancel={() => setIsUserProfileModalOpen(false)}
        onConfirm={() => {
          getUsers()
          setIsUserProfileModalOpen(false)
        }}
      />

      {/* Deactivate Account Modal */}
      <Modal
        title={t('DEACTIVATE_ACCOUNT_MODAL.TITLE', { ns: 'admin' })}
        isOpen={isDeactivateAccountModalOpen}
        confirmButton={{
          text: t('DEACTIVATE_ACCOUNT_MODAL.CONFIRM_BUTTON', { ns: 'admin' }),
          isDanger: true,
        }}
        onCancel={() => setIsDeactivateAccountModalOpen(false)}
        onConfirm={() => deactivateAccount()}
      >
        {t('DEACTIVATE_ACCOUNT_MODAL.MESSAGE', { ns: 'admin', user: selectedUser })}
      </Modal>

      {/* Activate Account Modal */}
      <Modal
        title={t('ACTIVATE_ACCOUNT_MODAL.TITLE', { ns: 'admin' })}
        isOpen={isActivateAccountModalOpen}
        confirmButton={{
          text: t('ACTIVATE_ACCOUNT_MODAL.CONFIRM_BUTTON', { ns: 'admin' }),
        }}
        onCancel={() => setIsActivateAccountModalOpen(false)}
        onConfirm={() => activateAccount()}
      >
        {t('ACTIVATE_ACCOUNT_MODAL.MESSAGE', { ns: 'admin', user: selectedUser })}
      </Modal>
    </>
  )
}

export const getServerSideProps = async (context: ServerSideContext) => {
  const token = getAuthCookie(context.req) || null

  if (!token) return Common.SERVER_SIDE_PROPS.NO_TOKEN

  const decodedToken = token && jwt_decode(token)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
        'admin',
        'account',
      ])),
      userToken: decodedToken?.user,
    },
  }
}

export default Admin
