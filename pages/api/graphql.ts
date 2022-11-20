import { Appointment, Contact, Doctor, Patient, User } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { createSchema, createYoga } from 'graphql-yoga'
import { omit } from 'lodash-es'
import { AuthResponse } from 'dtos/auth.response'
import { SuccessResponse } from 'dtos/success.response'
import { DoctorContact, PatientContact, UserContact } from 'dtos/user-contact.response'
import { prisma } from 'pages/api/db'
import { EmailService } from 'pages/api/email.service'
import {
  CustomApiBadRequest,
  CustomApiError,
  CustomApiErrorDuplicateEmail,
  CustomApiErrorDuplicateMedicalId,
  CustomApiErrorDuplicateUsername,
  CustomApiErrorInvalidToken,
  CustomApiErrorUnauthorized,
  CustomApiErrorUserNotFound,
} from 'pages/api/errors'
import { Helpers } from 'pages/api/helpers'
import { createTokens } from 'pages/api/tokens'
import { getAuthCookie, removeAuthCookie, setAuthCookie } from 'utils/auth-cookies'

const typeDefs = `
  scalar Timestamp

  type Query {
    login(email: String, username: String, password: String): AuthResponse!
    logout: SuccessResponse!
    forgotPassword(email: String): SuccessResponse!
    resetPassword(password: String, token: String): SuccessResponse!
    getUsers: [User!]!
    getUserById(id: Int): User!
    updateUserPassword(email: String, password: String, newPassword: String): SuccessResponse!
    deleteUser(id: Int): SuccessResponse!
    createDoctor(
      first_name: String
      last_name: String
      gender: String
      birth_date: String
      email: String
      username: String
      password: String
      role_id: Int
      language: String
      address: String
      address_line2: String
      city: String
      region: String
      country: String
      postal_code: String
      phone_number: String
      phone_ext: String
      department_id: Int
      image_name: String
      start_date: Timestamp
      end_date: Timestamp
    ): SuccessResponse!
    updateDoctor(
      id: Int
      first_name: String
      last_name: String
      gender: String
      birth_date: String
      email: String
      username: String
      password: String
      language: String
      address: String
      address_line2: String
      city: String
      region: String
      country: String
      postal_code: String
      phone_number: String
      phone_ext: String
      department_id: Int
      image_name: String
      start_date: Timestamp
      end_date: Timestamp
    ): User!
    getAppointmentsByDoctorId(id: Int): [Appointment]
    createPatient(
      first_name: String
      last_name: String
      gender: String
      birth_date: String
      email: String
      username: String
      password: String
      role_id: Int
      language: String
      address: String
      address_line2: String
      city: String
      region: String
      country: String
      postal_code: String
      phone_number: String
      phone_ext: String
      medical_id: String
      height: String
      weight: String
    ): AuthResponse!
    updatePatient(
      id: Int
      first_name: String
      last_name: String
      gender: String
      birth_date: String
      email: String
      username: String
      password: String
      language: String
      address: String
      address_line2: String
      city: String
      region: String
      country: String
      postal_code: String
      phone_number: String
      phone_ext: String
      medical_id: String
      height: String
      weight: String
    ): User!
    getAppointmentsByPatientId(id: Int): [Appointment]
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    gender: String!
    birth_date: Timestamp!
    email: String
    username: String
    password: String
    role_id: Int!
    language: String
    created_at: Timestamp!
    updated_at: Timestamp
    Contact: Contact!
    Doctor: Doctor
    Patient: Patient
  }

  type Contact {
    id: ID!
    user_id: Int!
    address: String!
    address_line2: String
    city: String!
    region: String!
    country: String!
    postal_code: String!
    phone_number: String!
    phone_ext: String
    created_at: Timestamp!
    updated_at: Timestamp
  }

  type Doctor {
    id: ID!
    user_id: Int!
    department_id: Int!
    image_name: String
    start_date: Timestamp!
    end_date: Timestamp
    created_at: Timestamp!
    updated_at: Timestamp
    User: User
    Department: Department
  }

  type Department {
    id: ID!
    title: String!
    appointment_time: Int!
    created_at: Timestamp!
    updated_at: Timestamp
  }

  type Patient {
    id: ID!
    user_id: Int!
    medical_id: String!
    height: String
    weight: String
    created_at: Timestamp!
    updated_at: Timestamp
    User: User
  }

  type Appointment {
    id: ID!
    patient_id: Int!
    doctor_id: Int!
    reason: String
    start_date: Timestamp!
    end_date: Timestamp!
    notes: String
    created_at: Timestamp!
    updated_at: Timestamp
    Doctor: Doctor
    Patient: Patient
  }

  type AuthResponse {
    token: String!
    message: String
  }

  type SuccessResponse {
    message: String!
  }
`

const resolvers = {
  Query: {
    login: async (parent: unknown, args: User, context: IContext): Promise<AuthResponse> => {
      // Check if the user exists
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: args.email }, { username: args.username }] },
        include: { Contact: true },
      })
      if (!user) throw CustomApiError(400, 'Incorrect credentials', 'INCORRECT_CREDENTIALS')

      // Check if the password matches the hashed one we already have
      const isPasswordValid = await compare(args.password, user.password)
      if (!isPasswordValid) throw CustomApiError(400, 'Incorrect credentials', 'INCORRECT_CREDENTIALS')

      // Sign in the user
      const token = createTokens.accessToken(user)
      setAuthCookie(context.res, token)

      return { token }
    },
    logout: async (parent: unknown, args: User, context: IContext): Promise<SuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      removeAuthCookie(context.res)
      return { message: '' }
    },
    forgotPassword: async (parent: unknown, args: User, context: IContext): Promise<SuccessResponse> => {
      const user = await prisma.user.findFirst({ where: { email: args.email } })
      if (!user) throw CustomApiErrorUserNotFound()

      const token = Helpers.generateResetToken(user)
      const link = `${process.env.APP_URL}/reset-password?token=${token}`

      // FIXME: Find better way to get translated texts
      const emailMessage = (firstName?: string, link?: string): any => {
        return {
          en: {
            RESET_PASSWORD: {
              EMAIL: {
                SUBJECT: 'Reset Password',
                BODY: `Hi ${firstName},<br/><br/>You have requested to reset your password. Please <a href="${link}">click here</a> or copy/paste the following link in your browser: ${link} to reset.<br/><br/>If you didn\'t request to change your password, please ignore this email.`,
              },
            },
          },
          fr: {
            RESET_PASSWORD: {
              EMAIL: {
                SUBJECT: 'Réinitialisation de votre mot de passe',
                BODY: `Bonjour ${firstName},<br/><br/>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez <a href="${link}">cliquez ici</a> ou copier/coller le lien suivant dans votre navigateur : ${link} pour réinitialiser.<br/><br/>Si vous n\'avez pas demandé à changer votre mot de passe, veuillez ignorer ce courriel.`,
              },
            },
          },
        }
      }

      const emailService = new EmailService(
        process.env.NODE_ENV === 'production' ? user.email : process.env.RECIPIENT_EMAIL!,
        emailMessage()[user.language!].RESET_PASSWORD.EMAIL.SUBJECT,
        emailMessage(user.first_name, link)[user.language!].RESET_PASSWORD.EMAIL.BODY
      )
      emailService.sendMail()

      return { message: 'RESET_PASSWORD_LINK_SEND' }
    },
    resetPassword: async (
      parent: unknown,
      args: User & { token: string },
      context: IContext
    ): Promise<SuccessResponse> => {
      // Decrypt token
      const decryptedToken = Helpers.decryptToken(args.token)
      if (!decryptedToken) throw CustomApiErrorInvalidToken()

      // Extract userId from decrypted token - will use it for validate token also
      const userId = Helpers.getUserIdFromToken(decryptedToken)
      if (!userId) throw CustomApiErrorInvalidToken()

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw CustomApiErrorInvalidToken()

      // Validate Token - expiration and unicity
      const isTokenValid = await Helpers.validateResetToken(user, decryptedToken)
      if (!isTokenValid) {
        throw CustomApiError(401, 'The password reset link has expired.', 'RESET_PASSWORD_TOKEN_EXPIRED')
      }

      await prisma.user.update({ where: { id: userId }, data: { password: await hash(args.password, 12) } })

      return { message: 'PASSWORD_RESET' }
    },
    getUsers: async (parent: unknown, args: User, context: IContext): Promise<UserContact[]> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.user.findMany({ include: { Contact: true } })
    },
    getUserById: async (parent: unknown, args: User, context: IContext): Promise<Omit<User, 'password'>> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({ where: { id: args.id } })
      if (!user) throw CustomApiErrorUserNotFound()

      return omit(user, 'password')
    },
    updateUserPassword: async (
      parent: unknown,
      args: User & { new_password: string },
      context: IContext
    ): Promise<SuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({ where: { id: args.id } })
      if (!user) throw CustomApiErrorUserNotFound()

      if (!(await compare(args.password, user.password))) {
        throw CustomApiError(400, 'Passwords do not match', 'PASSWORDS_DO_NOT_MATCH')
      }

      await prisma.user.update({
        where: { email: args.email },
        data: { password: await hash(args.new_password, 12) },
      })

      return { message: 'PASSWORD_UPDATED' }
    },
    deleteUser: async (parent: unknown, args: User, context: IContext): Promise<SuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      await prisma.user.delete({
        where: { id: args.id },
        include: {
          Contact: true,
        },
      })

      return { message: 'USER_DELETED' }
    },
    createDoctor: async (
      parent: unknown,
      args: User & Contact & Doctor,
      context: IContext
    ): Promise<SuccessResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const user = await prisma.user.create({
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          gender: args.gender,
          birth_date: args.birth_date,
          email: args.email,
          username: args.username,
          password: await hash(args.password, 12),
          role_id: args.role_id,
          language: args.language,
          Contact: {
            create: {
              address: args.address,
              address_line2: args.address_line2,
              city: args.city,
              region: args.region,
              country: args.country,
              postal_code: args.postal_code,
              phone_number: args.phone_number,
              phone_ext: args.phone_ext,
            },
          },
          Doctor: {
            create: {
              department_id: args.department_id,
              image_name: args.image_name,
              start_date: args.start_date,
              end_date: args.end_date,
            },
          },
        },
      })
      if (!user) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_CREATED' }
    },
    updateDoctor: async (parent: unknown, args: User & Contact & Doctor, context: IContext): Promise<DoctorContact> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true, Doctor: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // Find if the email exists from another user
      const findManyEmail = await prisma.user.findMany({
        where: { NOT: { id: user.id }, email: args.email },
      })
      if (findManyEmail?.length > 0) throw CustomApiErrorDuplicateEmail()

      // Find if the username exists from another user
      if (args.username) {
        const findManyUsername = await prisma.user.findMany({
          where: { NOT: { id: user.id }, username: args.username },
        })
        if (findManyUsername?.length > 0) throw CustomApiErrorDuplicateUsername()
      }

      const doctor = await prisma.user.update({
        where: { id: user.id },
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          gender: args.gender,
          birth_date: args.birth_date,
          email: args.email,
          username: args.username,
          language: args.language,
          Contact: {
            update: {
              address: args.address,
              address_line2: args.address_line2,
              city: args.city,
              region: args.region,
              country: args.country,
              postal_code: args.postal_code,
              phone_number: args.phone_number,
              phone_ext: args.phone_ext,
            },
          },
          Doctor: {
            update: {
              department_id: args.department_id,
              image_name: args.image_name,
              start_date: args.start_date,
              end_date: args.end_date,
            },
          },
        },
        include: {
          Contact: true,
          Doctor: true,
        },
      })

      return doctor
    },
    getAppointmentsByDoctorId: async (parent: unknown, args: User, context: IContext): Promise<Appointment[]> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.appointment.findMany({
        where: { doctor_id: args.id },
        include: { Patient: { include: { User: true } } },
      })
    },
    createPatient: async (
      parent: unknown,
      args: User & Contact & Patient,
      context: IContext
    ): Promise<AuthResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const findMedicalId = await prisma.patient.findUnique({ where: { medical_id: args.medical_id } })
      if (findMedicalId) throw CustomApiErrorDuplicateMedicalId()

      const user = await prisma.user.create({
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          gender: args.gender,
          birth_date: args.birth_date,
          email: args.email,
          username: args.username,
          password: await hash(args.password, 12),
          role_id: args.role_id,
          language: args.language,
          Contact: {
            create: {
              address: args.address,
              address_line2: args.address_line2,
              city: args.city,
              region: args.region,
              country: args.country,
              postal_code: args.postal_code,
              phone_number: args.phone_number,
              phone_ext: args.phone_ext,
            },
          },
          Patient: {
            create: {
              medical_id: args.medical_id,
              height: args.height,
              weight: args.weight,
            },
          },
        },
      })
      if (!user) throw CustomApiBadRequest()

      const token = createTokens.accessToken(user)
      setAuthCookie(context.res, token)

      return { token, message: 'ACCOUNT_CREATED' }
    },
    updatePatient: async (
      parent: unknown,
      args: User & Contact & Patient,
      context: IContext
    ): Promise<PatientContact> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true, Patient: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // Find if the email exists from another user
      const findManyEmail = await prisma.user.findMany({
        where: { NOT: { id: user.id }, email: args.email },
      })
      if (findManyEmail?.length > 0) throw CustomApiErrorDuplicateEmail()

      // Find if the username exists from another user
      if (args.username) {
        const findManyUsername = await prisma.user.findMany({
          where: { NOT: { id: user.id }, username: args.username },
        })
        if (findManyUsername?.length > 0) throw CustomApiErrorDuplicateUsername()
      }

      // Find if the medical ID exists from another user
      const findManyMedicalId = await prisma.patient.findMany({
        where: { NOT: { user_id: user.id }, medical_id: args.medical_id },
      })
      if (findManyMedicalId?.length > 0) throw CustomApiErrorDuplicateMedicalId()

      const patient = await prisma.user.update({
        where: { id: user.id },
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          gender: args.gender,
          birth_date: args.birth_date,
          email: args.email,
          username: args.username,
          language: args.language,
          Contact: {
            update: {
              address: args.address,
              address_line2: args.address_line2,
              city: args.city,
              region: args.region,
              country: args.country,
              postal_code: args.postal_code,
              phone_number: args.phone_number,
              phone_ext: args.phone_ext,
            },
          },
          Patient: {
            update: {
              medical_id: args.medical_id,
              height: args.height,
              weight: args.weight,
            },
          },
        },
        include: {
          Contact: true,
          Patient: true,
        },
      })

      return patient
    },
    getAppointmentsByPatientId: async (parent: unknown, args: User, context: IContext): Promise<Appointment[]> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.appointment.findMany({
        where: { patient_id: args.id },
        include: { Doctor: { include: { User: true, Department: true } } },
        orderBy: { start_date: 'asc' },
      })
    },
  },
}

const schema = createSchema({
  typeDefs,
  resolvers,
})

// Create a Yoga instance with a GraphQL schema.
export default createYoga<IContext>({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: process.env.API_PATH,
  cors: {
    origin: process.env.APP_URL,
    methods: ['POST'],
    credentials: true,
  },
})
