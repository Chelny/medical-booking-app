import { Contact, Doctor, Patient, User } from '@prisma/client'

export interface UserContact extends User {
  Contact: Contact | null
}

export interface DoctorContact extends UserContact {
  Doctor: Doctor | null
}

export interface PatientContact extends UserContact {
  Patient: Patient | null
}
