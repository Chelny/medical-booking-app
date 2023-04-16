import LanguageSelector from 'components/LanguageSelector'
import styles from 'styles/modules/Footer.module.css'

const Footer = (): JSX.Element => {
  return (
    <footer
      className={`${styles.footer} py-4 bg-light-mode-foreground text-light-mode-text-secondary text-xs text-center dark:bg-dark-mode-foreground dark:text-dark-mode-text-secondary`}
    >
      <LanguageSelector />
    </footer>
  )
}

export default Footer
