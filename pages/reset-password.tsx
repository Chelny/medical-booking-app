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
import { Regex } from 'constants/regex'
import { useRouter } from 'next/router'
import React from 'react'
import PasswordStrengthMeter from 'components/PasswordStrengthMeter'
import { getAuthCookie } from 'utils/auth-cookies'
import { Routes } from 'constants/routes'

type ResetPasswordResponse = GQLResponse<{ resetPassword: { message: string } }>

const ResetPassword: NextPage = ({ token }: IMixMap) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
    onValidate: (v) => {
      const e: IStringMap = {}
      if (!v.newPassword) {
        e.newPassword = 'NEW_PASSWORD_REQUIRED'
      } else if (!Regex.PASSWORD_PATTERN.test(v.newPassword)) {
        e.newPassword = 'PASSWORD_PATTERN'
      }
      if (!v.newPasswordConfirmation) {
        e.newPasswordConfirmation = 'NEW_PASSWORD_CONFIRMATION_REQUIRED'
      } else if (!Regex.PASSWORD_PATTERN.test(v.newPasswordConfirmation)) {
        e.newPasswordConfirmation = 'PASSWORD_PATTERN'
      } else if (v.newPasswordConfirmation !== v.newPassword) {
        e.newPasswordConfirmation = 'PASSWORD_CONFIRMATION_MATCH'
      }
      return e
    },
    onSubmit: () => {
      useRequest<ResetPasswordResponse>(
        `{ resetPassword(password: "${values.newPassword}", token: "${router.query.token}") { message } }`
      )
        .then((res: ResetPasswordResponse) => {
          toast.success<String>(t(`SUCCESS.${res.data.resetPassword.message}`, { ns: 'api' }))
          router.push(Routes.HOME)
        })
        .catch((err: GraphQLError) => {
          // TODO: Test expired token: http://localhost:3000/reset-password?token=efc31ab7d18085c94c6645ecb4541f1a:e193146f44bf9794ec752e4848cef124fb3c6f487f12aeab02851e5c8ea0b64f63f55a91a71108df4368f2dcdd992cc5c2ba77793d78f668aa6aea88d99a67cbcd23058ced02e1664fa2c9259b4a2387
          toast.error<String>(t(`ERROR.${err.extensions.code}`, { ns: 'api' }))
        })
    },
  })

  React.useEffect(() => {
    if (token) router.push(Routes.DASHBOARD)
    if (!router.isReady) return
    if (!router.query.token) router.push(Routes.HOME)
    setLoading(false)
  }, [token, router.isReady])

  if (loading) return <DefaultLayout>{t('LOADING')}</DefaultLayout>

  return (
    <DefaultLayout>
      <>
        <h2>{t('RESET_PASSWORD', { ns: 'reset-password' })}</h2>
        <form data-testid="reset-password-form" noValidate onSubmit={handleSubmit}>
          <FormElement fieldName="newPassword" error={errors.newPassword}>
            <input
              data-testid="reset-password-form-new-password"
              type="password"
              id="newPassword"
              value={values.newPassword}
              onChange={handleChange}
            />
          </FormElement>
          <PasswordStrengthMeter password={values.newPassword} />
          <FormElement fieldName="newPasswordConfirmation" error={errors.newPasswordConfirmation}>
            <input
              data-testid="reset-password-form-new-password-confirmation"
              type="password"
              id="newPasswordConfirmation"
              value={values.newPasswordConfirmation}
              onChange={handleChange}
            />
          </FormElement>
          <Button type="submit">{t('RESET_PASSWORD', { ns: 'reset-password' })}</Button>
        </form>
      </>
    </DefaultLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'reset-password'])),
      token,
    },
  }
}

export default ResetPassword
