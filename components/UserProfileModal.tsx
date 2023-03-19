import { useTranslation } from 'next-i18next'
import Modal from 'components/Modal'
import UserProfile from 'components/UserProfile'
import { UserContact } from 'dtos/user-contact.response'

type UserProfileModalProps = {
  user: UserContact
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
      <UserProfile user={user} />
    </Modal>
  )
}

export default UserProfileModal
