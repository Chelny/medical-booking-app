import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import router from 'next/router'
// (config) Prevent fontawesome from adding its CSS since we did it manually below:
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { isEqual } from 'lodash-es'
import { appWithTranslation } from 'next-i18next'
import { ToastContainer, Flip, Slide } from 'react-toastify'
import Footer from 'components/layout/Footer'
import Header from 'components/layout/Header'
import Nav from 'components/layout/Nav'
import PageLayout from 'components/layout/PageLayout'
import { Common } from 'constants/common'
import { useWindowSize } from 'hooks/useWindowSize'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-calendar/dist/Calendar.css'
import 'styles/globals.css'

config.autoAddCss = false
library.add(fas)

function MyApp({ Component, pageProps }: AppProps) {
  const { width } = useWindowSize()
  const [isAuthRoute, setIsAuthRoute] = useState(false)
  const [user, setUser] = useState()

  useEffect(() => {
    const isAuthRoute = !Common.UNAUTH_ROUTES.find((route: string) => isEqual(router.route, route))
    setIsAuthRoute(isAuthRoute)
    setUser(pageProps.userToken)
  }, [pageProps])

  return (
    <>
      <Head>
        <title>{Common.APP_NAME}</title>
        <meta name="description" content="Book a medical appointment!" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="viewport-fit=cover, initial-scale=1.0, width=device-width, height=device-height, user-scalable=no"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#5B4B8A" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#4C3575" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`grid min-h-full ${
          isAuthRoute
            ? 'grid-areas-layout-auth lg:grid-areas-layout-auth-lg grid-rows-layout-auth lg:grid-rows-layout-auth-lg grid-cols-layout-auth lg:grid-cols-layout-auth-lg'
            : 'grid-areas-layout-unauth lg:grid-areas-layout-unauth-lg grid-rows-layout-unauth lg:grid-rows-layout-unauth-lg grid-cols-layout-unauth lg:grid-cols-layout-unauth-lg'
        }`}
      >
        {width < Common.BREAKPOINT.LG ? (
          <Header
            user={user}
            isAuthRoute={isAuthRoute}
            className={`grid justify-center content-center p-4 ${
              isAuthRoute
                ? 'bg-gradient-to-b from-primary-day via-primary-day-tint to-light-tint text-center dark:from-primary-night-shade dark:to-dark'
                : 'bg-landing bg-primary-day-tint bg-no-repeat bg-center bg-cover dark:bg-primary-night'
            } `}
          />
        ) : (
          <div
            className={`grid-in-sidebar ${
              isAuthRoute
                ? 'bg-light text-center dark:bg-dark-shade'
                : 'grid justify-center content-center bg-landing bg-primary-day-tint bg-no-repeat bg-center bg-cover dark:bg-primary-night'
            } p-4`}
          >
            <Header user={user} isAuthRoute={isAuthRoute} />
            {isAuthRoute && width >= Common.BREAKPOINT.LG && <Nav user={user} isAuthRoute={isAuthRoute} />}
          </div>
        )}
        <main className="grid grid-rows-main overflow-hidden">
          <PageLayout user={user} isAuthRoute={isAuthRoute}>
            <Component {...pageProps} />
          </PageLayout>
          <ToastContainer
            position={width < Common.BREAKPOINT.MD ? 'top-center' : 'top-right'}
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            draggable={false}
            pauseOnFocusLoss
            pauseOnHover
            transition={width < Common.BREAKPOINT.MD ? Flip : Slide}
            theme="colored"
          />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default appWithTranslation(MyApp)
