import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import Button from 'components/Button'
import FormElement from 'components/FormElement'
import PageLayout from 'components/PageLayout'
import { Regex } from 'constants/regex'
import { Routes } from 'constants/routes'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'

type ForgotPasswordGQLResponse = GQLResponse<{ forgotPassword: { message: string } }>

const ForgotPassword: NextPage = () => {
  const { t } = useTranslation()

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '' },
    onValidate: (v) => {
      const e: IStringMap = {}
      if (!v.email) {
        e.email = 'EMAIL_REQUIRED'
      } else if (!Regex.EMAIL_PATTERN.test(v.email.trim())) {
        e.email = 'EMAIL_PATTERN'
      }
      return e
    },
    onSubmit: async () => {
      const { data, errors } = await useRequest<ForgotPasswordGQLResponse>(
        `{ forgotPassword(email: "${values.email}") { message } }`
      )

      if (data) toast.success<string>(t(`SUCCESS.${data.forgotPassword.message}`, { ns: 'api', email: values.email }))
      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  return (
    <PageLayout>
      <>
        <h2>{t('FORGOT_PASSWORD', { ns: 'forgot-password' })}</h2>
        <form data-testid="forgot-password-form" noValidate onSubmit={handleSubmit}>
          <FormElement fieldName="email" error={errors.email}>
            <input
              data-testid="forgot-password-form-email"
              type="email"
              id="email"
              value={values.email}
              onChange={handleChange}
            />
          </FormElement>
          <Button type="submit">{t('SEND_EMAIL', { ns: 'forgot-password' })}</Button>
        </form>
      </>
    </PageLayout>
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
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'forgot-password'])),
    },
  }
}

export default ForgotPassword
