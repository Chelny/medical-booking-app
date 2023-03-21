import { Dialog, Transition } from '@headlessui/react'
import { Fragment, JSXElementConstructor, ReactElement } from 'react'
import FormActions from 'components/form/FormActions'

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
  const closeModal = () => {
    setIsOpen(false)
  }

  const confirm = () => {
    // TODO: Submit logic
    closeModal()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex justify-center items-center min-h-full p-4 text-center">
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
                className="w-full md:max-w-screen-md transform overflow-hidden rounded-md bg-light-tint p-6 text-left align-middle shadow-xl transition-all dark:bg-dark"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-black dark:text-white">
                  {title}
                </Dialog.Title>

                <div className="mt-2 text-sm text-black dark:text-white">{children}</div>

                <div className="flex justify-end gap-2 mt-4">
                  <FormActions
                    cancelButton={cancelButton}
                    confirmButton={confirmButton}
                    handleCancelAction={closeModal}
                    handleConfirmAction={confirm}
                  />
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
