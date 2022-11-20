import { User } from '@prisma/client'
import Nav from 'components/Nav'
import { Common } from 'constants/common'

type TopNavProps = {
  user?: User
  isAuthRoute: boolean
}

const TopNav = ({ user, isAuthRoute }: TopNavProps): JSX.Element => {
  return (
    <header className="flex flex-col justify-between p-4 bg-landing bg-no-repeat bg-center bg-cover bg-primary">
      <div className="flex justify-between items-center">
        <h1>{Common.APP_NAME}</h1>
      </div>
      {!isAuthRoute && <Nav user={user} isAuthRoute={isAuthRoute} />}
    </header>
  )
}

export default TopNav
