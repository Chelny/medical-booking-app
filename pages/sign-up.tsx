import type { NextPage } from 'next'
import { differenceInYears, parse } from 'date-fns'
import { isEmpty, omit } from 'lodash-es'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FormElement from 'components/form/FormElement'
import MultiStepForm from 'components/form/MultiStepForm'
import PasswordStrengthMeter from 'components/form/PasswordStrengthMeter'
import { Countries } from 'configs/countries'
import { Genders } from 'configs/genders'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { Routes } from 'constants/routes'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'
import { InputMaskUtil } from 'utils/input-mask'
import { TextFormatUtil } from 'utils/text-format'

type SignUpGQLResponse = GQLResponse<{ createPatient: { token: string; message: string } }>

const SignUp: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: '',
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      region: '',
      country: '',
      postCode: '',
      phoneNumber: '',
      phoneNumberExt: '',
      medicalId: '',
      height: '',
      weight: '',
      termsAndConditions: false,
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
      if (!v.termsAndConditions) {
        e.termsAndConditions = 'TERMS_AND_CONDITIONS_REQUIRED'
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

      const { data, errors } = await useRequest<SignUpGQLResponse>(`{ createPatient(${payload}) { token, message } }`)

      if (data) {
        toast.success<string>(t(`SUCCESS.${data.createPatient.message}`, { ns: 'api' }))
        router.push(Routes.DASHBOARD)
      }

      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  const [phoneNumber, setPhoneNumber] = useState(values.phoneNumber)
  const [postCode, setPostCode] = useState(values.postCode)
  const [postCodeMaxLength, setPostCodeMaxLength] = useState(Common.POST_CODE.MAX_LENGTH)
  const [maskMedicalId, setMaskMedicalId] = useState(values.medicalId)

  return (
    <>
      <h2>{t('SIGN_UP', { ns: 'sign-up' })}</h2>
      <MultiStepForm
        fieldGroups={[
          <fieldset key={0}>
            <legend>{t('PERSONAL_INFORMATION', { ns: 'sign-up' })}</legend>
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
            <FormElement fieldName="gender" error={errors.gender}>
              <fieldset
                className="checkbox-radio-group"
                aria-required="true"
                aria-invalid={!!errors.gender}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_gender`}
              >
                <legend>{t('FORM.LABEL.SELECT_GENDER')}</legend>
                {Genders.map((item) => (
                  <div key={item.id}>
                    <input
                      data-testid={`form-radio-gender-${item.label}`}
                      type="radio"
                      id={`gender-${item.label}`}
                      name="gender"
                      checked={values.gender === item.value}
                      value={item.value}
                      onChange={handleChange}
                    />
                    <label htmlFor={`gender-${item.label}`}>{t(`FORM.LIST.GENDERS.${item.label.toUpperCase()}`)}</label>
                  </div>
                ))}
              </fieldset>
            </FormElement>
            <FormElement fieldName="birthDate" error={errors.birthDate}>
              <input
                data-testid="form-input-birth-date"
                type="date"
                id="birthDate"
                min={Common.BIRTH_DATE.MIN}
                max={Common.BIRTH_DATE.MAX}
                value={values.birthDate}
                aria-required="true"
                aria-invalid={!!errors.birthDate}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_birthDate`}
                onChange={handleChange}
              />
            </FormElement>
          </fieldset>,
          <fieldset key={1}>
            <legend>{t('LOGIN_INFORMATION', { ns: 'sign-up' })}</legend>
            <FormElement fieldName="email" error={errors.email}>
              <input
                data-testid="form-input-email"
                type="email"
                id="email"
                autoComplete="email"
                value={values.email}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_email`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="username" error={errors.username} hints={['USERNAME']} optional>
              <input
                data-testid="form-input-username"
                type="text"
                id="username"
                value={values.username}
                aria-required="false"
                aria-invalid={!!errors.username}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_username`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="password" error={errors.password}>
              <input
                data-testid="form-input-password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={values.password}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_password`}
                onChange={handleChange}
              />
            </FormElement>
            <PasswordStrengthMeter password={values.password} />
            <FormElement fieldName="passwordConfirmation" error={errors.passwordConfirmation}>
              <input
                data-testid="form-input-password-confirmation"
                type="password"
                id="password-confirmation"
                value={values.passwordConfirmation}
                aria-required="true"
                aria-invalid={!!errors.passwordConfirmation}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_passwordConfirmation`}
                onChange={handleChange}
              />
            </FormElement>
          </fieldset>,
          <fieldset key={2}>
            <legend>{t('CONTACT_INFORMATION', { ns: 'sign-up' })}</legend>
            <FormElement fieldName="addressLine1" error={errors.addressLine1}>
              <input
                data-testid="form-input-address-line1"
                type="text"
                id="addressLine1"
                value={values.addressLine1}
                aria-required="true"
                aria-invalid={!!errors.addressLine1}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_addressLine1`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="addressLine2" error={errors.addressLine2} optional>
              <input
                data-testid="form-input-address-line2"
                type="text"
                id="addressLine2"
                placeholder={t('FORM.PLACEHOLDER.ADDRESS_LINE2')}
                value={values.addressLine2}
                aria-required="false"
                aria-invalid={!!errors.addressLine2}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_addressLine2`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="country" error={errors.country}>
              <select
                data-testid="form-input-country"
                id="country"
                value={values.country}
                aria-required="true"
                aria-invalid={!!errors.country}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_country`}
                onChange={handleChange}
              >
                <option aria-label={t('FORM.PLACEHOLDER.SELECT')} />
                {Countries.map((country, index: number) => (
                  <option key={+index} value={country.abbr}>
                    {t(`COUNTRIES.${country.abbr}.COUNTRY`)}
                  </option>
                ))}
              </select>
            </FormElement>
            <FormElement fieldName="region" error={errors.region}>
              <select
                data-testid="form-input-region"
                id="region"
                disabled={!values.country}
                value={values.region}
                aria-required="true"
                aria-invalid={!!errors.region}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_region`}
                onChange={handleChange}
              >
                <option>{!values.country ? t('FORM.PLACEHOLDER.REGION') : ''}</option>
                {Countries.filter((country) => country.abbr === values.country).map((country) =>
                  country.regions
                    .sort((a: string, b: string) => {
                      const displayedName = (region: string) => t(`COUNTRIES.${values.country}.REGIONS.${region}`)
                      return displayedName(a).localeCompare(displayedName(b))
                    })
                    .map((region: string, index: number) => (
                      <option key={+index} value={region}>
                        {t(`COUNTRIES.${values.country}.REGIONS.${region}`)}
                      </option>
                    ))
                )}
              </select>
            </FormElement>
            <FormElement fieldName="city" error={errors.city}>
              <input
                data-testid="form-input-city"
                type="text"
                id="city"
                value={values.city}
                aria-required="true"
                aria-invalid={!!errors.city}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_city`}
                onChange={handleChange}
              />
            </FormElement>
            <FormElement fieldName="postCode" error={errors.postCode}>
              <input
                data-testid="form-input-post-code"
                type="text"
                id="post-code"
                maxLength={postCodeMaxLength}
                value={postCode}
                aria-required="true"
                aria-invalid={!!errors.postCode}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_postCode`}
                onChange={(e) => InputMaskUtil.maskPostCode(e, values, setPostCode, setPostCodeMaxLength, handleChange)}
              />
            </FormElement>
            <div className="grid md:landscape:gap-4 md:landscape:grid-cols-[auto_max-content]">
              <FormElement fieldName="phoneNumber" hints={['PHONE_NUMBER_FORMAT']} error={errors.phoneNumber}>
                <input
                  data-testid="form-input-phone-number"
                  type="tel"
                  id="phone-number"
                  placeholder={Common.PHONE_NUMBER.PLACEHOLDER}
                  maxLength={Common.PHONE_NUMBER.MAX_LENGTH}
                  value={phoneNumber}
                  aria-required="true"
                  aria-invalid={!!errors.phoneNumber}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_phoneNumber`}
                  onChange={(e) => InputMaskUtil.maskPhoneNumber(e, setPhoneNumber, handleChange)}
                />
              </FormElement>
              <FormElement fieldName="phoneNumberExt" error={errors.phoneNumberExt} optional>
                <input
                  data-testid="form-input-phone-number-ext"
                  type="tel"
                  id="phone-number-ext"
                  value={values.phoneNumberExt}
                  aria-required="false"
                  aria-invalid={!!errors.phoneNumberExt}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_phoneNumberExt`}
                  onChange={handleChange}
                />
              </FormElement>
            </div>
          </fieldset>,
          <fieldset key={3}>
            <legend>{t('MEDICAL_INFORMATION', { ns: 'sign-up' })}</legend>
            <FormElement fieldName="medicalId" error={errors.medicalId}>
              <input
                data-testid="form-input-medical-id"
                type="text"
                id="medicalId"
                placeholder={Common.MEDICAL_ID.PLACEHOLDER}
                maxLength={Common.MEDICAL_ID.MAX_LENGTH}
                value={maskMedicalId}
                aria-required="true"
                aria-invalid={!!errors.medicalId}
                aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_medicalId`}
                onChange={(e) => InputMaskUtil.maskMedicalId(e, setMaskMedicalId, handleChange)}
              />
            </FormElement>
            <div className="grid grid-cols-2 gap-4">
              <FormElement fieldName="height" error={errors.height} optional>
                <input
                  data-testid="form-input-height"
                  type="number"
                  id="height"
                  min={Common.HEIGHT.MIN}
                  step={Common.HEIGHT.STEP}
                  value={values.height}
                  aria-required="false"
                  aria-invalid={!!errors.height}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_height`}
                  onChange={handleChange}
                />
              </FormElement>
              <FormElement fieldName="weight" error={errors.weight} optional>
                <input
                  data-testid="form-input-weight"
                  type="number"
                  id="weight"
                  min={Common.WEIGHT.MIN}
                  step={Common.WEIGHT.STEP}
                  value={values.weight}
                  aria-required="false"
                  aria-invalid={!!errors.weight}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_weight`}
                  onChange={handleChange}
                />
              </FormElement>
            </div>
            <FormElement fieldName="termsAndConditions" isLabelHidden error={errors.termsAndConditions}>
              <div className="grid gap-4">
                <input
                  data-testid="form-checkbox-terms-and-conditions"
                  type="checkbox"
                  id="termsAndConditions"
                  checked={values.termsAndConditions}
                  aria-required="true"
                  aria-invalid={!!errors.termsAndConditions}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_termsAndConditions`}
                  onChange={handleChange}
                />
                <label
                  htmlFor="termsAndConditions"
                  dangerouslySetInnerHTML={{
                    __html: t('FORM.LABEL.TERMS_AND_CONDITIONS', {
                      link: `/terms-and-conditions`,
                    }),
                  }}
                />
              </div>
            </FormElement>
          </fieldset>,
        ]}
        submitBtnLabel={t('SIGN_UP_BUTTON', { ns: 'sign-up' })}
        onComplete={handleSubmit}
      />
    </>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: Routes.DASHBOARD,
      },
      props: {},
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'sign-up'])),
    },
  }
}

export default SignUp
