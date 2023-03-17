import { format } from 'date-fns'
import { frCA, enCA } from 'date-fns/locale'
import { NextRouter } from 'next/router'

export const TextFormatUtil = {
  camelCaseToKebabCase: (str: string): string => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  },
  camelCaseToSnakeCase: (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  },
  kebabCaseToCamelCase: (str: string): string => {
    return str.replace(/-./g, (x) => x[1].toUpperCase())
  },
  dateFormat: (date: Date, router: NextRouter, pattern = 'yyyy-MM-dd') => {
    return format(new Date(date), pattern, { locale: router.locale === 'fr' ? frCA : enCA })
  },
}
