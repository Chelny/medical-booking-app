import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import Nav from 'components/layout/Nav'
import { Common } from 'constants/common'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from 'styles/modules/Header.module.css'

type HeaderProps = {
  user: User | undefined
  isAuthRoute: boolean
}

const Header = ({ user, isAuthRoute }: HeaderProps): JSX.Element => {
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
  }, [])

  if (!isAuthRoute && width < Common.BREAKPOINT.LG) {
    return (
      <header
        className={`${styles.header} grid justify-center content-center p-4 bg-landing bg-primary-day-tint bg-no-repeat bg-center bg-cover dark:bg-primary-night`}
      >
        <h1 className="text-3xl">{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (!isAuthRoute && width >= Common.BREAKPOINT.LG) {
    return (
      <header
        className={`${styles.header} grid-in-sidebar grid justify-center content-center bg-landing bg-primary-day-tint bg-no-repeat bg-center bg-cover dark:bg-primary-night`}
      >
        <h1 className="text-4xl">{Common.APP_NAME}</h1>
      </header>
    )
  }

  if (isAuthRoute && width < Common.BREAKPOINT.LG) {
    return (
      <header
        className={`${styles.header} relative grid grid-cols-[1fr_max-content] justify-center content-center p-4 bg-gradient-to-b from-primary-day via-primary-day-tint to-light-tint dark:from-primary-night-shade dark:to-dark`}
      >
        {/* App name or logo */}
        <h1 className="text-2xl">{Common.APP_NAME}</h1>
        {/* Hamburger icon */}
        <button onClick={() => setIsNavBarExpanded(!isNavBarExpanded)}>
          <FontAwesomeIcon icon={isNavBarExpanded ? 'xmark' : 'bars'} size="2x" />
        </button>
        {/* Navigation */}
        <div
          className={`absolute top-[100%] z-10 overflow-hidden w-full bg-light dark:bg-dark-shade ${
            isNavBarExpanded
              ? 'min-h-nav-expanded max-h-full'
              : 'max-h-0 transition-[max-height] duration-[15000] ease-out'
          }`}
        >
          <Nav user={user} />
        </div>
      </header>
    )
  }

  // isAuthRoute && width >= Common.BREAKPOINT.LG
  return (
    <header className={`${styles.header} flex items-center gap-10 p-4 bg-light text-center dark:bg-dark-shade`}>
      <h1 className="text-2xl mb-8 lg:mb-0">{Common.APP_NAME}</h1>
      <Nav user={user} />
    </header>
  )
}

export default Header
