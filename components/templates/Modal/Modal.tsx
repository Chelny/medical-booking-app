import { FormEvent, Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { Button } from 'components'
import styles from './Modal.module.css'

export enum ModalSize {
  XS = 'modalSizeXs',
  SM = 'modalSizeSm',
  MD = 'modalSizeMd',
  LG = 'modalSizeLg',
}

type ModalProps = {
  children: ReactNode
  title: string
  isOpen: boolean
  modalSize?: ModalSize
  confirmButton: {
    text: string
    isDanger?: boolean
    isDisabled?: boolean
  } | null
  onCancel: () => void
  onConfirm: () => void
}

export const Modal = (props: ModalProps): JSX.Element => {
  const { t } = useTranslation()

  const handleClose = (): void => {
    props.onCancel()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    props.onConfirm()
  }

  return (
    <Transition as={Fragment} show={props.isOpen}>
      <Dialog as="div" className={styles.dialog} onClose={handleClose}>
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
                className={`${styles.dialogPanel} ${props.modalSize ? styles[props.modalSize] : [styles.modalSizeSm]}`}
                onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
              >
                <Dialog.Title as="h3" className={styles.dialogTitle}>
                  {props.title}
                </Dialog.Title>

                <div className={styles.dialogContent}>{props.children}</div>

                <div className={styles.actionButtons}>
                  <Button type="button" className={styles.btnCancel} onClick={handleClose}>
                    {t('BUTTON.CANCEL')}
                  </Button>
                  {props.confirmButton && (
                    <Button
                      type="submit"
                      className={`${classNames({ [styles.btnDanger]: props.confirmButton.isDanger })}`}
                      disabled={props.confirmButton.isDisabled}
                    >
                      {props.confirmButton.text}
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
