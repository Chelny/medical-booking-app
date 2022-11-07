import Header from 'components/Header'
import { Common } from 'constants/common'

type DefaultLayoutProps = {
  children: JSX.Element
}

const DefaultLayout = ({ children }: DefaultLayoutProps): JSX.Element => {
  return (
    <>
      <section className="p-4 bg-landing bg-no-repeat bg-center bg-cover bg-primary">
        <h1>{Common.APP_NAME}</h1>
      </section>
      <section className="p-4">
        <Header />
        {children}
      </section>
    </>
  )
}

export default DefaultLayout
