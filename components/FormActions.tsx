import { useTranslation } from 'next-i18next'
import { JSXElementConstructor, MouseEventHandler, ReactElement } from 'react'
import Button from 'components/Button'

type FormActionsProps = {
  cancelButton?: { label: ReactElement<any, string | JSXElementConstructor<any>> }
  confirmButton: { label: ReactElement<any, string | JSXElementConstructor<any>>; disabled?: boolean }
  handleCancelAction: MouseEventHandler<HTMLButtonElement>
  handleConfirmAction?: MouseEventHandler<HTMLButtonElement>
}

const FormActions = ({
  cancelButton,
  confirmButton,
  handleCancelAction,
  handleConfirmAction,
}: FormActionsProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button type="button" className="close" onClick={handleCancelAction}>
        {(cancelButton && cancelButton.label) ?? t('BUTTON.CLOSE')}
      </Button>
      <Button type="submit" className="w-min" disabled={confirmButton.disabled} onClick={handleConfirmAction}>
        {confirmButton && confirmButton.label}
      </Button>
    </div>
  )
}

export default FormActions
