import { NextRouter } from 'next/router'
import { format, formatISO } from 'date-fns'
import { frCA, enCA } from 'date-fns/locale'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { Common } from 'constants/common'

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
  dateFormat: (date: Date, router: NextRouter, pattern = 'yyyy-MM-dd'): string => {
    return format(new Date(date), pattern, { locale: router.locale === 'fr' ? frCA : enCA })
  },
  formatISOToStringDate: (date: Date | null | undefined): string => {
    if (!date) return ''
    return formatISO(new Date(date), { representation: 'date' })
  },
  utcToZonedTime: (date: Date | null | undefined): string => {
    if (!date) return ''
    return utcToZonedTime(date, Common.LOCAL_TZ).toISOString()
  },
  zonedTimeToUtc: (date: Date | null | undefined): string => {
    if (!date) return ''
    return zonedTimeToUtc(date, 'Etc/GMT').toISOString()
  },
}
