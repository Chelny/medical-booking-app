import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import Nav from 'components/modules/Nav/Nav'
import { Common } from 'constants/common'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from './Header.module.css'

type HeaderProps = {
  user: User | undefined
  isAuthRoute: boolean
}

const Header = ({ user, isAuthRoute }: HeaderProps): JSX.Element => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const router = useRouter()
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsNavBarExpanded(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  if (!isAuthRoute && width < Common.BREAKPOINT.LG) {
    return (
      <header className={`${styles.header} ${styles.unauthHandheldHeader}`}>
        <h1 className={styles.unauthHandheldTitle}>{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (!isAuthRoute && width >= Common.BREAKPOINT.LG) {
    return (
      <header className={`${styles.header} ${styles.unauthDesktopHeader}`}>
        <h1 className={styles.unauthDesktopTitle}>{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (isAuthRoute && width < Common.BREAKPOINT.LG) {
    return (
      <header className={`${styles.header} ${styles.authHandheldHeader}`}>
        {/* App name and/or logo */}
        <h1 className={styles.authHandheldTitle}>{Common.APP_NAME}</h1>
        {/* Hamburger icon */}
        <button onClick={() => setIsNavBarExpanded(!isNavBarExpanded)}>
          <FontAwesomeIcon
            icon={isNavBarExpanded ? 'xmark' : 'bars'}
            size="2x"
            className={styles.authHandheldNavIcon}
            aria-label={t(`ARIA_LABEL.${isNavBarExpanded ? 'CLOSE' : 'MENU'}`)}
          />
        </button>
        {/* Navigation */}
        <div
          className={`${styles.authHandheldNavWrapper} ${classNames({
            [styles.authHandheldNavExpanded]: isNavBarExpanded,
            [styles.authHandheldNavCollapsed]: !isNavBarExpanded,
          })}`}
        >
          <Nav user={user} />
        </div>
      </header>
    )
  }

  // isAuthRoute && width >= Common.BREAKPOINT.LG
  return (
    <header className={`${styles.header} ${styles.authDesktopHeader}`}>
      <h1 className={styles.authDesktopTitle}>{Common.APP_NAME}</h1>
      <Nav user={user} />
    </header>
  )
}

export default Header
