import { useRouter } from 'next/router'
import { LanguagesMap, Locales } from 'configs/locales'

const LanguageSelector = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value
    router.push(router.route, router.asPath, { locale: value })
  }

  return (
    <select
      className="bg-light border-0 py-1 text-dark shadow-none dark:bg-dark-shade dark:text-light"
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
