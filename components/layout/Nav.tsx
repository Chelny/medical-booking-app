import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import ActiveLink from 'components/ActiveLink'
import ThemeSelector from 'components/ThemeSelector'
import { Routes } from 'constants/routes'
import { UserRole } from 'enums/user-role.enum'
import { useRequest } from 'hooks/useRequest'
import styles from 'styles/modules/Nav.module.css'

type NavProps = {
  user: User | undefined
}

type LogoutGQLResponse = GQLResponse<{ logout: { message: string } }>

const Nav = ({ user }: NavProps): JSX.Element => {
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
        {!user && router.route !== Routes.HOME && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HOME}>
              <a title={t('ROUTES.HOME')}>
                <FontAwesomeIcon icon="house" title={t('ROUTES.HOME')} aria-label={t('ROUTES.HOME')} />
                <span>{t('ROUTES.HOME')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id !== UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.DASHBOARD}>
              <a title={t('ROUTES.DASHBOARD')}>
                <FontAwesomeIcon icon="house" title={t('ROUTES.DASHBOARD')} aria-label={t('ROUTES.DASHBOARD')} />
                <span>{t('ROUTES.DASHBOARD')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id === UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ADMIN}>
              <a title={t('ROUTES.ADMIN')}>
                <FontAwesomeIcon icon="users-gear" title={t('ROUTES.ADMIN')} aria-label={t('ROUTES.ADMIN')} />
                <span>{t('ROUTES.ADMIN')}</span>
              </a>
            </ActiveLink>
          </li>
        )}
        {/* {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ACCOUNT}>
              <a title={t('ROUTES.ACCOUNT')}>
                <FontAwesomeIcon
                  icon={user.role_id === UserRole.DOCTOR ? 'user-doctor' : 'user'}
                  title={t('ROUTES.ACCOUNT')}
                  aria-label={t('ROUTES.ACCOUNT')}
                />
                <span>{t('ROUTES.ACCOUNT')}</span>
              </a>
            </ActiveLink>
          </li>
        )} */}
        {/* {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HELP}>
              <a title={t('ROUTES.HELP')}>
                <FontAwesomeIcon icon="circle-question" title={t('ROUTES.HELP')} aria-label={t('ROUTES.HELP')} />
                <span>{t('ROUTES.HELP')}</span>
              </a>
            </ActiveLink>
          </li>
        )} */}
        {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HOME}>
              <a title={t('ROUTES.LOGOUT')} onClick={logout}>
                <FontAwesomeIcon icon="right-from-bracket" title={t('ROUTES.LOGOUT')} aria-label={t('ROUTES.LOGOUT')} />
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

export default Nav
