import type { NextPage } from 'next'
import { User } from '@prisma/client'
import { addYears, getHours, isEqual } from 'date-fns'
import { GraphQLError } from 'graphql'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
// import { toast } from 'react-toastify'
import Button from 'components/Button'
import PageLayout from 'components/PageLayout'
import { Common } from 'constants/common'
import { Routes } from 'constants/routes'
import { PatientAppointement } from 'dtos/user-appointment.response'
import { useRequest } from 'hooks/useRequest'
import { useWindowSize } from 'hooks/useWindowSize'
import { getAuthCookie } from 'utils/auth-cookies'
import { TextFormatUtil } from 'utils/text-format'

type DashboardProps = {
  userToken: User
  user: User
  userErrors: GraphQLError[]
  appointments: PatientAppointement[]
  appointmentsErrors: GraphQLError[]
}

type GetUserByIdResponse = GQLResponse<{ getUserById: User }>
type GetAppointmentsByPatientIdResponse = GQLResponse<{ getAppointmentsByPatientId: PatientAppointement[] }>

const Dashboard: NextPage<DashboardProps> = ({ userToken, user, userErrors, appointments, appointmentsErrors }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const [displayedAppointments, setDisplayedAppointments] = useState<PatientAppointement[]>([])
  const [selectedDate, setSelectDate] = useState<Date>(new Date())
  const [timePeriod, setTimePeriod] = useState('NIGHT')
  const minDate = new Date(2022, 0, 1)
  const maxDate = addYears(new Date(), 1)

  const handleSelectDate = (date: Date) => {
    setSelectDate(date)
    setDisplayedAppointments(
      appointments.filter((appointment: PatientAppointement) =>
        isEqual(new Date(appointment.start_date).setHours(0, 0, 0, 0), date)
      )
    )
  }

  useEffect(() => {
    // TODO: User and appointments errors
    // if (appointmentsErrors) {
    //   appointmentsErrors.forEach((error) => {
    //     toast.error<string>(t(`ERROR.${error.extensions.code}`, { ns: 'api' }))
    //   })
    // }

    const hour = getHours(new Date())

    if (hour >= 5 && hour < 12) {
      setTimePeriod('MORNING')
    } else if (hour >= 12 && hour < 17) {
      setTimePeriod('AFTERNOON')
    } else if (hour >= 17 && hour < 21) {
      setTimePeriod('EVENING')
    } else {
      setTimePeriod('NIGHT')
    }
  }, [])

  return (
    <PageLayout>
      <>
        <h2>{t('WELCOME', { ns: 'dashboard', context: timePeriod, name: user.first_name })}</h2>
        <Calendar
          calendarType="US"
          locale={router.locale}
          minDate={minDate}
          maxDate={maxDate}
          showDoubleView={width >= Common.BREAKPOINT.MD}
          tileClassName={({ activeStartDate, date, view }) =>
            appointments.find((appointment: PatientAppointement) =>
              isEqual(new Date(appointment.start_date).setHours(0, 0, 0, 0), date)
            )
              ? 'has-appointments'
              : null
          }
          onChange={handleSelectDate}
        />
        <section id="appointmentDetails" className="p-4 mt-6 bg-light-shade dark:bg-dark-shade dark:text-white">
          <h3>
            {t('APPOINTMENTS', {
              ns: 'dashboard',
              date: TextFormatUtil.dateFormat(selectedDate, router, 'PPPP'),
            })}
          </h3>

          {displayedAppointments.length > 0 ? (
            <ul>
              {displayedAppointments.map((appointment, i) => (
                <li key={i} className="py-4 border-b border-b-medium-tint last:border-b-0 dark:border-b-dark-tint">
                  <>
                    <div>
                      {appointment.Doctor.User.first_name} {appointment.Doctor.User.last_name} (
                      {t(`DOCTOR_DEPARTMENT.${appointment.Doctor.Department.title}`)}) <br />
                      {TextFormatUtil.dateFormat(appointment.start_date, router, 'p')}
                      {' - '}
                      {TextFormatUtil.dateFormat(appointment.end_date, router, 'p')} <br />
                      {appointment.reason} <br />
                    </div>
                    <div className="sm:flex sm:gap-1">
                      <Button className="bg-primary-day dark:bg-primary-night">
                        {t('APPOINTMENT_DETAILS', { ns: 'dashboard' })}
                      </Button>
                      <Button className="bg-primary-day-shade dark:bg-primary-night-shade">
                        {t('APPOINTMENT_UPDATE', { ns: 'dashboard' })}
                      </Button>
                    </div>
                  </>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-medium dark:text-medium-shade">{t('NO_APPOINTMENTS', { ns: 'dashboard' })}</p>
          )}
        </section>
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
  const { data: user, errors: getUserErrors } = await useRequest<GetUserByIdResponse>(
    `{ getUserById(id: ${decodedToken?.user?.id}) { first_name, last_name } }`
  )
  const { data: appointments, errors: getAppointmentsErrors } = await useRequest<GetAppointmentsByPatientIdResponse>(
    `{ getAppointmentsByPatientId(id: ${decodedToken?.user?.id}) { reason, start_date, end_date, notes, Doctor {
      image_name, User { first_name, last_name }, Department { title } } } }`
  )

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'api', 'dashboard'])),
      userToken: decodedToken?.user,
      user: user?.getUserById || ({} as User),
      userErrors: getUserErrors || null,
      appointments: appointments?.getAppointmentsByPatientId || [],
      appointmentsErrors: getAppointmentsErrors || null,
    },
  }
}

export default Dashboard
