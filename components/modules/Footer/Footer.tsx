import { LanguageSelector } from 'components'
import styles from './Footer.module.css'

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <LanguageSelector />
    </footer>
  )
}
