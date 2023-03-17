import { ReactElement } from 'react'

type PageLayoutProps = {
  children: ReactElement
}

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  return <section className="p-4">{children}</section>
}

export default PageLayout
