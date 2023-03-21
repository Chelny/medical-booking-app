import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import { useTranslation } from 'next-i18next'
import ActiveLink from 'components/ActiveLink'
import { Routes } from 'constants/routes'
import { UserRole } from 'enums/user-role.enum'
import styles from 'styles/modules/Nav.module.css'

type NavProps = {
  user: User | undefined
  isAuthRoute?: boolean
}

const Nav = ({ user }: NavProps): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <nav className={styles.nav}>
      <ul>
        {!user && router.route !== Routes.HOME && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HOME}>
              <a>
                <FontAwesomeIcon icon="house" title={t('ROUTES.HOME')} aria-label={t('ROUTES.HOME')} />
                {t('ROUTES.HOME')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.DASHBOARD}>
              <a>
                <FontAwesomeIcon icon="house" title={t('ROUTES.DASHBOARD')} aria-label={t('ROUTES.DASHBOARD')} />
                {t('ROUTES.DASHBOARD')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id !== UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.APPOINTMENTS}>
              <a>
                <FontAwesomeIcon
                  icon="calendar-check"
                  title={t('ROUTES.APPOINTMENTS')}
                  aria-label={t('ROUTES.APPOINTMENTS')}
                />
                {t('ROUTES.APPOINTMENTS')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id === UserRole.ADMIN && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ADMIN}>
              <a>
                <FontAwesomeIcon icon="users-gear" title={t('ROUTES.ADMIN')} aria-label={t('ROUTES.ADMIN')} />
                {t('ROUTES.ADMIN')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.ACCOUNT}>
              <a>
                <FontAwesomeIcon
                  icon={user.role_id === UserRole.DOCTOR ? 'user-doctor' : 'user'}
                  title={t('ROUTES.ACCOUNT')}
                  aria-label={t('ROUTES.ACCOUNT')}
                />
                {t('ROUTES.ACCOUNT')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.HELP}>
              <a>
                <FontAwesomeIcon icon="circle-question" title={t('ROUTES.HELP')} aria-label={t('ROUTES.HELP')} />
                {t('ROUTES.HELP')}
              </a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName={styles.active} href={Routes.LOGOUT}>
              <a>
                <FontAwesomeIcon icon="right-from-bracket" title={t('ROUTES.LOGOUT')} aria-label={t('ROUTES.LOGOUT')} />
                {t('ROUTES.LOGOUT')}
              </a>
            </ActiveLink>
          </li>
        )}
      </ul>
      {/* <FontAwesomeIcon icon="sun" /> */}
      {/* <FontAwesomeIcon icon="moon" /> */}
    </nav>
  )
}

export default Nav
