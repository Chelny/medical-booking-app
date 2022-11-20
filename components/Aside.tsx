import { Common } from 'constants/common'

const Aside = (): JSX.Element => {
  return (
    <aside className="flex flex-col justify-start p-4 bg-landing bg-no-repeat bg-center bg-cover bg-primary text-center">
      <header>
        <h1>{Common.APP_NAME}</h1>
      </header>
    </aside>
  )
}

export default Aside
