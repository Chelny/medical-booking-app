import { FormEvent, Fragment, JSXElementConstructor, ReactElement } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'
import styles from 'styles/modules/Modal.module.css'

export enum ModalSize {
  XS = 'modalSizeXs',
  SM = 'modalSizeSm',
  MD = 'modalSizeMd',
  LG = 'modalSizeLg',
}

type ModalProps = {
  children: ReactElement
  modalSize?: ModalSize
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelButton?: { label: ReactElement<any, string | JSXElementConstructor<any>> }
  confirmButton: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: ReactElement<any, string | JSXElementConstructor<any>>
    type?: 'DANGER' | 'DEFAULT'
    disabled?: boolean
  } | null
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (value?: any) => void
}

const Modal = ({
  children,
  modalSize,
  title,
  cancelButton,
  confirmButton,
  isOpen,
  setIsOpen,
  handleSubmit,
}: ModalProps): JSX.Element => {
  const { t } = useTranslation()

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={styles.dialog} onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.backdrop} />
        </Transition.Child>

        <div className={styles.dialogPanelContainerParent}>
          <div className={styles.dialogPanelContainerChild}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as="form"
                className={`${styles.dialogPanel} ${modalSize ? styles[modalSize] : styles.modalSizeSm}`}
                noValidate
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault()
                  handleSubmit(event)
                }}
              >
                <Dialog.Title as="h3" className={styles.dialogTitle}>
                  {title}
                </Dialog.Title>

                <div className={styles.dialogContent}>{children}</div>

                <div className={styles.actionButtons}>
                  <Button type="button" className={styles.cancelBtn} handleClick={closeModal}>
                    {(cancelButton && cancelButton.label) ?? t('BUTTON.CANCEL')}
                  </Button>
                  {confirmButton && (
                    <Button
                      type="submit"
                      className={`${styles.confirmBtn} ${confirmButton.type === 'DANGER' ? styles.btnDanger : ''}`}
                      disabled={confirmButton.disabled}
                    >
                      {confirmButton && confirmButton.label}
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
