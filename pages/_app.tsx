import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify'
import AppLayout from 'components/AppLayout'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
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
    </AppLayout>
  )
}

export default appWithTranslation(MyApp)
