import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import classNames from 'classnames'
import { BackButton } from 'components'
import { Routes } from 'constantss'
import styles from './PageLayout.module.css'

type PageLayoutProps = {
  children: ReactNode
  user: User | undefined
  isAuthRoute: boolean
}

export const PageLayout = (props: PageLayoutProps): JSX.Element => {
  const router = useRouter()

  const goBackToHome = () => {
    router.push(Routes.HOME)
  }

  return (
    <section className={`${styles.layout} ${classNames({ [styles.unauthLayout]: !props.isAuthRoute })}`}>
      {typeof props.user === 'undefined' && !props.isAuthRoute && router.route !== Routes.HOME && (
        <BackButton onClick={goBackToHome} />
      )}
      {props.children}
    </section>
  )
}
