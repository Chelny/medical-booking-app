import { User } from '@prisma/client'
import LanguageSelector from 'components/LanguageSelector'
import './Footer.css'

type FooterProps = {
  user: User | undefined
  isAuthRoute: boolean
}

const Footer = ({ isAuthRoute }: FooterProps): JSX.Element => {
  return (
    <footer className="py-4 bg-light text-medium-shade text-xs text-center dark:bg-dark-shade">
      <LanguageSelector />
    </footer>
  )
}

export default Footer
