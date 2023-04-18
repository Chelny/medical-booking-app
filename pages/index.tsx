import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'
import Button from 'components/elements/Button/Button'
import FormElement from 'components/elements/FormElement/FormElement'
import { Common } from 'constants/common'
import { Routes } from 'constants/routes'
import { UserRole } from 'enums/user-role.enum'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'

type LoginGQLResponse = GQLResponse<{ login: { token: string; user: Omit<User, 'password'> } }>

const Home: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      loginId: '',
      password: '',
    },
    onValidate: (v) => {
      const e: IStringMap = {}
      if (!v.loginId) e.loginId = 'LOGIN_ID_REQUIRED'
      if (!v.password) e.password = 'PASSWORD_REQUIRED'
      return e
    },
    onSubmit: async () => {
      const { data, errors } = await useRequest<LoginGQLResponse>(
        `mutation {
          login(input: { email: "${values.loginId}", username: "${values.loginId}", password: "${values.password}" }) {
            token
            user {
              role_id
            }
          }
        }`
      )

      if (data) data.login.user.role_id === UserRole.ADMIN ? router.push(Routes.ADMIN) : router.push(Routes.DASHBOARD)
      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  return (
    <>
      <h2>{t('LOGIN', { ns: 'home' })}</h2>
      <form data-testid="login-form" noValidate onSubmit={handleSubmit}>
        <FormElement fieldName="loginId" error={errors.loginId}>
          <input
            data-testid="form-input-login-id"
            type="text"
            id="loginId"
            value={values.loginId}
            aria-required={true}
            aria-invalid={!!errors.loginId}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_loginId`}
            onChange={handleChange}
          />
        </FormElement>
        <FormElement
          fieldName="password"
          link={<Link href={Routes.FORGOT_PASSWORD}>{t('FORGOT_PASSWORD', { ns: 'home' })}</Link>}
          error={errors.password}
        >
          <input
            data-testid="form-input-password"
            type="password"
            id="password"
            value={values.password}
            aria-required={true}
            aria-invalid={!!errors.password}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_password`}
            onChange={handleChange}
          />
        </FormElement>
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
