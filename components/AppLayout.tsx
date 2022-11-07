import Meta from 'components/Meta'
import Footer from 'components/Footer'

type AppLayoutProps = {
  children: JSX.Element[]
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <>
      <Meta />
      <div className="grid grid-rows-app-layout grid-cols-app-layout min-h-full">
        <main className="grid grid-rows-main md:landscape:grid-rows-main-md md:landscape:grid-cols-main-md">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default AppLayout
