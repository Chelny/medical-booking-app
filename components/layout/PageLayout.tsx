import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import BackButton from 'components/BackButton'
import { Routes } from 'constants/routes'

type PageLayoutProps = {
  children: ReactElement | ReactElement[]
  user: User | undefined
  isAuthRoute: boolean
}

const PageLayout = ({ children, user, isAuthRoute }: PageLayoutProps): JSX.Element => {
  const router = useRouter()

  const goBackToHome = () => {
    router.push(Routes.HOME)
  }

  return (
    <section
      className={`p-4 overflow-auto ${
        isAuthRoute ? '' : 'lg:grid lg:auto-rows-max lg:auto-cols-[500px] lg:justify-center lg:content-center'
      }`}
    >
      {typeof user === 'undefined' && !isAuthRoute && router.route !== Routes.HOME && (
        <BackButton handleClick={goBackToHome} />
      )}
      {children}
    </section>
  )
}

export default PageLayout
