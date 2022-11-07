import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { GraphQLError } from 'graphql'
import { toast } from 'react-toastify'
import FormElement from 'components/FormElement'
import Button from 'components/Button'
import { useForm } from 'hooks/useForm'
import DefaultLayout from 'components/DefaultLayout'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'
import { useRouter } from 'next/router'
import React from 'react'
import Link from 'next/link'
import { Routes } from 'constants/routes'

type LoginResponse = GQLResponse<{ login: { token: string } }>

const Home: NextPage = ({ token }: IMixMap) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

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
    onSubmit: () => {
      useRequest<LoginResponse>(
        `{ login(email: "${values.loginId}", username: "${values.loginId}", password: "${values.password}") { token } }`
      )
        .then((res: LoginResponse) => {
          router.push(Routes.DASHBOARD)
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
        <h2>{t('LOGIN', { ns: 'home' })}</h2>
        <form noValidate onSubmit={handleSubmit}>
          <FormElement fieldName="loginId" error={errors.loginId}>
            <input
              data-testid="form-input-login-id"
              type="text"
              id="loginId"
              value={values.loginId}
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
              onChange={handleChange}
            />
          </FormElement>
          <Button type="submit">{t('LOGIN', { ns: 'home' })}</Button>
          <div className="my-4 text-center">
            {t('NEW_USER', { ns: 'home' })} <Link href={Routes.SIGN_UP}>{t('SIGN_UP', { ns: 'home' })}</Link>
          </div>
        </form>
      </>
    </DefaultLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'home'])),
      token,
    },
  }
}

export default Home
