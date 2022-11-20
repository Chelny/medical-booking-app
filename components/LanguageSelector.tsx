import { useRouter } from 'next/router'

const LanguageSelector = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value

    router.push(router.route, router.asPath, {
      locale: value,
    })
  }

  return (
    <select className="py-1 text-dark shadow-none dark:text-light" value={router.locale} onChange={handleLocaleChange}>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  )
}

export default LanguageSelector
