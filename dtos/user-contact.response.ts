import { Contact, Doctor, Patient, User } from '@prisma/client'

export interface IUserContact extends User {
  Contact: Contact | null
}

export interface IDoctorContact extends IUserContact {
  Doctor: Doctor | null
}

export interface IPatientContact extends IUserContact {
  Patient: Patient | null
}

export type UserContact = IDoctorContact | IPatientContact
