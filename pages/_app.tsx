import type { AppProps } from 'next/app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { isEqual } from 'lodash-es'
import Head from 'next/head'
import router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { ToastContainer, Flip } from 'react-toastify'
import Aside from 'components/Aside'
import Footer from 'components/Footer'
import TopNav from 'components/TopNav'
import { Common } from 'constants/common'
import { Routes } from 'constants/routes'
import { useWindowSize } from 'hooks/useWindowSize'
import 'react-toastify/dist/ReactToastify.css'
import 'react-calendar/dist/Calendar.css'
import 'styles/globals.css'

library.add(fas)

function MyApp({ Component, pageProps }: AppProps) {
  const { width, height } = useWindowSize()
  const [isAuthRoute, setIsAuthRoute] = useState(false)
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unauthRoutes = [Routes.HOME, Routes.SIGN_UP, Routes.FORGOT_PASSWORD, Routes.RESET_PASSWORD]
    setIsAuthRoute(!unauthRoutes.find((route: string) => isEqual(router.route, route)))
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

      <div className="grid grid-rows-app-layout grid-cols-app-layout min-h-full md:landscape:grid-rows-app-layout-md">
        {(width < Common.BREAKPOINT.MD || width <= height) && <TopNav user={user} isAuthRoute={isAuthRoute} />}
        <main className="grid grid-rows-main overflow-scroll lg:landscape:grid-rows-main-lg lg:landscape:grid-cols-main-lg">
          {width >= Common.BREAKPOINT.MD && width > height && <Aside />}
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            draggable={false}
            pauseOnFocusLoss
            pauseOnHover
            transition={Flip}
            theme="colored"
          />
        </main>
        <Footer user={user} isAuthRoute={isAuthRoute} />
      </div>
    </>
  )
}

export default appWithTranslation(MyApp)
