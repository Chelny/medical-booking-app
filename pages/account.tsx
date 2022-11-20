import type { NextPage } from 'next'
import { User } from '@prisma/client'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PageLayout from 'components/PageLayout'
import { Routes } from 'constants/routes'
import { getAuthCookie } from 'utils/auth-cookies'

type AccountProps = {
  userToken: User
}

const Account: NextPage<AccountProps> = ({ userToken }) => {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <>
        <h2>{t('', { ns: 'dashboard' })}</h2>
      </>
    </PageLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: Routes.HOME,
      },
      props: {},
    }
  }

  const decodedToken = token && jwt_decode(token)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'appointments'])),
      userToken: decodedToken?.user,
    },
  }
}

export default Account
