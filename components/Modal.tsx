import { Fragment, JSXElementConstructor, ReactElement } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'
import styles from 'styles/modules/Modal.module.css'

type ModalProps = {
  children: ReactElement
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelButton?: { label: ReactElement<any, string | JSXElementConstructor<any>> }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirmButton: { label: ReactElement<any, string | JSXElementConstructor<any>>; disabled?: boolean }
  isOpen: boolean
  setIsOpen: (state: boolean) => void
}

const Modal = ({ children, title, cancelButton, confirmButton, isOpen, setIsOpen }: ModalProps): JSX.Element => {
  const { t } = useTranslation()

  const closeModal = () => {
    setIsOpen(false)
  }

  const confirm = () => {
    // TODO: Submit logic
    closeModal()
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

        <div className="fixed inset-0">
          <div className="flex justify-center items-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel as="form" className={styles.dialogPanel}>
                <Dialog.Title as="h3" className={styles.dialogTitle}>
                  {title}
                </Dialog.Title>

                <div className={styles.dialogContent}>{children}</div>

                <div className={styles.actionButtons}>
                  <Button type="button" className={styles.cancelBtn} handleClick={closeModal}>
                    {(cancelButton && cancelButton.label) ?? t('BUTTON.CLOSE')}
                  </Button>
                  <Button
                    type="submit"
                    className={styles.confirmBtn}
                    disabled={confirmButton.disabled}
                    handleClick={confirm}
                  >
                    {confirmButton && confirmButton.label}
                  </Button>
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
