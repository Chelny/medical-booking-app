import { useRouter } from 'next/router'
import { LanguagesMap, Locales } from 'configs/locales'

const LanguageSelector = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value
    router.push(router.route, router.asPath, { locale: value.toLowerCase() })
  }

  return (
    <select
      className="bg-light-mode-foreground border-0 py-1 shadow-none dark:bg-dark-mode-foreground"
      value={router.locale?.toUpperCase()}
      onChange={handleLocaleChange}
    >
      {LanguagesMap.map((code: string) => (
        <option key={code} value={code}>
          {Locales[code].label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSelector
