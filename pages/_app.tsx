import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import router from 'next/router'
// (config) Prevent fontawesome from adding its CSS since we did it manually below:
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { User } from '@prisma/client'
import { isEqual } from 'lodash-es'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { ThemeProvider } from 'next-themes'
import { ToastContainer, Flip, Slide } from 'react-toastify'
import { Footer, Header, PageLayout } from 'components'
import { Common } from 'constantss'
import { useWindowSize } from 'hooks'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-calendar/dist/Calendar.css'
import 'styles/globals.css'

config.autoAddCss = false
library.add(far, fas)

function MyApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation()
  const { width } = useWindowSize()
  const [isAuthRoute, setIsAuthRoute] = useState<boolean>(false)
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    // Set app's direction according to locale direction
    document.body.dir = i18n.dir()

    const isAuthRoute = !Common.UNAUTH_ROUTES.find((route: string) => isEqual(router.route, route))
    setIsAuthRoute(isAuthRoute)
    setUser(pageProps.userToken)
  }, [i18n, pageProps])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{Common.APP_NAME}</title>
        <meta name="description" content="Book a medical appointment with the doctor of your choice!" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="viewport-fit=cover, initial-scale=1.0, width=device-width, height=device-height, user-scalable=no"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F1F5F9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1B1C22" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link href="styles/styles.css" rel="stylesheet" /> */}
      </Head>

      <ThemeProvider enableSystem={true} attribute="class">
        <div
          className={`grid min-h-full ${
            isAuthRoute
              ? 'grid-areas-layout-auth grid-rows-layout-auth grid-cols-layout-auth lg:grid-areas-layout-auth-lg lg:grid-rows-layout-auth-lg lg:grid-cols-layout-auth-lg'
              : 'grid-areas-layout-unauth grid-rows-layout-unauth grid-cols-layout-unauth lg:grid-areas-layout-unauth-lg lg:grid-rows-layout-unauth-lg lg:grid-cols-layout-unauth-lg'
          }`}
        >
          <Header user={user} isAuthRoute={isAuthRoute} />
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
      </ThemeProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
