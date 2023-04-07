import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { differenceInYears, parse } from 'date-fns'
import { GraphQLError } from 'graphql'
import { isEmpty, omit } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import ConditionalWrap from 'components/ConditionalWrap'
import Modal, { ModalSize } from 'components/Modal'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { UserContact } from 'dtos/user-contact.response'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { TextFormatUtil } from 'utils/text-format'
// import styles from 'styles/modules/Appointment.module.css'

type AppointmentProps = {
  isModal: boolean
  user?: UserContact
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  isFormSubmitted?: (isSubmitted: boolean) => void
}

type CreateAdminGQLResponse = GQLResponse<{ createAdmin: { message: string } }>
type UpdateAdminGQLResponse = GQLResponse<{ updateAdmin: { message: string } }>

const Appointment = ({
  user,
  isModal,
  isModalOpen,
  setIsModalOpen,
  isFormSubmitted,
}: AppointmentProps): JSX.Element => {
  const { t } = useTranslation()

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
      }, language: ${values.language ? `"${values.language}"` : `"${'EN'}"`}, address: "${
        values.addressLine1
      }", address_line2: ${values.addressLine2 ? `"${values.addressLine2}"` : null}, city: "${values.city}", region: "${
        values.region
      }", country: "${values.country}", postal_code: "${values.postCode}", phone_number: "${
        values.phoneNumber
      }", phone_ext: ${values.phoneNumberExt ? `"${values.phoneNumberExt}"` : null}`

      if (values.password) {
        payload += `, password: "${values.password}"`
      }

      let data, errors

      if (user?.id) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, errors } = await useRequest<UpdateAdminGQLResponse>(
          `mutation { updateAdmin(${payload}) { message } }`
        ))
        if (data) toast.success<string>(t(`SUCCESS.${data.updateAdmin.message}`, { ns: 'api' }))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, errors } = await useRequest<CreateAdminGQLResponse>(
          `mutation { createAdmin(${payload}) { message } }`
        ))
        if (data) toast.success<string>(t(`SUCCESS.${data.createAdmin.message}`, { ns: 'api' }))
      }

      if (data) {
        setIsModalOpen(false)
        // isFormSubmitted(true)
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

  useEffect(() => {
    setIsModalOpen(isModalOpen)
  }, [isModalOpen])

  return (
    <ConditionalWrap
      condition={isModal}
      wrap={(wrappedChildren) => (
        <Modal
          // modalSize={isChooseUserRoleStep ? ModalSize.XS : ModalSize.MD}
          title={t(`APPOINTMENT_MODAL.${user?.id ? 'EDIT' : 'CREATE'}_TITLE`, { ns: 'admin' })}
          isOpen={isModalOpen}
          confirmButton={{ label: t('BUTTON.SAVE') }}
          setIsOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
        >
          {wrappedChildren}
        </Modal>
      )}
    >
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, laborum deleniti maiores vel alias doloremque
        illo ratione omnis laudantium suscipit dolore ducimus voluptates! Atque aut temporibus voluptatum suscipit
        debitis iure!
      </>
    </ConditionalWrap>
  )
}

export default Appointment
