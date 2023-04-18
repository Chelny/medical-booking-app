import LanguageSelector from 'components/templates/LanguageSelector/LanguageSelector'
import styles from './Footer.module.css'

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <LanguageSelector />
    </footer>
  )
}

export default Footer
