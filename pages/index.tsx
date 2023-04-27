import { ChangeEvent, FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import { Button, FormElement } from 'components'
import { Common, Routes } from 'constantss'
import { UserRole } from 'enums'
import { useRequest } from 'hooks'
import { getAuthCookie } from 'utils'

type LoginGQLResponse = GQLResponse<{ login: { token: string; user: Omit<User, 'password'> } }>

interface IFormData {
  accountId: string
  password: string
}

const INITIAL_DATA: IFormData = {
  accountId: '',
  password: '',
}

const Home: NextPage = (): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<IFormData>(INITIAL_DATA)

  const updateFields = (fields: Partial<IFormData>): void => {
    setFormData((prev: IFormData) => ({ ...prev, ...fields }))
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const { data, errors } = await useRequest<LoginGQLResponse>(
      `mutation {
        login(
          input: {
            email: "${formData.accountId}",
            username: "${formData.accountId}",
            password: "${formData.password}"
          }
        ) {
          token
          user {
            role_id
          }
        }
      }`
    )

    if (data) data.login.user.role_id === UserRole.ADMIN ? router.push(Routes.ADMIN) : router.push(Routes.DASHBOARD)
    if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
  }

  return (
    <>
      <h2>{t('LOGIN', { ns: 'home' })}</h2>
      <form data-testid="login-form" onSubmit={handleSubmit}>
        <FormElement
          fieldName="accountId"
          type="text"
          required={true}
          value={formData.accountId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFields({ accountId: e.target.value })}
        />
        <FormElement
          fieldName="password"
          type="password"
          required={true}
          value={formData.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFields({ password: e.target.value })}
        />
        <div className="w-full">
          <Button type="submit">{t('LOGIN', { ns: 'home' })}</Button>
        </div>
        <div className="my-4 text-center">
          {t('NEW_USER', { ns: 'home' })} <Link href={Routes.SIGN_UP}>{t('SIGN_UP', { ns: 'home' })}</Link>
        </div>
      </form>
    </>
  )
}

export const getServerSideProps = async (context: ServerSideContext) => {
  const token = getAuthCookie(context.req) || null

  if (token) {
    // TODO: Use library (prefixed by "with") to return the auth user instead of getting the token - "jwt_decode" and "getAuthCookie" "should not be used in pages?
    const decodedToken = token && jwt_decode(token)
    if (decodedToken.user.role_id === UserRole.ADMIN) {
      return {
        ...Common.SERVER_SIDE_PROPS.TOKEN,
        redirect: { ...Common.SERVER_SIDE_PROPS.TOKEN.redirect, destination: Routes.ADMIN },
      }
    }

    return Common.SERVER_SIDE_PROPS.TOKEN
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES, 'home'])),
    },
  }
}

export default Home
