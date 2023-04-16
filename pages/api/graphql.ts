import { Appointment, Contact, Doctor, DoctorDepartment, DoctorSchedule, Patient, Prisma, User } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { createSchema, createYoga } from 'graphql-yoga'
import { omit } from 'lodash-es'
import { Common } from 'constants/common'
import { IAuthResponse } from 'dtos/auth.response'
import { IGetUsersParams } from 'dtos/get-users.params'
import { IGetUsersResponse } from 'dtos/get-users.response'
import { ISuccessResponse } from 'dtos/success.response'
import { UserRole } from 'enums/user-role.enum'
import { prisma } from 'pages/api/db'
import { EmailService } from 'pages/api/email.service'
import {
  CustomApiBadRequest,
  CustomApiError,
  CustomApiErrorDuplicateEmail,
  CustomApiErrorDuplicateMedicalId,
  CustomApiErrorDuplicateUsername,
  CustomApiErrorInactiveUser,
  CustomApiErrorInvalidToken,
  CustomApiErrorNotFound,
  CustomApiErrorUserNotFound,
} from 'pages/api/errors'
import { Helpers } from 'pages/api/helpers'
import { createTokens } from 'pages/api/tokens'
import { removeAuthCookie, setAuthCookie } from 'utils/auth-cookies'
import { TextFormatUtil } from 'utils/text-format'

type GQLGetParams<T> = { params: T }
type GQLGetByIdParams = { id: number }
type GQLPostInput<T> = { input: T }
type GQLPutInput<T> = { id: number; input: T }
type GQLDeleteInput = { id: number }

const typeDefs = `
  scalar Timestamp

  input CheckResetPasswordLinkValidityParams {
    token: String
  }

  input GetUsersParams {
    offset: Int
    limit: Int
    query: String
    genders: [String]
    roles: [Int]
    languages: [String]
    active: Boolean
    order_by: String
    sort: String
  }

  input GetAvailableDoctorsParams {
    department_id: Int
    start_date: Timestamp
  }

  input UserInput {
    first_name: String
    last_name: String
    gender: String
    birth_date: Timestamp
    email: String
    username: String
    password: String
    role_id: Int
    language: String
    active: Boolean
    address: String
    address_line2: String
    city: String
    region: String
    country: String
    postal_code: String
    phone_number: String
    phone_ext: String
  }

  input DoctorInput {
    first_name: String
    last_name: String
    gender: String
    birth_date: Timestamp
    email: String
    username: String
    password: String
    role_id: Int
    language: String
    active: Boolean
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
  }

  input PatientInput {
    first_name: String
    last_name: String
    gender: String
    birth_date: Timestamp
    email: String
    username: String
    password: String
    role_id: Int
    language: String
    active: Boolean
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
  }

  input DoctorScheduleInput {
    doctor_id: Int
    weekday: Int
  }

  input LoginInput {
    email: String
    username: String
    password: String
  }

  input ForgotPasswordInput {
    email: String
  }

  input ResetPasswordInput {
    password: String
    token: String
  }

  input UpdatePasswordInput {
    email: String
    password: String
    newPassword: String
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
    active: Boolean
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
    DoctorDepartment: DoctorDepartment
    DoctorSchedule: [DoctorSchedule]
  }

  type DoctorDepartment {
    id: ID!
    name: String!
    duration: Int!
    created_at: Timestamp!
    updated_at: Timestamp
  }

  type DoctorSchedule {
    id: ID!
    doctor_id: Int!
    weekday: Int!
    created_at: Timestamp!
    updated_at: Timestamp
    Doctor: Doctor
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
    start_date: Timestamp!
    end_date: Timestamp!
    created_at: Timestamp!
    updated_at: Timestamp
    Doctor: Doctor
    Patient: Patient
  }

  type AuthResponse {
    token: String!
    message: String
    user: User
  }

  type SuccessResponse {
    message: String!
  }

  type GetUsersResponse {
    results: [User!]!
    count: Int!
  }

  type Query {
    checkResetPasswordLinkValidity(params: CheckResetPasswordLinkValidityParams): SuccessResponse!

    getUsers(params: GetUsersParams): GetUsersResponse!
    getUserById(id: Int!): User!

    getDoctorsByDepartmentId(id: Int!): [Doctor]
    getAvailableDoctors(params: GetAvailableDoctorsParams): [Doctor]
    getDoctorDepartmentById(id: Int!): DoctorDepartment
    getDoctorScheduleByDoctorId(id: Int!): [DoctorSchedule]

    getAppointmentsByDoctorId(id: Int!): [Appointment]
    getAppointmentsByPatientId(id: Int!): [Appointment]
  }

  type Mutation {
    signUp(input: PatientInput): AuthResponse!
    login(input: LoginInput): AuthResponse!
    logout: SuccessResponse!
    forgotPassword(input: ForgotPasswordInput): SuccessResponse!
    resetPassword(input: ResetPasswordInput): SuccessResponse!

    updatePassword(id: Int!, input: UpdatePasswordInput): SuccessResponse!
    deactivateAccount(id: Int!): SuccessResponse!
    activateAccount(id: Int!): SuccessResponse!

    createAdmin(input: UserInput): SuccessResponse!
    updateAdmin(id: Int!, input: UserInput): SuccessResponse!

    createDoctor(input: DoctorInput): SuccessResponse!
    updateDoctor(id: Int!, input: DoctorInput): SuccessResponse!
    createDoctorSchedule(input: [DoctorScheduleInput]): SuccessResponse!
    updateDoctorSchedule(id: Int!, input: [DoctorScheduleInput]): SuccessResponse!
    deleteDoctorScheduleById(id: Int!): SuccessResponse!

    createPatient(input: PatientInput): SuccessResponse!
    updatePatient(id: Int!, input: PatientInput): SuccessResponse!
  }
`

const resolvers = {
  Query: {
    /******************************
     *  Unauthenticated
     ******************************/
    checkResetPasswordLinkValidity: async (
      parent: unknown,
      args: GQLGetParams<{ token: string }>
    ): Promise<ISuccessResponse> => {
      // Decrypt token
      const decryptedToken = Helpers.decryptToken(args.params.token)
      if (!decryptedToken) throw CustomApiErrorInvalidToken()

      // Extract userId from decrypted token - will use it for validate token also
      const userId = Helpers.getUserIdFromToken(decryptedToken)
      if (!userId) throw CustomApiErrorInvalidToken()

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw CustomApiErrorInvalidToken()

      // Validate Token - expiration and unicity
      const isTokenValid = await Helpers.validateResetToken(user, decryptedToken)
      if (!isTokenValid) {
        throw CustomApiError(
          401,
          'The password reset link appears to be invalid or has expired.',
          'RESET_PASSWORD_TOKEN_INVALID'
        )
      }

      return { message: '' }
    },

    /******************************
     *  User
     ******************************/
    getUsers: async (parent: unknown, args: GQLGetParams<IGetUsersParams>): Promise<IGetUsersResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      let whereClauseQuery = {}
      let whereClauseActive = {}
      let orderByClause = {}

      if (args.params?.query) {
        whereClauseQuery = {
          OR: [
            { first_name: { contains: args.params?.query } },
            { last_name: { contains: args.params?.query } },
            { email: { contains: args.params?.query } },
            { username: { contains: args.params?.query } },
          ],
        }
      }

      if (args.params?.active !== null) {
        whereClauseActive = {
          active: args.params?.active,
        }
      }

      if (args.params?.orderBy) {
        orderByClause = {
          order_by: {
            [args.params?.orderBy]: args.params?.sort ?? Prisma.SortOrder.asc,
          },
        }
      }

      const filters = {
        where: {
          ...whereClauseQuery,
          gender: { in: args.params?.genders },
          role_id: { in: args.params?.roles },
          language: { in: args.params?.languages },
          ...whereClauseActive,
        },
        ...orderByClause,
      }

      const getUsers = await prisma.$transaction([
        prisma.user.findMany({
          include: { Contact: true, Doctor: true, Patient: true },
          skip: args.params?.offset ?? 0,
          take: args.params?.limit ?? Common.PAGINATION.LIMIT,
          ...filters,
        }),
        prisma.user.count({ ...filters }),
      ])

      return { results: getUsers[0], count: getUsers[1] }
    },
    getUserById: async (parent: unknown, args: GQLGetByIdParams): Promise<Omit<User, 'password'>> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: {
          Contact: true,
          Doctor: true,
          Patient: true,
        },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      return omit(user, 'password')
    },

    /******************************
     *  Doctor
     ******************************/
    getDoctorsByDepartmentId: async (parent: unknown, args: GQLGetByIdParams): Promise<Doctor[]> => {
      const doctors = await prisma.doctor.findMany({
        where: { department_id: args.id },
        include: {
          User: true,
          DoctorDepartment: true,
          DoctorSchedule: true,
        },
      })
      if (!doctors) throw CustomApiErrorNotFound()

      return doctors
    },
    getAvailableDoctors: async (
      parent: unknown,
      args: GQLGetParams<{ department_id: number; start_date: Date }>
    ): Promise<Doctor[]> => {
      const doctors = await prisma.doctor.findMany({
        where: {
          department_id: args.params.department_id,
          DoctorSchedule: { some: { weekday: { equals: new Date(args.params.start_date).getDay() } } },
        },
        include: {
          User: true,
          DoctorDepartment: true,
          DoctorSchedule: true,
        },
      })

      if (!doctors) throw CustomApiErrorNotFound()

      return doctors
    },
    getDoctorDepartmentById: async (parent: unknown, args: GQLGetByIdParams): Promise<DoctorDepartment> => {
      const doctorDepartment = await prisma.doctorDepartment.findFirst({ where: { id: args.id } })
      if (!doctorDepartment) throw CustomApiErrorNotFound()

      return doctorDepartment
    },
    getDoctorScheduleByDoctorId: async (parent: unknown, args: GQLGetByIdParams): Promise<DoctorSchedule[]> => {
      return await prisma.doctorSchedule.findMany({
        where: { doctor_id: args.id },
      })
    },

    /******************************
     *  Appointment
     ******************************/
    getAppointmentsByDoctorId: async (parent: unknown, args: GQLGetByIdParams): Promise<Appointment[]> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.appointment.findMany({
        where: { doctor_id: args.id },
        include: { Patient: { include: { User: true } } },
      })
    },
    getAppointmentsByPatientId: async (parent: unknown, args: GQLGetByIdParams): Promise<Appointment[]> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.appointment.findMany({
        where: { patient_id: args.id },
        include: { Doctor: { include: { User: true, DoctorDepartment: true } } },
        orderBy: { start_date: Prisma.SortOrder.asc },
      })
    },
  },
  Mutation: {
    /******************************
     *  Unauthenticated
     ******************************/
    signUp: async (
      parent: unknown,
      args: GQLPostInput<User & Contact & Patient>,
      context: IContext
    ): Promise<IAuthResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.input.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.input.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.input.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const findMedicalId = await prisma.patient.findUnique({ where: { medical_id: args.input.medical_id } })
      if (findMedicalId) throw CustomApiErrorDuplicateMedicalId()

      const user = await prisma.user.create({
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          password: await hash(args.input.password, 12),
          role_id: args.input.role_id,
          language: args.input.language,
          Contact: {
            create: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
          Patient: {
            create: {
              medical_id: args.input.medical_id,
              height: args.input.height,
              weight: args.input.weight,
            },
          },
        },
      })
      if (!user) throw CustomApiBadRequest()

      const token = createTokens.accessToken(user)
      setAuthCookie(context.res, token)

      return { token, message: 'ACCOUNT_CREATED' }
    },
    login: async (parent: unknown, args: GQLPostInput<User>, context: IContext): Promise<IAuthResponse> => {
      const userCredsWhereClause = { OR: [{ email: args.input.email }, { username: args.input.username }] }

      // Check if the user exists
      const user = await prisma.user.findFirst({
        where: userCredsWhereClause,
        include: { Contact: true },
      })
      if (!user) throw CustomApiError(400, 'Incorrect credentials', 'INCORRECT_CREDENTIALS')

      // Check if the password matches the hashed one we already have
      const isPasswordValid = await compare(args.input.password, user.password)
      if (!isPasswordValid) throw CustomApiError(400, 'Incorrect credentials', 'INCORRECT_CREDENTIALS')

      // Check if the user is active
      const activeUser = await prisma.user.findFirst({ where: { ...userCredsWhereClause, active: true } })
      if (!activeUser) throw CustomApiErrorInactiveUser()

      // Sign in the user
      const token = createTokens.accessToken(user)
      setAuthCookie(context.res, token)

      return { token, user: omit(user, 'password') }
    },
    logout: async (parent: unknown, args: unknown, context: IContext): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      removeAuthCookie(context.res)
      return { message: '' }
    },
    forgotPassword: async (parent: unknown, args: GQLPostInput<User>): Promise<ISuccessResponse> => {
      const user = await prisma.user.findFirst({ where: { email: args.input.email } })
      if (!user) throw CustomApiErrorUserNotFound()

      // Check if the user is active
      const activeUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: args.input.email }, { username: args.input.username }],
          active: true,
        },
      })
      if (!activeUser) throw CustomApiErrorInactiveUser()

      const token = Helpers.generateResetToken(user)
      const link = `${process.env.APP_URL}/reset-password?token=${token}`

      // FIXME: Find better way to get translated texts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailMessage = (firstName?: string, link?: string): any => {
        return {
          EN: {
            RESET_PASSWORD: {
              EMAIL: {
                SUBJECT: 'Reset Password',
                BODY: `Hi ${firstName},<br/><br/>You have requested to reset your password. Please <a href="${link}">click here</a> or copy/paste the following link in your browser: ${link} to reset.<br/><br/>If you didn't request to change your password, please ignore this email.`,
              },
            },
          },
          FR: {
            RESET_PASSWORD: {
              EMAIL: {
                SUBJECT: 'Réinitialisation de votre mot de passe',
                BODY: `Bonjour ${firstName},<br/><br/>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez <a href="${link}">cliquez ici</a> ou copier/coller le lien suivant dans votre navigateur : ${link} pour réinitialiser.<br/><br/>Si vous n'avez pas demandé à changer votre mot de passe, veuillez ignorer ce courriel.`,
              },
            },
          },
        }
      }

      const emailService = new EmailService(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NODE_ENV === 'production' ? user.email : process.env.RECIPIENT_EMAIL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        emailMessage()[user.language!].RESET_PASSWORD.EMAIL.SUBJECT,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        emailMessage(user.first_name, link)[user.language!].RESET_PASSWORD.EMAIL.BODY
      )
      emailService.sendMail()

      return { message: 'RESET_PASSWORD_LINK_SEND' }
    },
    resetPassword: async (parent: unknown, args: GQLPostInput<User & { token: string }>): Promise<ISuccessResponse> => {
      // Decrypt token
      const decryptedToken = Helpers.decryptToken(args.input.token)
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

      await prisma.user.update({ where: { id: userId }, data: { password: await hash(args.input.password, 12) } })

      return { message: 'PASSWORD_RESET' }
    },

    /******************************
     *  User
     ******************************/
    updatePassword: async (
      parent: unknown,
      args: GQLPutInput<User & { new_password: string }>
    ): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({ where: { id: args.id } })
      if (!user) throw CustomApiErrorUserNotFound()

      if (!(await compare(args.input.password, user.password))) {
        throw CustomApiError(400, 'Passwords do not match', 'PASSWORDS_DO_NOT_MATCH')
      }

      await prisma.user.update({
        where: { email: args.input.email },
        data: { password: await hash(args.input.new_password, 12) },
      })

      return { message: 'PASSWORD_UPDATED' }
    },
    deactivateAccount: async (parent: unknown, args: GQLPutInput<unknown>): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      await prisma.user.update({
        where: { id: args.id },
        data: { active: false },
      })

      // TODO: Clean up - Use cron job to delete user from DB after X days of inactvity?
      // await prisma.user.delete({
      //   where: { id: args.id },
      //   include: {
      //     Contact: true,
      //     Doctor: true,
      //     Patient: true,
      //   },
      // })

      return { message: 'ACCOUNT_DEACTIVATED' }
    },
    activateAccount: async (parent: unknown, args: GQLPutInput<unknown>): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      await prisma.user.update({
        where: { id: args.id },
        data: { active: true },
      })

      return { message: 'ACCOUNT_ACTIVATED' }
    },

    /******************************
     *  Admin
     ******************************/
    createAdmin: async (parent: unknown, args: GQLPostInput<User & Contact>): Promise<ISuccessResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.input.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.input.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.input.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const user = await prisma.user.create({
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          password: await hash(args.input.password, 12),
          role_id: UserRole.ADMIN,
          language: args.input.language,
          Contact: {
            create: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
        },
      })

      if (!user) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_CREATED' }
    },
    updateAdmin: async (parent: unknown, args: GQLPutInput<User & Contact>): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // Find if the email exists from another user
      const findManyEmail = await prisma.user.findMany({
        where: { NOT: { id: user.id }, email: args.input.email },
      })
      if (findManyEmail?.length > 0) throw CustomApiErrorDuplicateEmail()

      // Find if the username exists from another user
      if (args.input.username) {
        const findManyUsername = await prisma.user.findMany({
          where: { NOT: { id: user.id }, username: args.input.username },
        })
        if (findManyUsername?.length > 0) throw CustomApiErrorDuplicateUsername()
      }

      const admin = await prisma.user.update({
        where: { id: user.id },
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          role_id: args.input.role_id,
          language: args.input.language,
          Contact: {
            update: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
        },
        include: {
          Contact: true,
        },
      })

      if (!admin) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_UPDATED' }
    },

    /******************************
     *  Doctor
     ******************************/
    createDoctor: async (parent: unknown, args: GQLPostInput<User & Contact & Doctor>): Promise<ISuccessResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.input.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.input.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.input.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const user = await prisma.user.create({
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          password: await hash(args.input.password, 12),
          role_id: UserRole.DOCTOR,
          language: args.input.language,
          Contact: {
            create: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
          Doctor: {
            create: {
              department_id: args.input.department_id,
              image_name: args.input.image_name,
              start_date: args.input.start_date,
              end_date: args.input.end_date,
            },
          },
        },
      })

      if (!user) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_CREATED' }
    },
    updateDoctor: async (parent: unknown, args: GQLPutInput<User & Contact & Doctor>): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true, Doctor: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // Find if the email exists from another user
      const findManyEmail = await prisma.user.findMany({
        where: { NOT: { id: user.id }, email: args.input.email },
      })
      if (findManyEmail?.length > 0) throw CustomApiErrorDuplicateEmail()

      // Find if the username exists from another user
      if (args.input.username) {
        const findManyUsername = await prisma.user.findMany({
          where: { NOT: { id: user.id }, username: args.input.username },
        })
        if (findManyUsername?.length > 0) throw CustomApiErrorDuplicateUsername()
      }

      const doctor = await prisma.user.update({
        where: { id: user.id },
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          role_id: args.input.role_id,
          language: args.input.language,
          Contact: {
            update: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
          Doctor: {
            update: {
              department_id: args.input.department_id,
              image_name: args.input.image_name,
              start_date: TextFormatUtil.utcToZonedTime(args.input.start_date),
              end_date: TextFormatUtil.utcToZonedTime(args.input.end_date),
            },
          },
        },
        include: {
          Contact: true,
          Doctor: true,
        },
      })

      if (!doctor) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_UPDATED' }
    },
    createDoctorSchedule: async (parent: unknown, args: GQLPostInput<DoctorSchedule[]>): Promise<ISuccessResponse> => {
      const doctorSchedule = await prisma.$transaction(
        args.input.map((schedule: DoctorSchedule) =>
          prisma.doctorSchedule.create({
            data: {
              doctor_id: schedule.doctor_id,
              weekday: schedule.weekday,
            },
          })
        )
      )

      if (!doctorSchedule) throw CustomApiBadRequest()

      return { message: 'DOCTOR_SCHEDULE_CREATED' }
    },
    updateDoctorSchedule: async (parent: unknown, args: GQLPutInput<DoctorSchedule[]>): Promise<ISuccessResponse> => {
      const doctorSchedule = await prisma.$transaction(
        args.input.map((schedule) =>
          prisma.doctorSchedule.update({
            where: { id: args.id },
            data: {
              doctor_id: schedule.doctor_id,
              weekday: schedule.weekday,
            },
          })
        )
      )

      if (!doctorSchedule) throw CustomApiBadRequest()

      return { message: 'DOCTOR_SCHEDULE_UPDATED' }
    },
    deleteDoctorScheduleById: async (parent: unknown, args: GQLDeleteInput): Promise<ISuccessResponse> => {
      await prisma.doctorSchedule.delete({
        where: { id: args.id },
      })

      return { message: 'DOCTOR_SCHEDULE_DELETED' }
    },

    /******************************
     *  Patient
     ******************************/
    createPatient: async (parent: unknown, args: GQLPostInput<User & Contact & Patient>): Promise<ISuccessResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.input.email } })
      if (findEmail) throw CustomApiErrorDuplicateEmail()

      if (args.input.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.input.username } })
        if (findUsername) throw CustomApiErrorDuplicateUsername()
      }

      const findMedicalId = await prisma.patient.findUnique({ where: { medical_id: args.input.medical_id } })
      if (findMedicalId) throw CustomApiErrorDuplicateMedicalId()

      const user = await prisma.user.create({
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          password: await hash(args.input.password, 12),
          role_id: args.input.role_id,
          language: args.input.language,
          Contact: {
            create: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
          Patient: {
            create: {
              medical_id: args.input.medical_id,
              height: args.input.height,
              weight: args.input.weight,
            },
          },
        },
      })

      if (!user) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_CREATED' }
    },
    updatePatient: async (parent: unknown, args: GQLPutInput<User & Contact & Patient>): Promise<ISuccessResponse> => {
      // FIXME: if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true, Patient: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // Find if the email exists from another user
      const findManyEmail = await prisma.user.findMany({
        where: { NOT: { id: user.id }, email: args.input.email },
      })
      if (findManyEmail?.length > 0) throw CustomApiErrorDuplicateEmail()

      // Find if the username exists from another user
      if (args.input.username) {
        const findManyUsername = await prisma.user.findMany({
          where: { NOT: { id: user.id }, username: args.input.username },
        })
        if (findManyUsername?.length > 0) throw CustomApiErrorDuplicateUsername()
      }

      // Find if the medical ID exists from another user
      const findManyMedicalId = await prisma.patient.findMany({
        where: { NOT: { user_id: user.id }, medical_id: args.input.medical_id },
      })
      if (findManyMedicalId?.length > 0) throw CustomApiErrorDuplicateMedicalId()

      const patient = await prisma.user.update({
        where: { id: user.id },
        data: {
          first_name: args.input.first_name,
          last_name: args.input.last_name,
          gender: args.input.gender,
          birth_date: TextFormatUtil.utcToZonedTime(args.input.birth_date),
          email: args.input.email,
          username: args.input.username,
          language: args.input.language,
          Contact: {
            update: {
              address: args.input.address,
              address_line2: args.input.address_line2,
              city: args.input.city,
              region: args.input.region,
              country: args.input.country,
              postal_code: args.input.postal_code,
              phone_number: args.input.phone_number,
              phone_ext: args.input.phone_ext,
            },
          },
          Patient: {
            update: {
              medical_id: args.input.medical_id,
              height: args.input.height,
              weight: args.input.weight,
            },
          },
        },
        include: {
          Contact: true,
          Patient: true,
        },
      })

      if (!patient) throw CustomApiBadRequest()

      return { message: 'ACCOUNT_UPDATED' }
    },

    /******************************
     *  Appointment
     ******************************/
    // createAppointment: async (parent: unknown, args: GQLPostInput<Appointment>): Promise<ISuccessResponse> => {},
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
