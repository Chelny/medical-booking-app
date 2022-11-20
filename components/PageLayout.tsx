type PageLayoutProps = {
  children: JSX.Element
}

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  return <section className="p-4 overflow-y-auto">{children}</section>
}

export default PageLayout
