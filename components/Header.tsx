import { Routes } from 'constants/routes'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <header className="pb-4">
      <nav>{router.route !== Routes.HOME && <Link href={Routes.HOME}>{t('ROUTES.HOME')}</Link>}</nav>
    </header>
  )
}

export default Header
