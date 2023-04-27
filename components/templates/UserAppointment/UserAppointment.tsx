import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure, Transition } from '@headlessui/react'
import { Appointment, User } from '@prisma/client'
import { add, addMinutes, isEqual, set } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import { ConditionalWrap, FormElement, Modal, ModalSize } from 'components'
import { Common, Regex } from 'constantss'
import { DoctorDepartmentsMap, DoctorDepartment } from 'enums'
import { useRequest } from 'hooks'
import { Utilities } from 'utils'
// import styles from 'styles/modules/UserAppointment.module.css'

type AppointmentProps = {
  isModal: boolean
  user: User
  appointment?: Appointment
  selectedDate: Date
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  isFormSubmitted?: (isSubmitted: boolean) => void
}

type CreateAppointmentGQLResponse = GQLResponse<{ createAppointment: { message: string } }>
type UpdateAppointmentGQLResponse = GQLResponse<{ updateAppointment: { message: string } }>
type DeleteAppointmentGQLResponse = GQLResponse<{ deleteAppointment: { message: string } }>

export const UserAppointment = (props: AppointmentProps): JSX.Element => {
  const { t } = useTranslation()
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0)

  // const { values, errors, handleChange, handleSubmit } = useForm({
  //   initialValues: {
  //     patientId: '',
  //     doctorId: '',
  //     startDate: '',
  //     endDate: '',
  //   },
  //   onValidate: (v) => {
  //     const e: IStringMap = {}

  //     // if (!isEmpty(e)) {
  //     //   const fields = Object.keys(omit(e, 'termsAndConditions')).map((field) =>
  //     //     t(`FORM.LABEL.${snakeCase(field).toUpperCase()}`)
  //     //   )
  //     //   toast.error<string>(t('FORM.ERROR.INVALID_FIELDS_MESSAGE', { fields: fields.join(', ') }))
  //     // }

  //     return e
  //   },
  //   onSubmit: async () => {
  //     // let payload = ''

  //     // payload += `first_name: "${values.firstName}", last_name: "${values.lastName}", gender: "${
  //     //   values.gender
  //     // }", birth_date: "${values.birthDate}", email: "${values.email}", username: ${
  //     //   values.username ? `"${values.username}"` : null
  //     // }, language: ${values.language ? `"${values.language}"` : `"${'EN'}"`}, address_line_1: "${
  //     //   values.addressLine1
  //     // }", address_line_2: ${values.addressLine2 ? `"${values.addressLine2}"` : null}, city: "${values.city}", region: "${
  //     //   values.region
  //     // }", country: "${values.country}", postal_code: "${values.postalCode}", phone_number: "${
  //     //   values.phoneNumber
  //     // }", phone_number_ext: ${values.phoneNumberExt ? `"${values.phoneNumberExt}"` : null}`

  //     let data, errors

  //     // if (user?.id) {
  //     //   // eslint-disable-next-line @typescript-eslint/no-extra-semi
  //     //   ;({ data, errors } = await useRequest<UpdateAdminGQLResponse>(
  //     //     `mutation { updateAdmin(${payload}) { message } }`
  //     //   ))
  //     //   if (data) toast.success<string>(t(`SUCCESS.${data.updateAdmin.message}`, { ns: 'api' }))
  //     // } else {
  //     //   // eslint-disable-next-line @typescript-eslint/no-extra-semi
  //     //   ;({ data, errors } = await useRequest<CreateAdminGQLResponse>(
  //     //     `mutation { createAdmin(${payload}) { message } }`
  //     //   ))
  //     //   if (data) toast.success<string>(t(`SUCCESS.${data.createAdmin.message}`, { ns: 'api' }))
  //     // }

  //     if (data) {
  //       setIsModalOpen(false)
  //       // isFormSubmitted(true)
  //     }

  //     // if (errors) {
  //     //   errors.map((error: GraphQLError) => {
  //     //     if (error.extensions) {
  //     //       toast.error<string>(t(`ERROR.${error.extensions.code}`, { ns: 'api' }))
  //     //     } else {
  //     //       console.error(error.message)
  //     //     }
  //     //   })
  //     // }
  //   },
  // })

  // TODO: Get appointments
  // const getAppointmentsByPatientId = async () => {
  //   const { data, errors } = await useRequest<any>(
  //     `query {
  //       getAppointmentsByPatientId(id: ${1}) {
  //         first_name
  //         last_name
  //       }
  //     }`
  //   )
  // }

  const handleDepartmentChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value
    setSelectedDepartmentId(value)
    // console.log(value, selectedDepartmentId)
    const { data, errors } = await useRequest<any>(
      `query {
        getDoctorDepartmentById(id: ${value}) {
          name
          duration
        }
      }`
    )
    // console.log(data, errors)

    const firstHour = set(props.selectedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })
    const lastHour = set(props.selectedDate, { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })
    const appointmentTime = [firstHour]
    // let currentAppointmentTime = firstHour
    // const lastAppointmentTime = appointmentTime[appointmentTime.length - 1]

    // while (!isEqual(appointmentTime[appointmentTime.length - 1], lastHour)) {
    //   // const nextAppointmentTime = addMinutes(currentAppointmentTime, data.getDoctorDepartmentById.duration)
    //   console.log(
    //     currentAppointmentTime,
    //     appointmentTime[appointmentTime.length - 1],
    //     !isEqual(currentAppointmentTime, lastHour)
    //   )
    //   // if (!isEqual(nextAppointmentTime, lastHour)) {
    //   appointmentTime.push(addMinutes(currentAppointmentTime, data.getDoctorDepartmentById.duration))
    //   currentAppointmentTime = appointmentTime[appointmentTime.length - 1]
    //   // }
    // }
    // console.log(selectedDate, firstHour, lastHour, appointmentTime)
  }

  useEffect(() => {
    props.setIsModalOpen(props.isModalOpen)
  }, [props.isModalOpen])

  return (
    <></>
    // <ConditionalWrap
    //   condition={props.isModal}
    //   wrap={(wrappedChildren) => (
    //     <Modal
    //       modalSize={ModalSize.MD}
    //       title={t(`APPOINTMENT_MODAL.${props.user?.id ? 'EDIT' : 'CREATE'}_TITLE`, { ns: 'admin' })}
    //       isOpen={props.isModalOpen}
    //       confirmButton={{ text: t('BUTTON.SAVE') }}
    //       setIsOpen={props.setIsModalOpen}
    //       handleSubmit={() => console.log('TODO:')}
    //     >
    //       {wrappedChildren}
    //     </Modal>
    //   )}
    // >
    //   <>
    //     <Disclosure>
    //       {({ open }) => (
    //         <>
    //           <Disclosure.Button className="bg-highlight">
    //             Do you offer technical support?
    //             <FontAwesomeIcon icon="chevron-up" className={open ? 'rotate-180 transform' : ''} />
    //           </Disclosure.Button>

    //           <Transition
    //             enter="transition duration-100 ease-out"
    //             enterFrom="transform scale-95 opacity-0"
    //             enterTo="transform scale-100 opacity-100"
    //             leave="transition duration-75 ease-out"
    //             leaveFrom="transform scale-100 opacity-100"
    //             leaveTo="transform scale-95 opacity-0"
    //           >
    //             <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">No</Disclosure.Panel>
    //           </Transition>
    //         </>
    //       )}
    //     </Disclosure>
    //     <br />
    //     <br />
    //     <br />
    //     - Change Date <br />
    //     {/* <FormElement fieldName="startDate" error={errors.startDate}>
    //       <input
    //         data-testid="form-input-birth-date"
    //         type="date"
    //         id="startDate"
    //         min={Common.BIRTH_DATE.MIN}
    //         max={Common.BIRTH_DATE.MAX}
    //         value={values.startDate}
    //         aria-required={true}
    //         aria-invalid={!!errors.startDate}
    //         aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_startDate`}
    //         onChange={handleChange}
    //       />
    //     </FormElement> */}
    //     - Select Department <br />
    //     {/* <FormElement fieldName="departmentId" error={errors.departmentId}> */}
    //     {/* <select
    //       data-testid="form-input-department-id"
    //       id="departmentId"
    //       value={selectedDepartmentId}
    //       aria-required={true}
    //       // aria-invalid={!!errors.departmentId}
    //       // aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_departmentId`}
    //       onChange={(event: ChangeEvent<HTMLSelectElement>) => handleDepartmentChange(event)}
    //     >
    //       <option label={t('FORM.PLACEHOLDER.SELECT')} />
    //       {DoctorDepartmentsMap.map((id: number) => (
    //         <option key={id} value={id}>
    //           {t(`DOCTOR_DEPARTMENTS.${DoctorDepartment[id]}`)}
    //         </option>
    //       ))}
    //     </select> */}
    //     {/* </FormElement> */}
    //     - Select Date & Time <br />
    //     - Select Doctor <br />
    //     - Confirm Appointment <br />
    //   </>
    // </ConditionalWrap>
  )
}
