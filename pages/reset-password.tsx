import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import { Button, FormElement, PasswordStrengthMeter } from 'components'
import { Common, Regex, Routes } from 'constantss'
import { useRequest } from 'hooks'
import { getAuthCookie } from 'utils'

type ResetPasswordGQLResponse = GQLResponse<{ resetPassword: { message: string } }>
type CheckResetPasswordLinkValidityGQLResponse = GQLResponse<{ checkResetPasswordLinkValidity: { message: string } }>

interface IFormData {
  password: string
  passwordConfirmation: string
}

const INITIAL_DATA: IFormData = {
  password: '',
  passwordConfirmation: '',
}

const ResetPassword: NextPage = (): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [expiredLinkText, setExpiredLinkText] = useState<string | null>(null)
  const [formData, setFormData] = useState<IFormData>(INITIAL_DATA)

  const updateFields = (fields: Partial<IFormData>): void => {
    setFormData((prev: IFormData) => ({ ...prev, ...fields }))
  }

  const checkResetPasswordLinkValidity = async (): Promise<void> => {
    if (!router.query.token) return

    setIsLoading(true)

    const { data, errors } = await useRequest<CheckResetPasswordLinkValidityGQLResponse>(
      `query { checkResetPasswordLinkValidity(params: { token: "${router.query.token}" }) { message } }`
    )

    if (data) setIsLoading(false)

    if (errors) {
      // NOTE: Test expired token: http://localhost:3000/reset-password?token=efc31ab7d18085c94c6645ecb4541f1a:e193146f44bf9794ec752e4848cef124fb3c6f487f12aeab02851e5c8ea0b64f63f55a91a71108df4368f2dcdd992cc5c2ba77793d78f668aa6aea88d99a67cbcd23058ced02e1664fa2c9259b4a2387
      setExpiredLinkText(`ERROR.${errors[0].extensions.code}`)
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const { data, errors } = await useRequest<ResetPasswordGQLResponse>(
      `mutation {
          resetPassword(
            input: { password: "${formData.password}", token: "${router.query.token}" }
          ) {
            message
          }
        }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.resetPassword.message}`, { ns: 'api' }))
      router.push(Routes.HOME)
    }

    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
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
      <div className="mb-6">{t('PASSWORD_REQUIREMENTS', { ns: 'reset-password' })}</div>
      <form data-testid="reset-password-form" onSubmit={handleSubmit}>
        <FormElement
          fieldName="password"
          type="password"
          required={true}
          pattern={Regex.PASSWORD_PATTERN.source}
          value={formData.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFields({ password: e.target.value })}
        />
        <PasswordStrengthMeter password={formData.password} />
        <FormElement
          fieldName="passwordConfirmation"
          type="password"
          required={true}
          pattern={Regex.PASSWORD_PATTERN.source}
          value={formData.passwordConfirmation}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFields({ passwordConfirmation: e.target.value })}
        />
        <div className="w-full">
          <Button type="submit">{t('RESET_PASSWORD', { ns: 'reset-password' })}</Button>
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
        'reset-password',
      ])),
    },
  }
}

export default ResetPassword
