import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { differenceInYears, parse } from 'date-fns'
import { isEmpty, omit } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import FormElement from 'components/elements/FormElement/FormElement'
import MultiStepForm from 'components/templates/MultiStepForm/MultiStepForm'
import UserProfileContactInfo from 'components/templates/UserProfileContactInfo/UserProfileContactInfo'
import UserProfileLoginInfo from 'components/templates/UserProfileLoginInfo/UserProfileLoginInfo'
import UserProfilePatientInfo from 'components/templates/UserProfilePatientInfo/UserProfilePatientInfo'
import UserProfilePersonalInfo from 'components/templates/UserProfilePersonalInfo'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { Routes } from 'constants/routes'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'
import { TextFormatUtil } from 'utils/text-format'

type SignUpGQLResponse = GQLResponse<{ signUp: { token: string; message: string } }>

const SignUp: NextPage = (): JSX.Element => {
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

        if (fields.length > 0) {
          toast.error<string>(t('FORM.ERROR.INVALID_FIELDS_MESSAGE', { fields: fields.join(', ') }))
        }
      }

      return e
    },
    onSubmit: async () => {
      const payload = `{ first_name: "${values.firstName}", last_name: "${values.lastName}", gender: "${
        values.gender
      }", birth_date: "${values.birthDate}", email: "${values.email}", username: ${
        values.username ? `"${values.username}"` : null
      }, password: "${values.password}", language: ${
        router.locale ? `"${router.locale.toUpperCase()}"` : null
      }, address: "${values.addressLine1}", address_line2: ${
        values.addressLine2 ? `"${values.addressLine2}"` : null
      }, city: "${values.city}", region: "${values.region}", country: "${values.country}", postal_code: "${
        values.postCode
      }", phone_number: "${values.phoneNumber}", phone_ext: ${
        values.phoneNumberExt ? `"${values.phoneNumberExt}"` : null
      }, medical_id: "${values.medicalId}", height: ${values.height ? `"${values.height}"` : null}, weight: ${
        values.weight ? `"${values.weight}"` : null
      } }`

      const { data, errors } = await useRequest<SignUpGQLResponse>(
        `mutation {
          signUp(input: ${payload}) {
            token
            message
          }
        }`
      )

      if (data) {
        toast.success<string>(t(`SUCCESS.${data.signUp.message}`, { ns: 'api' }))
        router.push(Routes.DASHBOARD)
      }

      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  return (
    <>
      <h2>{t('SIGN_UP', { ns: 'sign-up' })}</h2>
      <MultiStepForm
        fieldGroups={[
          <fieldset key={0}>
            <legend>{t('PERSONAL_INFORMATION', { ns: 'sign-up' })}</legend>
            <UserProfilePersonalInfo values={values} errors={errors} handleChange={handleChange} />
          </fieldset>,
          <fieldset key={1}>
            <legend>{t('LOGIN_INFORMATION', { ns: 'sign-up' })}</legend>
            <UserProfileLoginInfo values={values} errors={errors} handleChange={handleChange} />
          </fieldset>,
          <fieldset key={2}>
            <legend>{t('CONTACT_INFORMATION', { ns: 'sign-up' })}</legend>
            <UserProfileContactInfo values={values} errors={errors} handleChange={handleChange} />
          </fieldset>,
          <fieldset key={3}>
            <legend>{t('MEDICAL_INFORMATION', { ns: 'sign-up' })}</legend>
            <UserProfilePatientInfo values={values} errors={errors} handleChange={handleChange} />
            <FormElement fieldName="termsAndConditions" isLabelHidden error={errors.termsAndConditions}>
              <div className="grid gap-4">
                <input
                  data-testid="form-checkbox-terms-and-conditions"
                  type="checkbox"
                  id="termsAndConditions"
                  checked={values.termsAndConditions}
                  aria-required={true}
                  aria-invalid={!!errors.termsAndConditions}
                  aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_termsAndConditions`}
                  onChange={handleChange}
                />
                <label
                  htmlFor="termsAndConditions"
                  dangerouslySetInnerHTML={{
                    __html: t('FORM.LABEL.TERMS_AND_CONDITIONS', {
                      link: Routes.TERMS_AND_CONDITIONS,
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

export const getServerSideProps = async (context: ServerSideContext) => {
  const token = getAuthCookie(context.req) || null

  if (token) return Common.SERVER_SIDE_PROPS.TOKEN

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
        'sign-up',
      ])),
    },
  }
}

export default SignUp
