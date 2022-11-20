import { User, Appointment, Patient, Department, Doctor } from '@prisma/client'

export interface DoctorPatientAppointement extends DoctorAppointement {
  User: User
}

export interface DoctorAppointement extends Appointment {
  Patient: Patient & DoctorPatientAppointement
}

export interface PatientDoctorAppointement extends PatientAppointement {
  User: User
  Department: Department
}

export interface PatientAppointement extends Appointment {
  Doctor: Doctor & PatientDoctorAppointement
}
