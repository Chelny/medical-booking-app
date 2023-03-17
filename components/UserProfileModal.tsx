import { useTranslation } from 'next-i18next'
import Modal from 'components/Modal'
import { IUserContact } from 'dtos/user-contact.response'

type UserProfileModalProps = {
  user: IUserContact
  isOpen: boolean
  setModalState: (state: boolean) => void
}

const UserProfileModal = ({ user, isOpen, setModalState }: UserProfileModalProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Modal
      title={t(`USER_PROFILE_MODAL.${user.id ? 'EDIT' : 'CREATE'}_TITLE`, { ns: 'admin' })}
      isOpen={isOpen}
      confirmButton={{ label: t('BUTTON.SAVE') }}
      setIsOpen={setModalState}
    >
      <>{JSON.stringify(user, null, 2)}</>
    </Modal>
  )
}

export default UserProfileModal
