import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import { ActiveLink, ThemeSelector } from 'components'
import { Routes } from 'constantss'
import { UserRole } from 'enums'
import { useRequest } from 'hooks'
import styles from './Nav.module.css'

type NavProps = {
  user: User | undefined
}

type LogoutGQLResponse = GQLResponse<{ logout: { message: string } }>

export const Nav = (props: NavProps): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()

  const logout = async () => {
    const { data, errors } = await useRequest<LogoutGQLResponse>(`mutation { logout { message } }`)
    if (data) toast.success<string>(t('SUCCESS.LOGOUT', { ns: 'api' }))
    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  return (
    <nav className={styles.nav}>
      <ul>
        {!props.user && router.route !== Routes.HOME && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HOME}>
              <a title={t('ROUTES.HOME')}>
                <FontAwesomeIcon icon="house" aria-label={t('ROUTES.HOME')} />
                <span>{t('ROUTES.HOME')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {props.user && props.user.role_id !== UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.DASHBOARD}>
              <a title={t('ROUTES.DASHBOARD')}>
                <FontAwesomeIcon icon="house" aria-label={t('ROUTES.DASHBOARD')} />
                <span>{t('ROUTES.DASHBOARD')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {props.user && props.user.role_id === UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ADMIN}>
              <a title={t('ROUTES.ADMIN')}>
                <FontAwesomeIcon icon="users-gear" aria-label={t('ROUTES.ADMIN')} />
                <span>{t('ROUTES.ADMIN')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {/* {props.user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ACCOUNT}>
              <a title={t('ROUTES.ACCOUNT')}>
                <FontAwesomeIcon
                  icon={user.role_id === UserRole.DOCTOR ? 'user-doctor' : 'user'}
                  aria-label={t('ROUTES.ACCOUNT')}
                />
                <span>{t('ROUTES.ACCOUNT')}</span>
              </a>
            </ActiveLink>
          </li>
        )} */}
        {/* {props.user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HELP}>
              <a title={t('ROUTES.HELP')}>
                <FontAwesomeIcon icon="circle-question" aria-label={t('ROUTES.HELP')} />
                <span>{t('ROUTES.HELP')}</span>
              </a>
            </ActiveLink>
          </li>
        )} */}
        {props.user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HOME}>
              <a title={t('ROUTES.LOGOUT')} onClick={logout}>
                <FontAwesomeIcon icon="right-from-bracket" aria-label={t('ROUTES.LOGOUT')} />
                <span>{t('ROUTES.LOGOUT')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
      </ul>
      <ThemeSelector />
    </nav>
  )
}
