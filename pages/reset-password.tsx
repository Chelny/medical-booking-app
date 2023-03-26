import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import Button from 'components/Button'
import FormElement from 'components/form/FormElement'
import PasswordStrengthMeter from 'components/form/PasswordStrengthMeter'
import { Common } from 'constants/common'
import { Regex } from 'constants/regex'
import { Routes } from 'constants/routes'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'

type ResetPasswordGQLResponse = GQLResponse<{ resetPassword: { message: string } }>
type CheckResetPasswordLinkValidityGQLResponse = GQLResponse<{ checkResetPasswordLinkValidity: { message: string } }>

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [expiredLinkText, setExpiredLinkText] = useState<string | null>(null)

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
    onSubmit: async () => {
      const { data, errors } = await useRequest<ResetPasswordGQLResponse>(
        `{ resetPassword(password: "${values.newPassword}", token: "${router.query.token}") { message } }`
      )

      if (data) {
        toast.success<string>(t(`SUCCESS.${data.resetPassword.message}`, { ns: 'api' }))
        router.push(Routes.HOME)
      }

      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  const checkResetPasswordLinkValidity = async () => {
    setIsLoading(true)

    const { data, errors } = await useRequest<CheckResetPasswordLinkValidityGQLResponse>(
      `{ checkResetPasswordLinkValidity(token: "${router.query.token}") { message } }`
    )

    if (data) setIsLoading(false)

    if (errors) {
      // TODO: Test expired token: http://localhost:3000/reset-password?token=efc31ab7d18085c94c6645ecb4541f1a:e193146f44bf9794ec752e4848cef124fb3c6f487f12aeab02851e5c8ea0b64f63f55a91a71108df4368f2dcdd992cc5c2ba77793d78f668aa6aea88d99a67cbcd23058ced02e1664fa2c9259b4a2387
      setExpiredLinkText(`ERROR.${errors[0].extensions.code}`)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkResetPasswordLinkValidity()
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.token) {
      checkResetPasswordLinkValidity()
    } else {
      router.push(Routes.HOME)
    }
  }, [router])

  if (isLoading) return <>{t('LOADING')}</>
  if (expiredLinkText) return <>{t(expiredLinkText, { ns: 'api' })}</>

  return (
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
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  if (token) return Common.SERVER_SIDE_PROPS.TOKEN

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
        'reset-password',
      ])),
    },
  }
}

export default ResetPassword
