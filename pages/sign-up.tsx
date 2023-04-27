import { useState, FormEvent, ChangeEvent } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { kebabCase } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import {
  AccountForm,
  ContactForm,
  FormElement,
  MultiStepActionButtons,
  MultiStepProgressBar,
  PatientForm,
  UserForm,
} from 'components'
import { Common, Routes } from 'constantss'
import { useForm, useRequest } from 'hooks'
import { IAccountFormData, IContactFormData, IPatientFormData, IUserFormData } from 'interfaces'
import { getAuthCookie } from 'utils'

type SignUpGQLResponse = GQLResponse<{ signUp: { token: string; message: string } }>

interface IFormData extends IUserFormData, IAccountFormData, IContactFormData, IPatientFormData {
  termsAndConditions: boolean
}

const INITIAL_DATA: IFormData = {
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',
  language: '',
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
  addressLine1: '',
  addressLine2: '',
  country: '',
  region: '',
  city: '',
  postalCode: '',
  phoneNumber: '',
  phoneNumberExt: '',
  medicalId: '',
  height: '',
  weight: '',
  termsAndConditions: false,
}

const SignUp: NextPage = (): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<IFormData>(INITIAL_DATA)

  const updateFields = (fields: Partial<IFormData>): void => {
    setFormData((prev: IFormData) => ({ ...prev, ...fields }))
  }

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo } = useForm([
    <UserForm key={0} {...formData} updateFields={updateFields} />,
    <AccountForm key={1} {...formData} updateFields={updateFields} />,
    <ContactForm key={2} {...formData} updateFields={updateFields} />,
    <PatientForm key={3} {...formData} updateFields={updateFields} />,
  ])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    if (!isLastStep) return next()

    const payload = `{ first_name: "${formData.firstName}", last_name: "${formData.lastName}", gender: "${
      formData.gender
    }", birth_date: "${formData.birthDate}", email: "${formData.email}", username: ${
      formData.username ? `"${formData.username}"` : null
    }, password: "${formData.password}", language: "${formData.language}", address_line_1: "${
      formData.addressLine1
    }", address_line_2: ${formData.addressLine2 ? `"${formData.addressLine2}"` : null}, city: "${
      formData.city
    }", region: "${formData.region}", country: "${formData.country}", postal_code: "${
      formData.postalCode
    }", phone_number: "${formData.phoneNumber}", phone_number_ext: ${
      formData.phoneNumberExt ? `"${formData.phoneNumberExt}"` : null
    }, medical_id: "${formData.medicalId}", height: ${formData.height ? `"${formData.height}"` : null}, weight: ${
      formData.weight ? `"${formData.weight}"` : null
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
  }

  return (
    <>
      <h2>{t('SIGN_UP', { ns: 'sign-up' })}</h2>
      <form data-testid="sign-up-form" onSubmit={handleSubmit}>
        <MultiStepProgressBar
          stepProgressBarInfo={Common.MULTI_STEP_FORM.PROGRESS_BAR.PATIENT_FORM}
          currentStepIndex={currentStepIndex}
          goToStep={goTo}
        />
        <div className="afterMultiStepFormContainer">
          {step}
          {isLastStep && (
            <FormElement
              fieldName="termsAndConditions"
              isLabelHidden={true}
              type="checkbox"
              required={true}
              checked={formData.termsAndConditions}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateFields({ termsAndConditions: (e.target as HTMLInputElement).checked })
              }
            >
              <label
                htmlFor={kebabCase('termsAndConditions')}
                dangerouslySetInnerHTML={{
                  __html: t('FORM.LABEL.TERMS_AND_CONDITIONS', {
                    link: Routes.TERMS_AND_CONDITIONS,
                  }),
                }}
              />
            </FormElement>
          )}
          <MultiStepActionButtons
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            back={back}
            submitButtonLabel={t('SIGN_UP_BUTTON', { ns: 'sign-up' })}
          />
        </div>
      </form>
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
        'account',
      ])),
    },
  }
}

export default SignUp
