import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { Nav } from 'components'
import { Common } from 'constantss'
import { useWindowSize } from 'hooks'
import styles from './Header.module.css'

type HeaderProps = {
  user: User | undefined
  isAuthRoute: boolean
}

export const Header = (props: HeaderProps): JSX.Element => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const router = useRouter()
  const [isNavBarExpanded, setIsNavBarExpanded] = useState<boolean>(false)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsNavBarExpanded(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  if (!props.isAuthRoute && width < Common.BREAKPOINT.LG) {
    return (
      <header className={`${styles.header} ${styles.unauthHandheldHeader}`}>
        <h1 className={styles.unauthHandheldTitle}>{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (!props.isAuthRoute && width >= Common.BREAKPOINT.LG) {
    return (
      <header className={`${styles.header} ${styles.unauthDesktopHeader}`}>
        <h1 className={styles.unauthDesktopTitle}>{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (props.isAuthRoute && width < Common.BREAKPOINT.LG) {
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
          <Nav user={props.user} />
        </div>
      </header>
    )
  }

  // isAuthRoute && width >= Common.BREAKPOINT.LG
  return (
    <header className={`${styles.header} ${styles.authDesktopHeader}`}>
      <h1 className={styles.authDesktopTitle}>{Common.APP_NAME}</h1>
      <Nav user={props.user} />
    </header>
  )
}
