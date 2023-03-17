import { enCA, frCA } from 'date-fns/locale'

interface ILocales {
  [key: string]: ILocale
}

interface ILocale {
  label: string
  dateFnsCode: Locale
  dateFormat: string
  hourFormat: string
}

export const Locales: ILocales = {
  EN: {
    label: 'English',
    dateFnsCode: enCA,
    dateFormat: 'yyyy-MM-dd',
    hourFormat: 'h:mm aaaa',
  },
  FR: {
    label: 'Français',
    dateFnsCode: frCA,
    dateFormat: 'yyyy-MM-dd',
    hourFormat: 'H:mm',
  },
}
