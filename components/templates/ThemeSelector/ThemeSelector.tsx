import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Switch } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import { useTheme } from 'next-themes'
import styles from './ThemeSelector.module.css'

export enum AppTheme {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export const ThemeSelector = (): JSX.Element | null => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  /**
   * On page load or when changing themes, best to add inline in `head` to avoid FOUC
   */
  const updateTheme = () => {
    if (
      localStorage.theme === AppTheme.DARK ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add(AppTheme.DARK)
    } else {
      document.documentElement.classList.remove(AppTheme.DARK)
    }

    setTheme(document.documentElement.classList.contains(AppTheme.DARK) ? AppTheme.DARK : AppTheme.LIGHT)
  }

  const handleChange = (isDarkTheme: boolean) => {
    setTheme(isDarkTheme ? AppTheme.DARK : AppTheme.LIGHT)
  }

  useEffect(() => {
    updateTheme()
  }, [])

  return (
    <div className={styles.themeSelector}>
      <span className={styles.label}>{t('THEME_SELECTOR.LABEL')}</span>
      <Switch
        className={`${styles.switch} ${theme === AppTheme.DARK ? [styles.switchDarkMode] : [styles.switchLightMode]}`}
        defaultChecked={theme === AppTheme.DARK}
        checked={theme === AppTheme.DARK}
        onChange={handleChange}
      >
        <span className="sr-only">{t('THEME_SELECTOR.LABEL')}</span>
        <span
          className={`${styles.button} ${theme === AppTheme.DARK ? [styles.buttonDarkMode] : [styles.buttonLightMode]}`}
          aria-hidden="true"
        >
          <FontAwesomeIcon
            icon={`${theme === AppTheme.DARK ? 'moon' : 'sun'}`}
            className={styles.icon}
            title={`${
              theme === AppTheme.DARK ? `${t('THEME_SELECTOR.THEMES.DARK')}` : `${t('THEME_SELECTOR.THEMES.LIGHT')}`
            }`}
          />
        </span>
      </Switch>
    </div>
  )
}
