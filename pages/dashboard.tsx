import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import { getHours, isEqual } from 'date-fns'
import { GraphQLError } from 'graphql'
import jwt_decode from 'jwt-decode'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Calendar from 'react-calendar'
import { toast } from 'react-toastify'
import { Button, UserAppointment } from 'components'
import { Common } from 'constantss'
import { UserRole } from 'enums'
import { useRequest, useWindowSize } from 'hooks'
import { IPatientAppointement } from 'interfaces'
import { getAuthCookie, Utilities } from 'utils'

type DashboardProps = {
  userToken: User
  user: User
  userErrors: GraphQLError[]
  appointments: IPatientAppointement[]
  appointmentsErrors: GraphQLError[]
}

type GetUserByIdGQLResponse = GQLResponse<{ getUserById: User }>
type GetAppointmentsByPatientIdGQLResponse = GQLResponse<{ getAppointmentsByPatientId: IPatientAppointement[] }>

const Dashboard: NextPage<DashboardProps> = (props: DashboardProps): JSX.Element => {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const [displayedAppointments, setDisplayedAppointments] = useState<IPatientAppointement[]>([])
  const [selectedDate, setSelectDate] = useState<Date>(new Date())
  const [timePeriod, setTimePeriod] = useState<string>('NIGHT')
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false)

  // const makeAppointment = () => {
  //   setIsAppointmentModalOpen(true)
  // }

  const handleSelectDate = (date: Date) => {
    setSelectDate(date)
    setDisplayedAppointments(
      props.appointments.filter((appointment: IPatientAppointement) =>
        isEqual(new Date(appointment.start_date).setHours(0, 0, 0, 0), date)
      )
    )
  }

  useEffect(() => {
    if (props.appointmentsErrors) {
      props.appointmentsErrors.map((error: GraphQLError) => {
        if (error.extensions) {
          toast.error<string>(t(`ERROR.${error.extensions.code}`, { ns: 'api' }))
        } else {
          console.error(error.message)
        }
      })
    }

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
  }, [props.appointmentsErrors, t])

  return (
    <>
      <h2>{t('WELCOME', { ns: 'dashboard', context: timePeriod, name: props.user.first_name })}</h2>

      {/* TODO: Complete */}
      {/* <div className="w-full mb-6 md:w-fit">
        <Button
          type="button"
          className="bg-light-mode-success dark:bg-dark-mode-success"
          onClick={() => makeAppointment()}
        >
          {t('BOOK_APPOINTMENT', { ns: 'dashboard' })}
        </Button>
      </div> */}

      <Calendar
        calendarType="US"
        locale={router.locale}
        minDate={Common.CALENDAR.MIN_DATE}
        maxDate={Common.CALENDAR.MAX_DATE}
        showDoubleView={width >= Common.BREAKPOINT.MD}
        className="lg:max-w-[768px]"
        tileClassName={({ date }) =>
          props.appointments.find((appointment: IPatientAppointement) =>
            isEqual(new Date(appointment.start_date).setHours(0, 0, 0, 0), date)
          )
            ? 'has-appointments'
            : null
        }
        onChange={() => handleSelectDate}
      />

      <section
        id="appointmentDetails"
        className="p-4 mt-6 bg-light-mode-foreground lg:max-w-[768px] dark:bg-dark-mode-foreground dark:text-white"
      >
        <h3>
          {t('APPOINTMENTS', {
            ns: 'dashboard',
            date: Utilities.dateFormat(selectedDate, router, 'PPPP'),
          })}
        </h3>

        {displayedAppointments.length > 0 ? (
          <ul>
            {displayedAppointments.map((appointment, i) => (
              <li
                key={i}
                className="py-4 border-b border-b-light-mode-border last:border-b-0 dark:border-b-dark-mode-border"
              >
                <>
                  <div>
                    {appointment.Doctor.User.first_name} {appointment.Doctor.User.last_name}
                    {' - '}
                    {t(`DOCTOR_DEPARTMENTS.${appointment.Doctor.DoctorDepartment.name}`)} <br />
                    {Utilities.dateFormat(appointment.start_date, router, 'p')}
                    {' - '}
                    {Utilities.dateFormat(appointment.end_date, router, 'p')} <br />
                  </div>
                  <div className="sm:flex sm:gap-1">
                    <Button className="bg-light-mode dark:bg-dark-mode">
                      {t('APPOINTMENT_DETAILS', { ns: 'dashboard' })}
                    </Button>
                    <Button className="bg-light-mode-tertiary dark:bg-dark-mode-tertiary">
                      {t('APPOINTMENT_UPDATE', { ns: 'dashboard' })}
                    </Button>
                  </div>
                </>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-light-mode-text-secondary dark:text-dark-mode-text-secondary">
            {t('NO_APPOINTMENTS', { ns: 'dashboard' })}
          </p>
        )}
      </section>

      {isAppointmentModalOpen && (
        <UserAppointment
          isModal
          user={props.user}
          selectedDate={selectedDate}
          isModalOpen={isAppointmentModalOpen}
          setIsModalOpen={setIsAppointmentModalOpen}
        />
      )}
    </>
  )
}

export const getServerSideProps = async (context: ServerSideContext) => {
  const token = getAuthCookie(context.req) || null
  let props = {}

  if (!token) return Common.SERVER_SIDE_PROPS.NO_TOKEN

  const decodedToken = token && jwt_decode(token)
  const { data: user, errors: getUserErrors } = await useRequest<GetUserByIdGQLResponse>(
    `query { getUserById(id: ${decodedToken?.user?.id}) { first_name, last_name, role_id } }`
  )

  props = {
    ...props,
    ...(await serverSideTranslations(context.locale, [
      ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
      'dashboard',
    ])),
    userToken: decodedToken?.user,
    user: user?.getUserById || ({} as User),
    userErrors: getUserErrors || null,
    appointments: [],
    appointmentsErrors: null,
  }

  if (user && user.getUserById.role_id !== UserRole.ADMIN) {
    const { data: appointments, errors: getAppointmentsErrors } =
      await useRequest<GetAppointmentsByPatientIdGQLResponse>(
        `query {
          getAppointmentsByPatientId(id: ${decodedToken?.user?.id}) {
            start_date,
            end_date,
            Doctor {
              image_name,
              User {
                first_name,
                last_name
              },
              DoctorDepartment {
                name
              }
            }
          }
        }`
      )

    props = {
      ...props,
      appointments: appointments?.getAppointmentsByPatientId || [],
      appointmentsErrors: getAppointmentsErrors || null,
    }
  }

  return { props }
}

export default Dashboard
