import { User, Appointment, Patient, Department, Doctor } from '@prisma/client'

export interface IDoctorPatientAppointement extends IDoctorAppointement {
  User: User
}

export interface IDoctorAppointement extends Appointment {
  Patient: Patient & IDoctorPatientAppointement
}

export interface IPatientDoctorAppointement extends PatientAppointement {
  User: User
  Department: Department
}

export interface PatientAppointement extends Appointment {
  Doctor: Doctor & IPatientDoctorAppointement
}
