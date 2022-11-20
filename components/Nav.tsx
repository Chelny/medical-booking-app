import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import ActiveLink from 'components/ActiveLink'
import { Routes } from 'constants/routes'

type NavProps = {
  user?: User
  isAuthRoute?: boolean
}

const Nav = ({ user, isAuthRoute }: NavProps): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <nav className={`w-full ${isAuthRoute ? 'auth-route' : ''}`}>
      <ul>
        {!user && router.route !== Routes.HOME && (
          <li>
            <ActiveLink activeClassName="active" href={Routes.HOME}>
              <a>{isAuthRoute ? <FontAwesomeIcon icon="house" aria-label={t('ROUTES.HOME')} /> : t('ROUTES.HOME')}</a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName="active" href={Routes.DASHBOARD}>
              <a>
                <FontAwesomeIcon icon="house" aria-label={t('ROUTES.DASHBOARD')} />
              </a>
            </ActiveLink>
          </li>
        )}
        {user && (
          <li>
            <ActiveLink activeClassName="active" href={Routes.APPOINTMENTS}>
              <a>
                <FontAwesomeIcon
                  icon="calendar-check"
                  title={t('ROUTES.APPOINTMENTS')}
                  aria-label={t('ROUTES.APPOINTMENTS')}
                />
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id === 2 && (
          <li>
            <ActiveLink activeClassName="active" href={Routes.ACCOUNT}>
              <a>
                <FontAwesomeIcon icon="user-doctor" aria-label={t('ROUTES.ACCOUNT')} />
              </a>
            </ActiveLink>
          </li>
        )}
        {user && user.role_id === 3 && (
          <li>
            <ActiveLink activeClassName="active" href={Routes.ACCOUNT}>
              <a>
                <FontAwesomeIcon icon="user" aria-label={t('ROUTES.ACCOUNT')} />
              </a>
            </ActiveLink>
          </li>
        )}
        {/* {user && (
          <li>
            <FontAwesomeIcon icon="gear" aria-label={t('ROUTES.')} />
            <ActiveLink activeClassName="active" href={Routes.SETTINGS}>{t('ROUTES.SETTINGS')}</ActiveLink>
          </li>
        )} */}
        {/* {user && (
          <li>
            <FontAwesomeIcon icon="circle-question" aria-label={t('ROUTES.')} />
            <ActiveLink activeClassName="active" href={Routes.HELP}>{t('ROUTES.HELP')}</ActiveLink>
          </li>
        )} */}
        {/* {user && (
          <li>
            <FontAwesomeIcon icon="right-from-bracket" />
            <ActiveLink activeClassName="active" href={Routes.LOGOUT}>{t('ROUTES.LOGOUT')}</ActiveLink>
          </li>
        )} */}
      </ul>
      {/* <FontAwesomeIcon icon="sun" /> */}
      {/* <FontAwesomeIcon icon="moon" /> */}
    </nav>
  )
}

export default Nav
