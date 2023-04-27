import { ReactElement, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RadioGroup, Tab } from '@headlessui/react'
import { GraphQLError } from 'graphql'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import {
  AccountForm,
  BackButton,
  ConditionalWrap,
  ContactForm,
  DoctorForm,
  Modal,
  ModalSize,
  PatientForm,
  UserForm,
} from 'components'
import { Common } from 'constantss'
import { UserRole, UserRolesMap } from 'enums'
import { useRequest, useWindowSize } from 'hooks'
import { IContactFormData, IDoctorFormData, IPatientFormData, UserContact } from 'interfaces'
import { Utilities } from 'utils'
import styles from './UserProfile.module.css'

type UserProfileProps = {
  user: UserContact
  isModal: boolean
  isModalOpen: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

type CreateUserGQLResponse = GQLResponse<{ createUser: { message: string } }>
type UpdateUserGQLResponse = GQLResponse<{ updateUser: { message: string } }>

interface IFormData extends IContactFormData, IDoctorFormData, IPatientFormData {
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  language: string
  email: string
  username: string
}

const INITIAL_DATA: IFormData = {
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',
  language: '',
  email: '',
  username: '',
  addressLine1: '',
  addressLine2: '',
  country: '',
  region: '',
  city: '',
  postalCode: '',
  phoneNumber: '',
  phoneNumberExt: '',
  departmentId: '',
  imageName: '',
  startDate: '',
  endDate: '',
  medicalId: '',
  height: '',
  weight: '',
}

enum UserProfileStep {
  CHOOSE_USER_ROLE = 1,
  USER_PROFILE_FORM = 2,
}

export const UserProfile = (props: UserProfileProps): JSX.Element => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const [userProfileStep, setUserProfileStep] = useState<UserProfileStep | null>(null)
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<number | null>(null)
  const [formData, setFormData] = useState<IFormData>(INITIAL_DATA)
  const isChooseUserRoleStep = userProfileStep === UserProfileStep.CHOOSE_USER_ROLE
  const isUserDoctor =
    (props.user && 'Doctor' in props.user && !!props.user?.Doctor) || selectedUserRoleId === UserRole.DOCTOR
  const isUserPatient =
    (props.user && 'Patient' in props.user && !!props.user?.Patient) || selectedUserRoleId === UserRole.PATIENT

  const selectUserRole = (userRoleId: number): void => {
    setSelectedUserRoleId(userRoleId)
    setUserProfileStep(UserProfileStep.USER_PROFILE_FORM)
  }

  const goBackToUserRoleSelection = (): void => {
    setSelectedUserRoleId(null)
    setUserProfileStep(UserProfileStep.CHOOSE_USER_ROLE)
  }

  const updateFields = (fields: Partial<IFormData>): void => {
    setFormData((prev: IFormData) => ({ ...prev, ...fields }))
  }

  const handleClose = (): void => {
    props.onCancel && props.onCancel()
    setSelectedUserRoleId(null)
  }

  const handleSubmit = async (): Promise<void> => {
    let payload = '{'

    payload += `first_name: "${formData.firstName}", last_name: "${formData.lastName}", gender: "${
      formData.gender
    }", birth_date: "${formData.birthDate}", email: "${formData.email}", username: ${
      formData.username ? `"${formData.username}"` : null
    }, role_id: ${props.user?.role_id ? `${props.user.role_id}` : `${selectedUserRoleId}`}, language: ${
      formData.language ? `"${formData.language}"` : `"${'EN'}"`
    }, address_line_1: "${formData.addressLine1}", address_line_2: ${
      formData.addressLine2 ? `"${formData.addressLine2}"` : null
    }, city: "${formData.city}", region: "${formData.region}", country: "${formData.country}", postal_code: "${
      formData.postalCode
    }", phone_number: "${formData.phoneNumber}", phone_number_ext: ${
      formData.phoneNumberExt ? `"${formData.phoneNumberExt}"` : null
    }`

    if (isUserDoctor) {
      payload += `, department_id: ${formData.departmentId}, image_name: ${
        formData.imageName ? `"${formData.imageName}"` : null
      }, start_date: "${formData.startDate}", end_date: ${formData.endDate ? `"${formData.endDate}"` : null}`
    } else if (isUserPatient) {
      payload += `, medical_id: "${formData.medicalId}", height: ${
        formData.height ? `"${formData.height}"` : null
      }, weight: ${formData.weight ? `"${formData.weight}"` : null}`
    }

    payload += '}'

    let data, errors

    if (props.user?.id) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;({ data, errors } = await useRequest<UpdateUserGQLResponse>(
        `mutation { updateUser(id: ${props.user?.id}, input: ${payload}) { message } }`
      ))
      if (data) toast.success<string>(t(`SUCCESS.${data.updateUser.message}`, { ns: 'api' }))
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;({ data, errors } = await useRequest<CreateUserGQLResponse>(
        `mutation { createUser(input: ${payload}) { message } }`
      ))
      if (data) toast.success<string>(t(`SUCCESS.${data.createUser.message}`, { ns: 'api' }))
    }

    if (data) props.onConfirm && props.onConfirm()

    if (errors) {
      errors.map((error: GraphQLError) => {
        if (error.extensions) {
          toast.error<string>(t(`ERROR.${error.extensions.code}`, { ns: 'api' }))
        } else {
          console.error(error.message)
        }
      })
    }
  }

  useEffect(() => {
    updateFields(INITIAL_DATA)

    if (typeof props.user?.id === 'undefined' && selectedUserRoleId === null) {
      setUserProfileStep(UserProfileStep.CHOOSE_USER_ROLE)
    } else {
      setUserProfileStep(UserProfileStep.USER_PROFILE_FORM)

      const userFormData = Utilities.prefillFormData(props.user)
      updateFields(userFormData)
    }
  }, [props.user, selectedUserRoleId])

  return (
    <ConditionalWrap
      condition={props.isModal}
      wrap={(wrappedChildren: ReactElement) => (
        <Modal
          title={t(`USER_PROFILE_MODAL.${props.user?.id ? 'EDIT' : 'CREATE'}_TITLE`, {
            ns: 'admin',
            context: selectedUserRoleId && UserRole[selectedUserRoleId],
          })}
          isOpen={props.isModalOpen}
          modalSize={isChooseUserRoleStep ? ModalSize.XS : ModalSize.MD}
          confirmButton={isChooseUserRoleStep ? null : { text: t('BUTTON.SAVE') }}
          onCancel={handleClose}
          onConfirm={handleSubmit}
        >
          {wrappedChildren}
        </Modal>
      )}
    >
      {!isChooseUserRoleStep ? (
        <>
          {typeof props.user?.id === 'undefined' && <BackButton onClick={goBackToUserRoleSelection} />}
          <Tab.Group>
            <Tab.List className={styles.list}>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="user" />
                ) : (
                  t('PROFILE.STEPS.GENERAL_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="key" />
                ) : (
                  t('PROFILE.STEPS.ACCOUNT_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="location-dot" />
                ) : (
                  t('PROFILE.STEPS.CONTACT_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              {isUserDoctor && (
                <Tab className={styles.tab}>
                  {width < Common.BREAKPOINT.SM ? (
                    <FontAwesomeIcon icon="user-doctor" />
                  ) : (
                    t('PROFILE.STEPS.DOCTOR_INFORMATION', { ns: 'account' })
                  )}
                </Tab>
              )}
              {isUserPatient && (
                <Tab className={styles.tab}>
                  {width < Common.BREAKPOINT.SM ? (
                    <FontAwesomeIcon icon="hospital-user" />
                  ) : (
                    t('PROFILE.STEPS.PATIENT_INFORMATION', { ns: 'account' })
                  )}
                </Tab>
              )}
            </Tab.List>
            <Tab.Panels className={styles.panels}>
              <Tab.Panel className={styles.panel}>
                <UserForm {...formData} updateFields={updateFields} />
              </Tab.Panel>
              <Tab.Panel className={styles.panel}>
                <AccountForm {...formData} updateFields={updateFields} />
              </Tab.Panel>
              <Tab.Panel className={styles.panel}>
                <ContactForm {...formData} updateFields={updateFields} />
              </Tab.Panel>
              {isUserDoctor && (
                <Tab.Panel className={styles.panel}>
                  <DoctorForm {...formData} updateFields={updateFields} />
                </Tab.Panel>
              )}
              {isUserPatient && (
                <Tab.Panel className={styles.panel}>
                  <PatientForm {...formData} updateFields={updateFields} />
                </Tab.Panel>
              )}
            </Tab.Panels>
          </Tab.Group>
        </>
      ) : (
        <RadioGroup value={selectedUserRoleId} onChange={selectUserRole}>
          <RadioGroup.Label>{t('USER_PROFILE_MODAL.CHOOSE_USER_ROLE', { ns: 'admin' })}</RadioGroup.Label>
          <div className={styles.options}>
            {UserRolesMap.map((userRoleId: number) => (
              <RadioGroup.Option
                key={userRoleId}
                value={userRoleId}
                className={styles.option}
                onClick={() => selectUserRole(userRoleId)}
              >
                <RadioGroup.Label className={styles.optionLabel}>{t(`USER_ROLES.${userRoleId}`)}</RadioGroup.Label>
                <FontAwesomeIcon icon="check" className={styles.optionCheckedIcon} />
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </ConditionalWrap>
  )
}
