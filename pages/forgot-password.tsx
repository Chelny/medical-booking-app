import { ChangeEvent, FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import { Button, FormElement } from 'components'
import { Common, Regex, Routes } from 'constantss'
import { useRequest } from 'hooks'
import { getAuthCookie } from 'utils'

type ForgotPasswordGQLResponse = GQLResponse<{ forgotPassword: { message: string } }>

interface IFormData {
  email: string
}

const INITIAL_DATA: IFormData = {
  email: '',
}

const ForgotPassword: NextPage = (): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<IFormData>(INITIAL_DATA)

  const updateFields = (fields: Partial<IFormData>): void => {
    setFormData((prev: IFormData) => ({ ...prev, ...fields }))
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const { data, errors } = await useRequest<ForgotPasswordGQLResponse>(
      `mutation { forgotPassword(input: { email: "${formData.email}" }) { message } }`
    )

    if (data) {
      toast.success<string>(t(`SUCCESS.${data.forgotPassword.message}`, { ns: 'api', email: formData.email }))
      router.push(Routes.HOME)
    }
    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  return (
    <>
      <h2>{t('FORGOT_PASSWORD', { ns: 'forgot-password' })}</h2>
      <form data-testid="forgot-password-form" onSubmit={handleSubmit}>
        <FormElement
          fieldName="email"
          type="email"
          required={true}
          pattern={Regex.EMAIL_PATTERN.source}
          value={formData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFields({ email: e.target.value })}
        />
        <div className="w-full">
          <Button type="submit">{t('SEND_EMAIL', { ns: 'forgot-password' })}</Button>
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
        'forgot-password',
      ])),
    },
  }
}

export default ForgotPassword
