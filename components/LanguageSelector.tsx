import { useRouter } from 'next/router'
import { Locales } from 'configs/locales'

const LanguageSelector = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value
    router.push(router.route, router.asPath, { locale: value })
  }

  return (
    <select className="py-1 text-dark shadow-none dark:text-light" value={router.locale} onChange={handleLocaleChange}>
      {Object.keys(Locales).map((code: string) => (
        <option key={code} label={Locales[code].label} value={code}>
          {Locales[code].label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSelector
