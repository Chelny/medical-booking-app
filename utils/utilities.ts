import { Dispatch } from 'react'
import { NextRouter } from 'next/router'
import { format, formatISO } from 'date-fns'
import { frCA, enCA } from 'date-fns/locale'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { camelCase } from 'lodash-es'
import { Common } from 'constantss'
import { Country } from 'enums'

export const Utilities = {
  /*************************
   *  Object
   *************************/

  /**
   * Flatten a multidimensional object
   *
   * @example flattenObject({ a: 1, b: { c: 2 } }) = { a: 1, c: 2 }
   */
  flattenObject: <T extends object>(obj: T): GenericObject => {
    const flattened: GenericObject = {}

    Object.keys(obj).forEach((key: string) => {
      const value = (obj as Record<string, never>)[key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, Utilities.flattenObject(value))
      } else {
        flattened[key] = value
      }
    })

    return flattened
  },
  objSnakeCaseToCamelCase: (obj: GenericObject): GenericObject => {
    return Object.keys(obj).reduce((result: GenericObject, oldKey: string) => {
      const newKey = camelCase(oldKey)
      return { ...result, [newKey]: obj[oldKey] }
    }, {})
  },

  /*************************
   *  Form
   *************************/

  prefillFormData: <T extends object>(obj: T): GenericObject => {
    const flattenObj = Utilities.flattenObject(obj)
    const formData = Utilities.objSnakeCaseToCamelCase(flattenObj)

    // Convert null value to an empty string
    for (const key in formData) {
      if (!formData[key]) formData[key] = ''
    }

    return formData
  },

  /*************************
   *  Format Text
   *************************/

  formatPhoneNumber: (value: string, setPhoneNumber: Dispatch<string>): string => {
    const modelValue = value.replace(/\D+/g, '')

    const viewValue = modelValue
      .replace(/^(\d{3})$/, '$1')
      .replace(/^(\d{3})(\d{1,3})$/, '($1) $2')
      .replace(/^(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3')

    setPhoneNumber(viewValue)

    return modelValue
  },
  formatPostalCode: (
    value: string,
    countryCode: string,
    setPostalCode: Dispatch<string>,
    setPostalCodeMaxLength: Dispatch<number>
  ): string => {
    const modelValue = value.replace(/[^A-Z0-9-]/gi, '').toUpperCase()
    let viewValue = modelValue

    switch (countryCode) {
      case Country.CANADA:
        setPostalCodeMaxLength(7)
        viewValue = modelValue
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])$/, '$1')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d)$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z])$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z]\d)$/, '$1 $2')
        break
      case Country.USA:
        setPostalCodeMaxLength(10)
        viewValue = modelValue
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})$/, '$1')
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})(\d{1,4})$/, '$1-$2')
        break
      default:
        break
    }

    setPostalCode(viewValue)

    return modelValue
  },
  formatMedicalId: (value: string, setMaskMedicalId: Dispatch<string>): string => {
    const modelValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

    const viewValue = modelValue
      .replace(/^([A-Z]{4})$/, '$1')
      .replace(/^([A-Z]{4})([0-9]{1,4})$/, '$1-$2')
      .replace(/^([A-Z]{4})([0-9]{4})([A-Z]{1,5})$/, '$1-$2-$3')
    setMaskMedicalId(viewValue)

    return viewValue // Keep hyphens
  },

  /*************************
   *  Date
   *************************/

  dateFormat: (date: Date, router: NextRouter, pattern = 'yyyy-MM-dd'): string => {
    return format(new Date(date), pattern, { locale: router.locale === 'fr' ? frCA : enCA })
  },
  formatISOToStringDate: (date: Date | string | null | undefined): string => {
    if (!date) return ''
    return formatISO(new Date(date), { representation: 'date' })
  },
  utcToZonedTime: (date: Date | string | null | undefined): string => {
    if (!date) return ''
    return utcToZonedTime(date, Common.LOCAL_TZ).toISOString()
  },
  zonedTimeToUtc: (date: Date | string | null | undefined): string => {
    if (!date) return ''
    return zonedTimeToUtc(date, 'Etc/GMT').toISOString()
  },
}
