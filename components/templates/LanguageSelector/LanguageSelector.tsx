import { useRouter } from 'next/router'
import { LanguagesMap, Locales } from 'configs'
import styles from './LanguageSelector.module.css'

export const LanguageSelector = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value
    router.push(router.route, router.asPath, { locale: value.toLowerCase() })
  }

  return (
    <select className={styles.dropdown} value={router.locale?.toUpperCase()} onChange={handleLocaleChange}>
      {LanguagesMap.map((code: string) => (
        <option key={code} value={code}>
          {Locales[code].label}
        </option>
      ))}
    </select>
  )
}
