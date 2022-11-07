import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { differenceInYears, format, parse, subYears } from 'date-fns'
import React from 'react'
import { toast } from 'react-toastify'
import { getAuthCookie } from 'utils/auth-cookies'
import { Regex } from 'constants/regex'
import { Common } from 'constants/common'
import { useForm } from 'hooks/useForm'
import { Genders } from 'configs/genders'
import { InputMaskUtil } from 'utils/input-mask'
import { Countries } from 'configs/countries'
import DefaultLayout from 'components/DefaultLayout'
import MultiStepForm from 'components/MultiStepForm'
import FormElement from 'components/FormElement'
import PasswordStrengthMeter from 'components/PasswordStrengthMeter'
import { useRequest } from 'hooks/useRequest'
import { GraphQLError } from 'graphql'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

type SignUpResponse = GQLResponse<{ createPatient: { token: string; message: string } }>

const SignUp: NextPage = ({ token }: IMixMap) => {
  const { t } = useTranslation()
  const router = useRouter()
  const maxBirthdate = format(subYears(new Date(), 18), Common.DATE_FORMAT)
  const minBirthdate = format(subYears(new Date(), 100), Common.DATE_FORMAT)
  const [loading, setLoading] = React.useState(true)

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
      return e
    },
    onSubmit: () => {
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

      useRequest<SignUpResponse>(`{ createPatient(${payload}) { token, message } }`)
        .then((res: SignUpResponse) => {
          toast.success<String>(t(`SUCCESS.${res.data.createPatient.message}`, { ns: 'api' }))
          router.push(Routes.DASHBOARD)
        })
        .catch((err: GraphQLError) => {
          toast.error<String>(t(`ERROR.${err.extensions.code}`, { ns: 'api' }))
        })
    },
  })

  const [phoneNumber, setPhoneNumber] = React.useState(values.phoneNumber)
  const [postCode, setPostCode] = React.useState(values.postCode)
  const [postCodeMaxLength, setPostCodeMaxLength] = React.useState(Common.POST_CODE.MAX_LENGTH)
  const [maskMedicalId, setMaskMedicalId] = React.useState(values.medicalId)

  React.useEffect(() => {
    if (token) router.push(Routes.DASHBOARD)
    setLoading(false)
  }, [token])

  if (loading) return <DefaultLayout>{t('LOADING')}</DefaultLayout>

  return (
    <DefaultLayout>
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
                  onChange={handleChange}
                />
              </FormElement>
              <FormElement fieldName="lastName" error={errors.lastName}>
                <input
                  data-testid="form-input-last-name"
                  type="text"
                  id="last-name"
                  value={values.lastName}
                  onChange={handleChange}
                />
              </FormElement>
              <FormElement error={errors.gender}>
                <fieldset className="checkbox-radio-group">
                  <legend>{t('FORM.LABEL.GENDER')}</legend>
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
                      <label htmlFor={`gender-${item.label}`}>{t(`GENDERS.${item.label.toUpperCase()}`)}</label>
                    </div>
                  ))}
                </fieldset>
              </FormElement>
              <FormElement fieldName="birthDate" error={errors.birthDate}>
                <input
                  data-testid="form-input-birth-date"
                  type="date"
                  id="birthDate"
                  min={minBirthdate}
                  max={maxBirthdate}
                  value={values.birthDate}
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
                  onChange={handleChange}
                />
              </FormElement>
              <FormElement fieldName="username" error={errors.username} hints={['USERNAME']} optional>
                <input
                  data-testid="form-input-username"
                  type="text"
                  id="username"
                  value={values.username}
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
                  onChange={handleChange}
                />
              </FormElement>
              <FormElement fieldName="country" error={errors.country}>
                <select data-testid="form-input-country" id="country" value={values.country} onChange={handleChange}>
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
                  onChange={(e) =>
                    InputMaskUtil.maskPostCode(e, values, setPostCode, setPostCodeMaxLength, handleChange)
                  }
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
                    onChange={(e) => InputMaskUtil.maskPhoneNumber(e, setPhoneNumber, handleChange)}
                  />
                </FormElement>
                <FormElement fieldName="phoneNumberExt" error={errors.phoneNumberExt} optional>
                  <input
                    data-testid="form-input-phone-number-ext"
                    type="tel"
                    id="phone-number-ext"
                    value={values.phoneNumberExt}
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
                    onChange={handleChange}
                  />
                </FormElement>
              </div>
              <FormElement error={errors.termsAndConditions}>
                <div className="grid gap-4">
                  <input
                    data-testid="form-checkbox-terms-and-conditions"
                    type="checkbox"
                    id="termsAndConditions"
                    checked={values.termsAndConditions}
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
    </DefaultLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'sign-up'])),
      token,
    },
  }
}

export default SignUp
