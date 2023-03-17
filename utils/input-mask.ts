import { Dispatch, FormEvent, SetStateAction } from 'react'

export const InputMaskUtil = {
  maskPhoneNumber: (
    event: FormEvent<HTMLInputElement>,
    setPhoneNumber: Dispatch<string>,
    handleChange: (event: FormEvent<HTMLElement>) => void
  ): void => {
    const { currentTarget } = event
    const value = currentTarget.value.replace(/\D+/g, '')

    // Set view value
    const number = value
      .replace(/^(\d{3})$/, '$1')
      .replace(/^(\d{3})(\d{1,3})$/, '($1) $2')
      .replace(/^(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3')
    setPhoneNumber(number)

    // Set model value
    currentTarget.value = value
    handleChange(event)
  },
  maskPhoneNumberTesting: (phoneNumber: string): string => {
    return phoneNumber
      .replace(/^(\d{3})$/, '$1')
      .replace(/^(\d{3})(\d{1,3})$/, '($1) $2')
      .replace(/^(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3')
  },
  maskPostCode: (
    event: FormEvent<HTMLInputElement>,
    values: { [key: string]: string },
    setPostCode: Dispatch<string>,
    setPostCodeMaxLength: Dispatch<SetStateAction<number>>,
    handleChange: (event: FormEvent<HTMLElement>) => void
  ): void => {
    const { currentTarget } = event
    const value = currentTarget.value.replace(/[^A-Z0-9-]/gi, '').toUpperCase()
    let code = value

    switch (values.country) {
      case 'CAN':
        setPostCodeMaxLength(7)
        code = value
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])$/, '$1')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d)$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z])$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z]\d)$/, '$1 $2')
        break
      case 'USA':
        setPostCodeMaxLength(10)
        code = value
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})$/, '$1')
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})(\d{1,4})$/, '$1-$2')
        break
      default:
        break
    }

    // Set view value
    setPostCode(code)

    // Set model value
    currentTarget.value = value
    handleChange(event)
  },
  maskPostCodeTesting: (postCode: string, country: string | undefined): string => {
    let code = postCode
    switch (country) {
      case 'CAN':
        code = postCode
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])$/, '$1')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d)$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z])$/, '$1 $2')
          .replace(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(\d[ABCEGHJ-NPRSTV-Z]\d)$/, '$1 $2')
        break
      case 'USA':
        code = postCode
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})$/, '$1')
          .replace(/^(?!0{5})(\d{5})(?!-?0{4})(\d{1,4})$/, '$1-$2')
        break
      default:
        break
    }
    return code
  },
  maskMedicalId: (
    event: FormEvent<HTMLInputElement>,
    setMaskMedicalId: Dispatch<string>,
    handleChange: (event: FormEvent<HTMLElement>) => void
  ): void => {
    const { currentTarget } = event
    const value = currentTarget.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

    // Set view value
    const number = value
      .replace(/^([A-Z]{4})$/, '$1')
      .replace(/^([A-Z]{4})([0-9]{1,4})$/, '$1-$2')
      .replace(/^([A-Z]{4})([0-9]{4})([A-Z]{1,5})$/, '$1-$2-$3')
    setMaskMedicalId(number)

    // Set model value
    currentTarget.value = number // Keep hyphens
    handleChange(event)
  },
}
