import { ChangeEventHandler, FormEvent, HTMLInputTypeAttribute, ReactNode, useState } from 'react'
import { isBefore } from 'date-fns'
import { kebabCase, snakeCase } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { Common } from 'constantss'
import styles from './FormElement.module.css'

type InputValue = string | number | readonly string[]
type FormFieldElement = HTMLInputElement | HTMLSelectElement

type FormElementProps<T> = {
  fieldName: string
  isLabelHidden?: boolean
  type?: HTMLInputTypeAttribute | 'select'
  list?: T[]
  children?: ReactNode
  required?: boolean
  pattern?: string
  min?: string | number
  max?: string | number
  step?: string | number
  minLength?: number
  maxLength?: number
  accept?: string
  size?: number
  checked?: boolean
  placeholder?: string
  value?: InputValue
  disabled?: boolean
  link?: JSX.Element
  hints?: string[]
  onChange: ChangeEventHandler<FormFieldElement>
}

export const FormElement = <T,>(props: FormElementProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const fieldNameKebab = kebabCase(props.fieldName)
  const fieldNameUpperSnakeCase = snakeCase(props.fieldName).toUpperCase()
  const [error, setError] = useState<string>('')

  const updateValidation = (e: FormEvent<FormFieldElement>): void => {
    setError('')

    /***** Specific validations *****/

    // Passwords match (password)
    if (props.fieldName == 'password') {
      const passwordConfirmation = document.getElementById('password-confirmation') as HTMLInputElement
      if (passwordConfirmation) {
        if (
          e.currentTarget.value &&
          passwordConfirmation.value &&
          e.currentTarget.value != passwordConfirmation.value
        ) {
          setError('PASSWORDS_DO_NOT_MATCH')
          e.currentTarget.setCustomValidity('PASSWORDS_DO_NOT_MATCH')
          passwordConfirmation.setCustomValidity('PASSWORDS_DO_NOT_MATCH')
        } else {
          e.currentTarget.setCustomValidity('')
          passwordConfirmation.setCustomValidity('')
          passwordConfirmation.ariaInvalid = 'false'

          if (passwordConfirmation.nextElementSibling) passwordConfirmation.nextElementSibling.innerHTML = ''
        }
        e.currentTarget.reportValidity()
        passwordConfirmation.reportValidity()
      }
    }

    // Passwords match (password confirmation)
    if (props.fieldName == 'passwordConfirmation') {
      const password = document.getElementById('password') as HTMLInputElement
      if (e.currentTarget.value && password.value && e.currentTarget.value != password.value) {
        setError('PASSWORDS_DO_NOT_MATCH')
        e.currentTarget.setCustomValidity('PASSWORDS_DO_NOT_MATCH')
        password.setCustomValidity('PASSWORDS_DO_NOT_MATCH')
      } else {
        e.currentTarget.setCustomValidity('')
        password.setCustomValidity('')
        password.ariaInvalid = 'false'

        if (password.nextElementSibling) password.nextElementSibling.innerHTML = ''
      }
      e.currentTarget.reportValidity()
      password.reportValidity()
    }

    // If endDate set, it must be >= than startDate
    if (props.fieldName == 'endDate') {
      const startDate = document.getElementById('start-date') as HTMLInputElement
      if (
        e.currentTarget.value &&
        startDate.value &&
        isBefore(new Date(e.currentTarget.value), new Date(startDate.value))
      ) {
        setError(`${fieldNameUpperSnakeCase}_MIN`)
      }
    }

    // Required single checkbox must be checked (eg.: accept Terms and Conditions in sign up page)
    if (props.type == 'checkbox' && !props.list) {
      if (e.currentTarget.required && !(e.currentTarget as HTMLInputElement).checked) {
        setError(`${fieldNameUpperSnakeCase}_REQUIRED`)
      }
    }
  }

  const handleInvalid = (e: FormEvent<FormFieldElement>): void => {
    // Hide browser default error messages
    e.preventDefault()

    if (
      ((e.currentTarget.type != 'checkbox' && e.currentTarget.type != 'radio' && !e.currentTarget.value) ||
        ((e.currentTarget.type == 'checkbox' || e.currentTarget.type == 'radio') &&
          !(e.currentTarget as HTMLInputElement).checked)) &&
      e.currentTarget.required
    ) {
      setError(`${fieldNameUpperSnakeCase}_REQUIRED`)
    }

    if (!('pattern' in e.currentTarget)) return

    if (e.currentTarget.value && !e.currentTarget.value.match(e.currentTarget.pattern)) {
      setError(`${fieldNameUpperSnakeCase}_PATTERN`)
    }

    if (e.currentTarget.value && e.currentTarget.min && e.currentTarget.value < e.currentTarget.min) {
      setError(`${fieldNameUpperSnakeCase}_MIN`)
    }

    if (e.currentTarget.value && e.currentTarget.max && e.currentTarget.value > e.currentTarget.max) {
      setError(`${fieldNameUpperSnakeCase}_MAX`)
    }

    if (
      e.currentTarget.value &&
      e.currentTarget.minLength > -1 &&
      e.currentTarget.value.length < e.currentTarget.minLength
    ) {
      setError(`${fieldNameUpperSnakeCase}_MIN_LENGTH`)
    }

    if (
      e.currentTarget.value &&
      e.currentTarget.maxLength > -1 &&
      e.currentTarget.value.length > e.currentTarget.maxLength
    ) {
      setError(`${fieldNameUpperSnakeCase}_MAX_LENGTH`)
    }
  }

  return (
    <div className={styles.formElement}>
      {props.fieldName && !props.isLabelHidden && (
        <label htmlFor={fieldNameKebab} className={styles.label}>
          <span>
            {t(`FORM.LABEL.${fieldNameUpperSnakeCase}`)}{' '}
            {!props.required && <span className={styles.optionalText}>({t('OPTIONAL')})</span>}
          </span>
          {props.link}
        </label>
      )}

      {/***** Dropdown *****/}
      {props.type == 'select' && (
        <select
          id={fieldNameKebab}
          className={styles.select}
          required={props.required}
          value={props.value as InputValue}
          disabled={props.disabled}
          data-testid={`form-input-${fieldNameKebab}`}
          aria-required={props.required}
          aria-invalid={!!error}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_${props.fieldName}`}
          onChange={(e) => {
            updateValidation(e)
            props.onChange(e)
          }}
          onInvalid={handleInvalid}
        >
          {props.children}
        </select>
      )}

      {/***** Text Area *****/}
      {props.type == 'textarea' && (
        <textarea
          id={fieldNameKebab}
          className={styles.textarea}
          required={props.required}
          minLength={props.minLength}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          disabled={props.disabled}
          cols={30}
          rows={10}
        ></textarea>
      )}

      {/***** Checkbox and Radio groups *****/}
      {(props.type == 'checkbox' || props.type == 'radio') && props.list && props.type !== 'select' && (
        <fieldset
          className="group checkbox-radio-group"
          disabled={props.disabled}
          aria-required={props.required}
          aria-invalid={!!error}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_${props.fieldName}`}
        >
          <legend>{t(`FORM.LABEL.SELECT_${fieldNameUpperSnakeCase}`)}</legend>
          {props.list?.map((item: T, index: number) => (
            <div key={index}>
              <input
                type={props.type}
                id={`${fieldNameKebab}-${item}`}
                className={styles.inputCheckboxRadio}
                name={props.fieldName}
                required={props.required}
                checked={props.value == item}
                value={item as InputValue}
                data-testid={`form-dropdown-${fieldNameKebab}-${item}`}
                onChange={props.onChange}
                onInput={updateValidation}
                onInvalid={handleInvalid}
              />
              <label
                htmlFor={`${props.fieldName}-${item}`}
                className="group-invalid:before:!border-light-mode-error dark:group-invalid:before:!border-dark-mode-error"
              >
                {t(`${fieldNameUpperSnakeCase}S.${item}`)}
              </label>
            </div>
          ))}
        </fieldset>
      )}

      {/***** Single Checkbox *****/}
      {props.type == 'checkbox' && !props.list && (
        <div className="grid gap-4">
          <input
            type="checkbox"
            id={fieldNameKebab}
            className={styles.inputSingleCheckbox}
            required={props.required}
            value={props.value as InputValue}
            disabled={props.disabled}
            data-testid={`form-input-${fieldNameKebab}`}
            aria-required={props.required}
            aria-invalid={!!error}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_${props.fieldName}`}
            onChange={(e) => {
              updateValidation(e)
              props.onChange(e)
            }}
            onInvalid={handleInvalid}
          />
          {props.children}
        </div>
      )}

      {/***** Input *****/}
      {props.type !== 'checkbox' && props.type !== 'radio' && props.type !== 'select' && (
        <input
          type={props.type}
          id={fieldNameKebab}
          className={styles.input}
          required={props.required}
          pattern={props.pattern}
          min={props.min}
          max={props.max}
          step={props.step}
          minLength={props.minLength}
          maxLength={props.maxLength}
          accept={props.accept}
          size={props.size}
          placeholder={props.placeholder}
          value={props.value as InputValue}
          disabled={props.disabled}
          data-testid={`form-input-${fieldNameKebab}`}
          aria-required={props.required}
          aria-invalid={!!error}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_${props.fieldName}`}
          onChange={props.onChange}
          onInput={updateValidation}
          onInvalid={handleInvalid}
        />
      )}

      {props.hints &&
        props.hints.map((hint: string, index: number) => (
          <p key={index} className={styles.hintText}>
            {t(`FORM.HINT.${hint}`)}
          </p>
        ))}

      {error && (
        <p id={`${Common.ERROR_MESSAGE_ID_PREFIX}_${props.fieldName}`} className={styles.errorText}>
          {t(`FORM.ERROR.${error}`)}
        </p>
      )}
    </div>
  )
}
