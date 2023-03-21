import { ReactElement } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@prisma/client'
import { useTranslation } from 'next-i18next'
import { Routes } from 'constants/routes'

type PageLayoutProps = {
  children: ReactElement | ReactElement[]
  user: User | undefined
  isAuthRoute: boolean
}

const PageLayout = ({ children, user, isAuthRoute }: PageLayoutProps): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <section
      className={`p-4 overflow-auto ${
        isAuthRoute ? '' : 'lg:grid lg:auto-rows-max lg:auto-cols-[500px] lg:justify-center lg:content-center'
      }`}
    >
      {typeof user === 'undefined' && !isAuthRoute && router.route !== Routes.HOME && (
        <Link href={Routes.HOME} className="mb-4 uppercase no-underline hover:text-black dark:hover:text-white">
          <FontAwesomeIcon icon="long-arrow-left" /> {t('BUTTON.BACK')}
        </Link>
      )}
      {children}
    </section>
  )
}

export default PageLayout
