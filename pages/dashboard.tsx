import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import DefaultLayout from 'components/DefaultLayout'
import { getAuthCookie } from 'utils/auth-cookies'

const Dashboard: NextPage = () => {
  const { t } = useTranslation()

  return (
    <DefaultLayout>
      <>
        <h2>{t('WELCOME', { ns: 'dashboard' })}</h2>
      </>
    </DefaultLayout>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'dashboard'])),
      token,
    },
  }
}

export default Dashboard
