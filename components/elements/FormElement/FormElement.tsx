import { ReactElement } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { Common } from 'constants/common'
import { TextFormatUtil } from 'utils/text-format'
import styles from './FormElement.module.css'

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
    <div className={`${styles.formElement} ${classNames({ [styles.invalidInput]: error })}`}>
      {fieldName && !isLabelHidden && (
        <label htmlFor={fieldNameKebab} className={styles.label}>
          <span>
            {t(`FORM.LABEL.${fieldNameUpperSnakeCase}`)}{' '}
            {optional && <span className={styles.optionalText}>({t('OPTIONAL')})</span>}
          </span>
          {link}
        </label>
      )}
      {children}
      {hints &&
        hints.map((hint) => (
          <p key={hint} className={styles.hintText}>
            {t(`FORM.HINT.${hint}`)}
          </p>
        ))}
      {error && (
        <p id={`${Common.ERROR_MESSAGE_ID_PREFIX}_${fieldName}`} className={styles.errorText}>
          {t(`FORM.ERROR.${error}`)}
        </p>
      )}
    </div>
  )
}

export default FormElement
