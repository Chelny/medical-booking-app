import { Tab } from '@headlessui/react'
import { parse, differenceInYears } from 'date-fns'
import { isEmpty, omit } from 'lodash-es'
import router from 'next/router'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FormElement from 'components/FormElement'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { UserContact } from 'dtos/user-contact.response'
import { useForm } from 'hooks/useForm'
import { TextFormatUtil } from 'utils/text-format'
import './UserProfile.css'

type UserProfileProps = {
  user: UserContact
}

const UserProfile = ({ user }: UserProfileProps): JSX.Element => {
  const { t } = useTranslation()
  const isUserDoctor = 'Doctor' in user && !!user.Doctor
  const isUserPatient = 'Patient' in user && !!user.Patient

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      gender: user.gender,
      birthDate: user.birth_date,
      email: user.email,
      username: user.username,
      password: '',
      passwordConfirmation: '',
      addressLine1: user.Contact?.address,
      addressLine2: user.Contact?.address_line2,
      city: user.Contact?.city,
      region: user.Contact?.region,
      country: user.Contact?.country,
      postCode: user.Contact?.postal_code,
      phoneNumber: user.Contact?.phone_number,
      phoneNumberExt: user.Contact?.phone_ext,
      departmentId: isUserDoctor ? user.Doctor?.department_id : '',
      imageName: isUserDoctor ? user.Doctor?.image_name : '',
      startDate: isUserDoctor ? user.Doctor?.start_date : '',
      endDate: isUserDoctor ? user.Doctor?.end_date : '',
      medicalId: isUserPatient ? user.Patient?.medical_id : '',
      height: isUserPatient ? user.Patient?.height : '',
      weight: isUserPatient ? user.Patient?.weight : '',
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
      if (!v.password) {
        e.password = 'PASSWORD_REQUIRED'
      } else if (!Regex.PASSWORD_PATTERN.test(v.password)) {
        e.password = 'PASSWORD_PATTERN'
      }
      if (!v.passwordConfirmation) {
        e.passwordConfirmation = 'PASSWORD_CONFIRMATION_REQUIRED'
      } else if (!Regex.PASSWORD_PATTERN.test(v.passwordConfirmation)) {
        e.passwordConfirmation = 'PASSWORD_PATTERN'
      } else if (v.passwordConfirmation !== v.password) {
        e.passwordConfirmation = 'PASSWORD_CONFIRMATION_MATCH'
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

      if (!isEmpty(e)) {
        const fields = Object.keys(omit(e, 'termsAndConditions')).map((field) =>
          t(`FORM.LABEL.${TextFormatUtil.camelCaseToSnakeCase(field).toUpperCase()}`)
        )
        toast.error<string>(t('INVALID_FIELDS_MESSAGE', { ns: 'sign-up', fields: fields.join(', ') }))
      }

      return e
    },
    onSubmit: async () => {
      const birthDate = new Date(values.birthDate)
      birthDate.setHours(0)
      birthDate.setMinutes(0)
      birthDate.setMilliseconds(0)

      let payload = `first_name: "${values.firstName}", last_name: "${values.lastName}", gender: "${
        values.gender
      }", birth_date: "${birthDate.toISOString()}", email: "${values.email}", password: "${
        values.password
      }", address: "${values.addressLine1}", address_line2: "${values.addressLine2}", city: "${
        values.city
      }", region: "${values.region}", country: "${values.country}", postal_code: "${values.postCode}", phone_number: "${
        values.phoneNumber
      }", phone_ext: "${values.phoneNumberExt}", medical_id: "${values.medicalId}", height: "${
        values.height
      }", weight: "${values.weight}"`

      if (values.username) {
        payload += `, username: "${values.username}"`
      }

      if (router.locale) {
        payload += `, language: "${router.locale}"`
      }

      // TODO: Create and Edit User
      // const { data, errors } = await useRequest<SignUpGQLResponse>(`{ createPatient(${payload}) { token, message } }`)

      // if (data) {
      //   toast.success<string>(t(`SUCCESS.${data.createPatient.message}`, { ns: 'api' }))
      //   router.push(Routes.DASHBOARD)
      // }

      // if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  const [phoneNumber, setPhoneNumber] = useState(values.phoneNumber)
  const [postCode, setPostCode] = useState(values.postCode)
  const [postCodeMaxLength, setPostCodeMaxLength] = useState(Common.POST_CODE.MAX_LENGTH)
  const [maskMedicalId, setMaskMedicalId] = useState(values.medicalId)

  return (
    <Tab.Group>
      <Tab.List className="tab-list">
        <Tab className="tab-list__tab">{t('PROFILE.PERSONAL_INFORMATION', { ns: 'account' })}</Tab>
        <Tab className="tab-list__tab">{t('PROFILE.LOGIN_INFORMATION', { ns: 'account' })}</Tab>
        <Tab className="tab-list__tab">{t('PROFILE.CONTACT_INFORMATION', { ns: 'account' })}</Tab>
        {isUserDoctor && <Tab className="tab-list__tab">{t('PROFILE.DOCTOR_INFORMATION', { ns: 'account' })}</Tab>}
        {isUserPatient && <Tab className="tab-list__tab">{t('PROFILE.PATIENT_INFORMATION', { ns: 'account' })}</Tab>}
      </Tab.List>
      <Tab.Panels className="tab-panels">
        <Tab.Panel className="tab-panels__panel">
          <div className="grid grid-cols-2 gap-2">
            <FormElement fieldName="firstName" error={errors.firstName}>
              <input
                data-testid="form-input-first-name"
                type="text"
                id="first-name"
                value={values.firstName}
                aria-required="true"
                aria-invalid={!!errors.firstName}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_firstName`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="lastName" error={errors.lastName}>
              <input
                data-testid="form-input-last-name"
                type="text"
                id="last-name"
                value={values.lastName}
                aria-required="true"
                aria-invalid={!!errors.lastName}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_lastName`}
                onChange={handleChange}
              />
            </FormElement>
          </div>
        </Tab.Panel>
        <Tab.Panel className="tab-panels__panel">{JSON.stringify(user, null, 2)}</Tab.Panel>
        <Tab.Panel className="tab-panels__panel">{JSON.stringify(user.Contact, null, 2)}</Tab.Panel>
        {isUserDoctor && <Tab.Panel className="tab-panels__panel">{JSON.stringify(user.Doctor, null, 2)}</Tab.Panel>}
        {isUserPatient && <Tab.Panel className="tab-panels__panel">{JSON.stringify(user.Patient, null, 2)}</Tab.Panel>}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default UserProfile
