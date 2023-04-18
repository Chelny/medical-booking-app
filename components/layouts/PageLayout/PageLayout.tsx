import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import classNames from 'classnames'
import BackButton from 'components/elements/BackButton/BackButton'
import { Routes } from 'constants/routes'
import styles from './PageLayout.module.css'

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
    <section className={`${styles.layout} ${classNames({ [styles.unauthLayout]: !isAuthRoute })}`}>
      {typeof user === 'undefined' && !isAuthRoute && router.route !== Routes.HOME && (
        <BackButton handleClick={goBackToHome} />
      )}
      {children}
    </section>
  )
}

export default PageLayout
