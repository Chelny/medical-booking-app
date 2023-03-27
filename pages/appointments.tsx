import type { NextPage } from 'next'
import { User } from '@prisma/client'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Common } from 'constants/common'
import { getAuthCookie } from 'utils/auth-cookies'

type AppointmentsProps = {
  userToken: User
}

const Appointments: NextPage<AppointmentsProps> = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('', { ns: 'appointments' })}</h2>
    </>
  )
}

export const getServerSideProps = async (context: ServerSideContext) => {
  const token = getAuthCookie(context.req) || null

  if (!token) return Common.SERVER_SIDE_PROPS.NO_TOKEN

  const decodedToken = token && jwt_decode(token)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
        'appointments',
      ])),
      userToken: decodedToken?.user,
    },
  }
}

export default Appointments
