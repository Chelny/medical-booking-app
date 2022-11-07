import { useTranslation } from 'next-i18next'
import { TextFormatUtil } from 'utils/text-format'

type FormElementProps = {
  children: JSX.Element
  fieldName?: string | undefined
  optional?: boolean
  link?: JSX.Element
  hints?: string[]
  error: string | undefined
}

const FormElement = ({ children, fieldName, optional, link, hints, error }: FormElementProps): JSX.Element => {
  const { t } = useTranslation()
  const fieldNameKebab = TextFormatUtil.camelCaseToKebabCase(fieldName ?? '')
  const fieldNameUpperSnakeCase = TextFormatUtil.camelCaseToSnakeCase(fieldName ?? '').toUpperCase()

  return (
    <div className={`flex flex-col mb-4 ${error ? 'form-validation-failed' : ''}`}>
      {fieldName && (
        <label htmlFor={fieldNameKebab} className="flex flex-row justify-between mb-0.5 tracking-wide">
          <span>
            {t(`FORM.LABEL.${fieldNameUpperSnakeCase}`)}{' '}
            {optional && <span className="opacity-50">({t('OPTIONAL')})</span>}
          </span>
          {link}
        </label>
      )}
      {children}
      {hints &&
        hints.map((hint) => (
          <p key={hint} className="text-medium text-sm dark:text-medium-shade dark:opacity-60">
            {t(`FORM.HINT.${hint}`)}
          </p>
        ))}
      {error && <p className="text-error">{t(`FORM.ERROR.${error}`)}</p>}
    </div>
  )
}

export default FormElement
