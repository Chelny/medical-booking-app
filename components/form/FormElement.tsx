import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { Common } from 'constants/common'
import { TextFormatUtil } from 'utils/text-format'

type FormElementProps = {
  children: ReactElement
  fieldName?: string | undefined
  isLabelHidden?: boolean
  optional?: boolean
  link?: JSX.Element
  hints?: string[]
  error: string | undefined
}

const FormElement = ({
  children,
  fieldName,
  isLabelHidden,
  optional,
  link,
  hints,
  error,
}: FormElementProps): JSX.Element => {
  const { t } = useTranslation()
  const fieldNameKebab = TextFormatUtil.camelCaseToKebabCase(fieldName ?? '')
  const fieldNameUpperSnakeCase = TextFormatUtil.camelCaseToSnakeCase(fieldName ?? '').toUpperCase()

  return (
    <div className={`flex flex-col mb-4 ${error ? 'form-validation-failed' : ''}`}>
      {fieldName && !isLabelHidden && (
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
      {error && (
        <p id={`${Common.ERROR_MESSAGE_ID_PREFIX}_${fieldName}`} className="text-error">
          {t(`FORM.ERROR.${error}`)}
        </p>
      )}
    </div>
  )
}

export default FormElement
