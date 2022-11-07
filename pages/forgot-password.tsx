import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import DefaultLayout from 'components/DefaultLayout'
import FormElement from 'components/FormElement'
import { GraphQLError } from 'graphql'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import Button from 'components/Button'
import { getAuthCookie } from 'utils/auth-cookies'
import { Regex } from 'constants/regex'
import React from 'react'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

type ForgotPasswordResponse = GQLResponse<{ forgotPassword: { message: string } }>

const ForgotPassword: NextPage = ({ token }: IMixMap) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

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
    onSubmit: () => {
      useRequest<ForgotPasswordResponse>(`{ forgotPassword(email: "${values.email}") { message } }`)
        .then((res: ForgotPasswordResponse) => {
          toast.success<String>(t(`SUCCESS.${res.data.forgotPassword.message}`, { ns: 'api', email: values.email }))
        })
        .catch((err: GraphQLError) => {
          toast.error<String>(t(`ERROR.${err.extensions.code}`, { ns: 'api' }))
        })
    },
  })

  React.useEffect(() => {
    if (token) router.push(Routes.DASHBOARD)
    setLoading(false)
  }, [token])

  if (loading) return <DefaultLayout>{t('LOADING')}</DefaultLayout>

  return (
    <DefaultLayout>
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
    </DefaultLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'forgot-password'])),
      token,
    },
  }
}

export default ForgotPassword
