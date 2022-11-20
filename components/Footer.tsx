import { User } from '@prisma/client'
import LanguageSelector from 'components/LanguageSelector'
import Nav from 'components/Nav'

type FooterProps = {
  user?: User
  isAuthRoute: boolean
}

const Footer = ({ user, isAuthRoute }: FooterProps): JSX.Element => {
  return (
    <footer className="bg-primary-day text-medium-shade text-xs text-center dark:bg-dark-shade">
      {isAuthRoute ? <Nav user={user} isAuthRoute={isAuthRoute} /> : <LanguageSelector />}
    </footer>
  )
}

export default Footer
