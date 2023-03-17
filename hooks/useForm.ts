import { useState, useEffect, FormEvent } from 'react'
import { TextFormatUtil } from 'utils/text-format'

interface IOptions<T> {
  initialValues?: Values<T>
  onValidate: (values: Values<T>) => Validations<T>
  onSubmit: () => void
}

type EmptyObject = { [K in never]: never }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Values<T> = Record<keyof T, any>
type Validations<T> = Partial<Record<keyof T, string>>
type Errors<T> = Partial<Record<keyof T, string>>

/**
 * Form Validator
 * @param options
 * @returns {Object}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <T extends Values<T> = EmptyObject>(options: IOptions<T>): any => {
  const [values, setValues] = useState<Values<T>>((options.initialValues || {}) as T)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      options.onSubmit()
      setIsSubmitting(false)
    }
  }, [options, errors, isSubmitting])

  const handleChange = (event: FormEvent<HTMLElement>): void => {
    let key = ''
    let value

    // Input
    if ('currentTarget' in event) {
      event.persist()
      const currentTarget = event.currentTarget as HTMLInputElement
      const isCheckboxInput = currentTarget.type === 'checkbox'
      const isRadioButtonInput = currentTarget.type === 'radio'
      key = isRadioButtonInput ? currentTarget.name : TextFormatUtil.kebabCaseToCamelCase(currentTarget.id)
      value = isCheckboxInput ? (currentTarget as EventTarget & HTMLInputElement).checked : currentTarget.value
    }

    // Select box
    else if ('target' in event) {
      const target = (event as FormEvent<HTMLElement>).target as HTMLSelectElement
      key = TextFormatUtil.kebabCaseToCamelCase(target.id)
      value = target.value
    }

    setValues({
      ...values,
      [key]: value,
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    if (event) event.preventDefault()
    setErrors(options.onValidate(values))
    setIsSubmitting(true)
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  }
}
