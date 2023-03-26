import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Prisma, User, User_gender } from '@prisma/client'
import { GraphQLError } from 'graphql'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import Button from 'components/Button'
import Modal, { ModalSize } from 'components/Modal'
import ColumnSort from 'components/table/ColumnSort'
import TableColFilterPopover from 'components/table/TableColFilterPopover'
import UserProfile from 'components/UserProfile'
import { GendersMap } from 'configs/genders.enum'
import { LanguagesMap } from 'configs/locales'
import { Common } from 'constants/common'
import { IGetUsersParams } from 'dtos/get-users.params'
import { IGetUsersResponse } from 'dtos/get-users.response'
import { UserContact } from 'dtos/user-contact.response'
import { UserRolesMap } from 'enums/user-role.enum'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'
import { TextFormatUtil } from 'utils/text-format'

type AdminProps = {
  userToken: User
}

type GetUsersGQLResponse = GQLResponse<{ getUsers: IGetUsersResponse }>
type ForgotPasswordGQLResponse = GQLResponse<{ forgotPassword: { message: string } }>
type DeleteUserGQLResponse = GQLResponse<{ deleteUser: { message: string } }>

const Admin: NextPage<AdminProps> = ({ userToken }): JSX.Element => {
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
    orderBy: 'id',
    sort: Prisma.SortOrder.asc,
  })
  const [getUsersCount, setGetUsersCount] = useState<number>(0)
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false)
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<UserContact>({} as UserContact)

  useEffect(
    () => {
      getUsers()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getUsersParams]
  )

  const getUsers = async () => {
    setUsers([])
    setGetUsersCount(0)
    setUsersErrors([])

    await useRequest<GetUsersGQLResponse>(
      `{
        getUsers(
          offset: ${getUsersParams.offset},
          limit: ${getUsersParams.limit},
          query: "${getUsersParams.query}",
          genders: ${JSON.stringify(getUsersParams.genders)},
          roles: ${JSON.stringify(getUsersParams.roles)},
          languages: ${JSON.stringify(getUsersParams.languages)},
          orderBy: "${getUsersParams.orderBy}",
          sort: "${getUsersParams.sort}"
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
            created_at,
            updated_at,
            Contact {
              address,
              address_line2,
              city,
              region,
              country,
              postal_code,
              phone_number,
              phone_ext
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

  const addUser = () => {
    setSelectedUser({} as UserContact)
    setIsUserProfileModalOpen(true)
  }

  const setItemsPerPage = (resultsPerPage: number) => {
    setGetUsersParams({ ...getUsersParams, offset: 0, limit: resultsPerPage })
  }

  const filterResultsByQuery = (query: string) => {
    const queryLength = query.trim().length
    if (queryLength === 0 || queryLength >= Common.SEARCH.QUERY_MIN_LENGTH) {
      setGetUsersParams({ ...getUsersParams, offset: 0, query })
    }
  }

  const orderBy = (field: string) => {
    let sort: Prisma.SortOrder = Prisma.SortOrder.asc

    if (field === getUsersParams.orderBy) {
      if (getUsersParams.sort === Prisma.SortOrder.asc) {
        sort = Prisma.SortOrder.desc
      }
    }

    setGetUsersParams({ ...getUsersParams, orderBy: field, sort })
  }

  const ariaSort = (field: string) => {
    return getUsersParams.orderBy !== field
      ? 'none'
      : getUsersParams.sort === Prisma.SortOrder.asc
      ? 'ascending'
      : 'descending'
  }

  const isFirstPage = () => getUsersParams.offset <= 0

  const isLastPage = () => getUsersParams.offset + getUsersParams.limit >= getUsersCount

  const goToPreviousPage = () => {
    setGetUsersParams({ ...getUsersParams, offset: getUsersParams.offset - getUsersParams.limit })
  }

  // TODO: Jump to page
  // const goToPage = () => {
  //   setGetUsersOffset(getUsersParams.offset - getUsersParams.limit)
  // }

  const goToNextPage = () => {
    setGetUsersParams({ ...getUsersParams, offset: getUsersParams.offset + getUsersParams.limit })
  }

  const sendResetPasswordLink = async (user: User) => {
    const { data, errors } = await useRequest<ForgotPasswordGQLResponse>(
      `{ forgotPassword(email: "${user.email}") { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.forgotPassword.message}`, { ns: 'api', email: user.email }))
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  const deleteUser = async () => {
    const { data, errors } = await useRequest<DeleteUserGQLResponse>(
      `{ deleteUser(id: ${selectedUser.id}) { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.deleteUser.message}`, { ns: 'api' }))
      setIsDeleteUserModalOpen(false)
      getUsers()
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  return (
    <>
      <h2>{t('TITLE', { ns: 'admin' })}</h2>

      <div className="w-fit">
        <Button type="button" className="bg-success" handleClick={() => addUser()}>
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
                  <ColumnSort columnName="id" params={getUsersParams} handleClick={() => orderBy('id')} />
                </div>
              </th>
              <th className="group column-first-name sticky-start" aria-sort={ariaSort('first_name')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.FIRST_NAME')}
                  <ColumnSort
                    columnName="first_name"
                    params={getUsersParams}
                    handleClick={() => orderBy('first_name')}
                  />
                </div>
              </th>
              <th className="group column-last-name sticky-start" aria-sort={ariaSort('last_name')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.LAST_NAME')}
                  <ColumnSort columnName="last_name" params={getUsersParams} handleClick={() => orderBy('last_name')} />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.GENDER')}
                  <TableColFilterPopover
                    list={GendersMap}
                    selectedValues={getUsersParams.genders}
                    translationPrefix="GENDERS"
                    handleChange={(genders: User_gender[]) => setGetUsersParams({ ...getUsersParams, genders })}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('birth_date')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.BIRTH_DATE')}
                  <ColumnSort
                    columnName="birth_date"
                    params={getUsersParams}
                    handleClick={() => orderBy('birth_date')}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('email')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.EMAIL')}
                  <ColumnSort columnName="email" params={getUsersParams} handleClick={() => orderBy('email')} />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('username')}>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.USERNAME')}
                  <ColumnSort columnName="username" params={getUsersParams} handleClick={() => orderBy('username')} />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.ROLE')}
                  <TableColFilterPopover
                    list={UserRolesMap}
                    selectedValues={getUsersParams.roles}
                    translationPrefix="USER_ROLES"
                    handleChange={(roles: number[]) => setGetUsersParams({ ...getUsersParams, roles })}
                  />
                </div>
              </th>
              <th>
                <div className="table-column-wrapper">
                  {t('FORM.LABEL.LANGUAGE')}
                  <TableColFilterPopover
                    list={LanguagesMap}
                    selectedValues={getUsersParams.languages}
                    translationPrefix="LANGUAGES"
                    handleChange={(languages: string[]) => setGetUsersParams({ ...getUsersParams, languages })}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('created_at')}>
                <div className="table-column-wrapper">
                  {t('CREATED_AT')}
                  <ColumnSort
                    columnName="created_at"
                    params={getUsersParams}
                    handleClick={() => orderBy('created_at')}
                  />
                </div>
              </th>
              <th className="group" aria-sort={ariaSort('updated_at')}>
                <div className="table-column-wrapper">
                  {t('UPDATED_AT')}
                  <ColumnSort
                    columnName="updated_at"
                    params={getUsersParams}
                    handleClick={() => orderBy('updated_at')}
                  />
                </div>
              </th>
              <th className="sticky-end">{t('ACTIONS')}</th>
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
                  <td>{TextFormatUtil.formatISOToStringDate(user.birth_date)}</td>
                  <td>{user.email}</td>
                  <td>{user.username ?? '--'}</td>
                  <td>{t(`USER_ROLES.${user.role_id}`)}</td>
                  <td>{user.language}</td>
                  <td>{user.created_at && TextFormatUtil.dateFormat(user.created_at, router, 'PPpp')}</td>
                  <td>{TextFormatUtil.dateFormat(user.updated_at, router, 'PPpp')}</td>
                  <td className="sticky-end">
                    <div className="admin-console__user-actions">
                      <Button
                        type="button"
                        className="text-secondary"
                        handleClick={() => {
                          setSelectedUser(user)
                          setIsUserProfileModalOpen(true)
                        }}
                      >
                        <FontAwesomeIcon icon="user-pen" aria-label={t('TABLE.ACTIONS.EDIT_USER', { ns: 'admin' })} />
                      </Button>
                      <Button
                        type="button"
                        className="text-secondary"
                        disabled={user.id == 1 || user.id == userToken.id}
                        handleClick={() => {
                          if (user.id != 1 && user.id != userToken.id) sendResetPasswordLink(user)
                        }}
                      >
                        <span className="fa-layers fa-fw">
                          <FontAwesomeIcon
                            icon="rotate"
                            size="xl"
                            aria-label={t('TABLE.ACTIONS.RESET_PASSWORD', { ns: 'admin' })}
                          />
                          <FontAwesomeIcon
                            icon="lock"
                            transform="shrink-8 right-1.5"
                            inverse
                            aria-label={t('TABLE.ACTIONS.RESET_PASSWORD', { ns: 'admin' })}
                          />
                        </span>
                      </Button>
                      <Button
                        type="button"
                        className="text-error"
                        disabled={user.id == 1}
                        handleClick={() => {
                          if (user.id != 1) {
                            setSelectedUser(user)
                            setIsDeleteUserModalOpen(true)
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon="user-minus"
                          aria-label={t('TABLE.ACTIONS.DELETE_USER', { ns: 'admin' })}
                        />
                      </Button>
                    </div>
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
              <Button type="button" disabled={isFirstPage()} handleClick={() => goToPreviousPage()}>
                <FontAwesomeIcon icon="chevron-left" />
              </Button>
            </li>
            {/* TODO: Jump to page */}
            {/* <li>
                <Button handleClick={() => goToPage()}></Button>
              </li> */}
            <li>
              <Button type="button" disabled={isLastPage()} handleClick={() => goToNextPage()}>
                <FontAwesomeIcon icon="chevron-right" />
              </Button>
            </li>
          </ol>
        </div>
      </div>

      {/* User Profile Modal */}
      {isUserProfileModalOpen && (
        <UserProfile
          isModal
          user={selectedUser}
          setIsUserProfileModalOpen={setIsUserProfileModalOpen}
          isFormSubmitted={(isSubmitted: boolean) => {
            if (isSubmitted) getUsers()
          }}
        />
      )}

      {/* Delete Profile Modal */}
      <Modal
        modalSize={ModalSize.SM}
        title={t('DELETE_USER_MODAL.TITLE', { ns: 'admin' })}
        isOpen={isDeleteUserModalOpen}
        confirmButton={{
          label: t('BUTTON.DELETE'),
          type: 'DANGER',
        }}
        setIsOpen={setIsDeleteUserModalOpen}
        handleSubmit={deleteUser}
      >
        <>
          {t('DELETE_USER_MODAL.MESSAGE', {
            ns: 'admin',
            user: `${selectedUser.first_name} ${selectedUser.last_name}`,
          })}
        </>
      </Modal>
    </>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
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
