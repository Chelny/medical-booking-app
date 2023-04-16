import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RadioGroup, Tab } from '@headlessui/react'
import { differenceInYears, parse } from 'date-fns'
import { GraphQLError } from 'graphql'
import { isEmpty, omit } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import BackButton from 'components/BackButton'
import Button from 'components/Button'
import ConditionalWrap from 'components/ConditionalWrap'
import UserProfileContactInfo from 'components/form/UserProfileContactInfo'
import UserProfileDoctorInfo from 'components/form/UserProfileDoctorInfo'
import UserProfileLoginInfo from 'components/form/UserProfileLoginInfo'
import UserProfilePatientInfo from 'components/form/UserProfilePatientInfo'
import UserProfilePersonalInfo from 'components/form/UserProfilePersonalInfo'
import Modal, { ModalSize } from 'components/Modal'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { UserContact } from 'dtos/user-contact.response'
import { IDoctorContact } from 'dtos/user-contact.response'
import { IPatientContact } from 'dtos/user-contact.response'
import { UserRole, UserRolesMap } from 'enums/user-role.enum'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { useWindowSize } from 'hooks/useWindowSize'
import { TextFormatUtil } from 'utils/text-format'
import styles from 'styles/modules/UserProfile.module.css'

type UserProfileProps = {
  isModal: boolean
  user: UserContact
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  isFormSubmitted: (isSubmitted: boolean) => void
}

type CreateAdminGQLResponse = GQLResponse<{ createAdmin: { message: string } }>
type CreateDoctorGQLResponse = GQLResponse<{ createDoctor: { message: string } }>
type CreatePatientGQLResponse = GQLResponse<{ createPatient: { message: string } }>
type UpdateAdminGQLResponse = GQLResponse<{ updateAdmin: { message: string } }>
type UpdateDoctorGQLResponse = GQLResponse<{ updateDoctor: { message: string } }>
type UpdatePatientGQLResponse = GQLResponse<{ updatePatient: { message: string } }>

enum UserProfileStep {
  CHOOSE_USER_ROLE = 1,
  USER_PROFILE_FORM = 2,
}

const UserProfile = ({
  user,
  isModal,
  isModalOpen,
  setIsModalOpen,
  isFormSubmitted,
}: UserProfileProps): JSX.Element => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const [userProfileStep, setUserProfileStep] = useState<UserProfileStep | null>(null)
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<number | null>(null)
  const isUserDoctor = (user && 'Doctor' in user && !!user?.Doctor) || selectedUserRoleId === UserRole.DOCTOR
  const isUserPatient = (user && 'Patient' in user && !!user?.Patient) || selectedUserRoleId === UserRole.PATIENT
  const isChooseUserRoleStep = userProfileStep === UserProfileStep.CHOOSE_USER_ROLE

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      firstName: user?.first_name ?? '',
      lastName: user?.last_name ?? '',
      gender: user?.gender ?? '',
      birthDate: TextFormatUtil.formatISOToStringDate(user?.birth_date) ?? '',
      email: user?.email ?? '',
      username: user?.username ?? '',
      password: '',
      passwordConfirmation: '',
      roleId: user?.role_id ?? '',
      language: user?.language ?? '',
      addressLine1: user?.Contact?.address ?? '',
      addressLine2: user?.Contact?.address_line2 ?? '',
      city: user?.Contact?.city ?? '',
      region: user?.Contact?.region ?? '',
      country: user?.Contact?.country ?? '',
      postCode: user?.Contact?.postal_code ?? '',
      phoneNumber: user?.Contact?.phone_number ?? '',
      phoneNumberExt: user?.Contact?.phone_ext ?? '',
      departmentId: isUserDoctor ? (user as IDoctorContact).Doctor?.department_id : '',
      imageName: isUserDoctor ? (user as IDoctorContact).Doctor?.image_name : '',
      startDate: isUserDoctor ? TextFormatUtil.formatISOToStringDate((user as IDoctorContact).Doctor?.start_date) : '',
      endDate: isUserDoctor ? TextFormatUtil.formatISOToStringDate((user as IDoctorContact).Doctor?.end_date) : '',
      medicalId: isUserPatient ? (user as IPatientContact).Patient?.medical_id : '',
      height: isUserPatient ? (user as IPatientContact).Patient?.height : '',
      weight: isUserPatient ? (user as IPatientContact).Patient?.weight : '',
    },
    onValidate: (v) => {
      const e: IStringMap = {}

      if (!v.firstName) {
        e.firstName = 'FIRST_NAME_REQUIRED'
      } else if (!Regex.NAME_PATTERN.test(v.firstName.trim())) {
        e.firstName = 'FIRST_NAME_PATTERN'
      }
      if (!v.lastName) {
        e.lastName = 'LAST_NAME_REQUIRED'
      } else if (!Regex.NAME_PATTERN.test(v.lastName.trim())) {
        e.lastName = 'LAST_NAME_PATTERN'
      }
      if (!v.gender) {
        e.gender = 'GENDER_REQUIRED'
      }
      const birthDate = parse(v.birthDate, Common.DATE_FORMAT, new Date())
      if (!v.birthDate) {
        e.birthDate = 'BIRTHDATE_REQUIRED'
      } else if (differenceInYears(new Date(), birthDate) < 18) {
        e.birthDate = 'BIRTHDATE_MINIMUM_AGE'
      }

      if (!v.email) {
        e.email = 'EMAIL_REQUIRED'
      } else if (!Regex.EMAIL_PATTERN.test(v.email.trim())) {
        e.email = 'EMAIL_PATTERN'
      }
      if (v.username && !Regex.USERNAME_PATTERN.test(v.username)) {
        e.username = 'USERNAME_PATTERN'
      }
      if (!user?.id || (user.id && v.password)) {
        if (!Regex.PASSWORD_PATTERN.test(v.password)) {
          e.password = 'PASSWORD_PATTERN'
        }
        if (!Regex.PASSWORD_PATTERN.test(v.passwordConfirmation)) {
          e.passwordConfirmation = 'PASSWORD_PATTERN'
        } else if (v.passwordConfirmation !== v.password) {
          e.passwordConfirmation = 'PASSWORD_CONFIRMATION_MATCH'
        }
      }

      if (!v.addressLine1) {
        e.addressLine1 = 'ADDRESS_LINE1_REQUIRED'
      }
      if (!v.city) {
        e.city = 'CITY_REQUIRED'
      }
      if (!v.region) {
        e.region = 'REGION_REQUIRED'
      }
      if (!v.country) {
        e.country = 'COUNTRY_REQUIRED'
      }
      if (!v.postCode) {
        e.postCode = 'POST_CODE_REQUIRED'
      } else if (
        (v.country === 'CAN' && !Regex.ZIP_CODE_CAN_PATTERN.test(v.postCode)) ||
        (v.country === 'USA' && !Regex.ZIP_CODE_USA_PATTERN.test(v.postCode))
      ) {
        e.postCode = 'POST_CODE_PATTERN'
      }
      if (!v.phoneNumber) {
        e.phoneNumber = 'PHONE_NUMBER_REQUIRED'
      } else if (!Regex.PHONE_PATTERN.test(v.phoneNumber)) {
        e.phoneNumber = 'PHONE_NUMBER_PATTERN'
      }
      if (v.phoneNumberExt && !Regex.PHONE_EXT_PATTERN.test(v.phoneNumberExt)) {
        e.phoneNumberExt = 'PHONE_NUMBER_EXT_PATTERN'
      }

      if (isUserDoctor) {
        if (!v.departmentId) {
          e.departmentId = 'DEPARTMENT_ID_REQUIRED'
        }
        // TODO: Image name validation (format and size)
        // if (v.imageName) {
        //   e.imageName = 'IMAGE_NAME_FORMAT'
        // }
        if (!v.startDate) {
          e.startDate = 'START_DATE_REQUIRED'
        }
        if (v.endDate && v.endDate < v.startDate) {
          e.endDate = 'END_DATE_MINIMUM'
        }
      }

      if (isUserPatient) {
        if (!v.medicalId) {
          e.medicalId = 'MEDICAL_ID_REQUIRED'
        } else if (!Regex.MEDICAL_ID.test(v.medicalId)) {
          e.medicalId = 'MEDICAL_ID_PATTERN'
        }
        if (v.height && v.height < Common.HEIGHT.MIN) {
          e.height = 'HEIGHT_MIN'
        }
        if (v.weight && v.weight < Common.WEIGHT.MIN) {
          e.weight = 'WEIGHT_MIN'
        }
      }

      if (!isEmpty(e)) {
        const fields = Object.keys(omit(e, 'termsAndConditions')).map((field) =>
          t(`FORM.LABEL.${TextFormatUtil.camelCaseToSnakeCase(field).toUpperCase()}`)
        )
        toast.error<string>(t('FORM.ERROR.INVALID_FIELDS_MESSAGE', { fields: fields.join(', ') }))
      }

      return e
    },
    onSubmit: async () => {
      let payload = ''

      if (user?.id) payload += `id: ${user.id}, `

      payload += `first_name: "${values.firstName}", last_name: "${values.lastName}", gender: "${
        values.gender
      }", birth_date: "${values.birthDate}", email: "${values.email}", username: ${
        values.username ? `"${values.username}"` : null
      }, role_id: ${values.roleId ? `${values.roleId}` : `${selectedUserRoleId}`}, language: ${
        values.language ? `"${values.language}"` : `"${'EN'}"`
      }, address: "${values.addressLine1}", address_line2: ${
        values.addressLine2 ? `"${values.addressLine2}"` : null
      }, city: "${values.city}", region: "${values.region}", country: "${values.country}", postal_code: "${
        values.postCode
      }", phone_number: "${values.phoneNumber}", phone_ext: ${
        values.phoneNumberExt ? `"${values.phoneNumberExt}"` : null
      }`

      if (values.password) {
        payload += `, password: "${values.password}"`
      }

      if (isUserDoctor) {
        payload += `, department_id: ${values.departmentId}, image_name: ${
          values.imageName ? `"${values.imageName}"` : null
        }, start_date: "${values.startDate}", end_date: ${values.endDate ? `"${values.endDate}"` : null}`
      } else if (isUserPatient) {
        payload += `, medical_id: "${values.medicalId}", height: ${
          values.height ? `"${values.height}"` : null
        }, weight: ${values.weight ? `"${values.weight}"` : null}`
      }

      let data, errors

      if (isUserDoctor) {
        if (user?.id) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<UpdateDoctorGQLResponse>(
            `mutation { updateDoctor({ id: ${values.id}, input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.updateDoctor.message}`, { ns: 'api' }))
        } else {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<CreateDoctorGQLResponse>(
            `mutation { createDoctor({ input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.createDoctor.message}`, { ns: 'api' }))
        }
      } else if (isUserPatient) {
        if (user?.id) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<UpdatePatientGQLResponse>(
            `mutation { updatePatient({ id: ${values.id}, input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.updatePatient.message}`, { ns: 'api' }))
        } else {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<CreatePatientGQLResponse>(
            `mutation { createPatient({ input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.createPatient.message}`, { ns: 'api' }))
        }
      } else {
        if (user?.id) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<UpdateAdminGQLResponse>(
            `mutation { updateAdmin({ id: ${values.id}, input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.updateAdmin.message}`, { ns: 'api' }))
        } else {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;({ data, errors } = await useRequest<CreateAdminGQLResponse>(
            `mutation { createAdmin({ input: ${payload} }) { message } }`
          ))
          if (data) toast.success<string>(t(`SUCCESS.${data.createAdmin.message}`, { ns: 'api' }))
        }
      }

      if (data) {
        setIsModalOpen(false)
        isFormSubmitted(true)
      }

      if (errors) {
        errors.map((error: GraphQLError) => {
          if (error.extensions) {
            toast.error<string>(t(`ERROR.${error.extensions.code}`, { ns: 'api' }))
          } else {
            console.error(error.message)
          }
        })
      }
    },
  })

  const selectUserRole = (userRoleId: number) => {
    setSelectedUserRoleId(userRoleId)
    setUserProfileStep(UserProfileStep.USER_PROFILE_FORM)
  }

  const goBackToUserRoleSelection = () => {
    setUserProfileStep(UserProfileStep.CHOOSE_USER_ROLE)
  }

  useEffect(() => {
    if (typeof user?.id === 'undefined' && selectedUserRoleId === null) {
      setUserProfileStep(UserProfileStep.CHOOSE_USER_ROLE)
    } else {
      setUserProfileStep(UserProfileStep.USER_PROFILE_FORM)
    }
  }, [])

  return (
    <ConditionalWrap
      condition={isModal}
      wrap={(wrappedChildren) => (
        <Modal
          modalSize={isChooseUserRoleStep ? ModalSize.XS : ModalSize.MD}
          title={t(`USER_PROFILE_MODAL.${user?.id ? 'EDIT' : 'CREATE'}_TITLE`, { ns: 'admin' })}
          isOpen={isModalOpen}
          confirmButton={isChooseUserRoleStep ? null : { label: t('BUTTON.SAVE') }}
          setIsOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
        >
          {wrappedChildren}
        </Modal>
      )}
    >
      {typeof user?.id === 'undefined' && isChooseUserRoleStep ? (
        <>
          <h4>{t('USER_PROFILE_MODAL.CHOOSE_USER_ROLE', { ns: 'admin' })}</h4>
          <RadioGroup value={selectedUserRoleId} onChange={selectUserRole}>
            <RadioGroup.Label className="sr-only">
              {t('USER_PROFILE_MODAL.CHOOSE_USER_ROLE', { ns: 'admin' })}
            </RadioGroup.Label>
            <div className="flex flex-col justify-evenly gap-2 mt-2">
              {UserRolesMap.map((userRoleId: number) => (
                <RadioGroup.Option
                  key={userRoleId}
                  value={userRoleId}
                  className="grid grid-cols-radio-group items-center gap-2 w-full p-4 rounded-md cursor-pointer bg-light-mode-background-secondary dark:bg-dark-mode-background-secondary"
                  onClick={() => selectUserRole(userRoleId)}
                >
                  <RadioGroup.Label className="text-light-mode-text cursor-pointer dark:text-dark-mode-text">
                    {t(`USER_ROLES.${userRoleId}`)}
                  </RadioGroup.Label>
                  <FontAwesomeIcon icon="check" className="invisible ui-checked:visible ui-checked:text-highlight" />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </>
      ) : (
        <>
          {typeof user?.id === 'undefined' && <BackButton handleClick={goBackToUserRoleSelection} />}
          <Tab.Group>
            <Tab.List className={styles.list}>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="id-card" />
                ) : (
                  t('PROFILE.PERSONAL_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="key" />
                ) : (
                  t('PROFILE.LOGIN_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              <Tab className={styles.tab}>
                {width < Common.BREAKPOINT.SM ? (
                  <FontAwesomeIcon icon="location-dot" />
                ) : (
                  t('PROFILE.CONTACT_INFORMATION', { ns: 'account' })
                )}
              </Tab>
              {isUserDoctor && (
                <Tab className={styles.tab}>
                  {width < Common.BREAKPOINT.SM ? (
                    <FontAwesomeIcon icon="user-doctor" />
                  ) : (
                    t('PROFILE.DOCTOR_INFORMATION', { ns: 'account' })
                  )}
                </Tab>
              )}
              {isUserPatient && (
                <Tab className={styles.tab}>
                  {width < Common.BREAKPOINT.SM ? (
                    <FontAwesomeIcon icon="hospital-user" />
                  ) : (
                    t('PROFILE.PATIENT_INFORMATION', { ns: 'account' })
                  )}
                </Tab>
              )}
            </Tab.List>
            <Tab.Panels className={styles.panels}>
              <Tab.Panel className={styles.panel}>
                <UserProfilePersonalInfo values={values} errors={errors} handleChange={handleChange} />
              </Tab.Panel>
              <Tab.Panel className={styles.panel}>
                <UserProfileLoginInfo values={values} errors={errors} handleChange={handleChange} />
              </Tab.Panel>
              <Tab.Panel className={styles.panel}>
                <UserProfileContactInfo values={values} errors={errors} handleChange={handleChange} />
              </Tab.Panel>
              {isUserDoctor && (
                <Tab.Panel className={styles.panel}>
                  <UserProfileDoctorInfo values={values} errors={errors} handleChange={handleChange} />
                </Tab.Panel>
              )}
              {isUserPatient && (
                <Tab.Panel className={styles.panel}>
                  <UserProfilePatientInfo values={values} errors={errors} handleChange={handleChange} />
                </Tab.Panel>
              )}
            </Tab.Panels>
          </Tab.Group>
        </>
      )}
    </ConditionalWrap>
  )
}

export default UserProfile
