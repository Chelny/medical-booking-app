import { useRouter } from 'next/router'

const Footer = (): JSX.Element => {
  const router = useRouter()

  const handleLocaleChange = (event: IHTMLElementEvent) => {
    const value = event.target.value

    router.push(router.route, router.asPath, {
      locale: value,
    })
  }

  return (
    <footer className="py-2 px-4 text-medium-shade text-xs text-center md:landscape:bg-primary-day dark:md:landscape:bg-dark-shade">
      <select
        className="py-1 text-dark shadow-none dark:text-light"
        value={router.locale}
        onChange={handleLocaleChange}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </footer>
  )
}

export default Footer
