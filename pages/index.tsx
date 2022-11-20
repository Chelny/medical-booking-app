import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Button from 'components/Button'
import FormElement from 'components/FormElement'
import PageLayout from 'components/PageLayout'
import { Routes } from 'constants/routes'
import { useForm } from 'hooks/useForm'
import { useRequest } from 'hooks/useRequest'
import { getAuthCookie } from 'utils/auth-cookies'

type LoginResponse = GQLResponse<{ login: { token: string } }>

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
      const { data, errors } = await useRequest<LoginResponse>(
        `{ login(email: "${values.loginId}", username: "${values.loginId}", password: "${values.password}") { token } }`
      )

      if (data) router.push(Routes.DASHBOARD)
      if (errors) toast.error<string>(t(`ERROR.${errors[0].extensions.code}`, { ns: 'api' }))
    },
  })

  return (
    <PageLayout>
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
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'home'])),
    },
  }
}

export default Home
