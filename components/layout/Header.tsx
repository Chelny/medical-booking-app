import { User } from '@prisma/client'
import { Common } from 'constants/common'
import { useWindowSize } from 'hooks/useWindowSize'
import styles from 'styles/modules/Header.module.css'

type HeaderProps = {
  user: User | undefined
  isAuthRoute: boolean
  className?: string
}

const Header = ({ isAuthRoute, className }: HeaderProps): JSX.Element => {
  const { width } = useWindowSize()

  return (
    <header className={`${styles.header} ${className ?? ''}`}>
      <h1
        className={`${
          isAuthRoute && width >= Common.BREAKPOINT.LG
            ? 'text-2xl mb-8'
            : width < Common.BREAKPOINT.SM
            ? 'text-3xl'
            : 'text-4xl'
        }`}
      >
        {Common.APP_NAME}
      </h1>
    </header>
  )
}

export default Header
