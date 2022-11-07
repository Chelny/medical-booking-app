import { Contact, Doctor, Patient, User } from '@prisma/client'
import { createSchema, createYoga } from 'graphql-yoga'
import { omit } from 'lodash-es'
import { compare, hash } from 'bcrypt'
import { prisma } from 'pages/api/db'
import { createTokens } from 'pages/api/tokens'
import { Helpers } from 'pages/api/helpers'
import { EmailService } from 'pages/api/email.service'
import {
  CustomApiError,
  CustomApiErrorInvalidToken,
  CustomApiErrorUnauthorized,
  CustomApiErrorUserNotFound,
} from 'pages/api/errors'
import { getAuthCookie, removeAuthCookie, setAuthCookie } from 'utils/auth-cookies'
import { AuthResponse } from 'dtos/auth.response'
import { SuccessResponse } from 'dtos/success.response'
import { UserContact, PatientContact } from 'dtos/user-contact.response'

const typeDefs = /* GraphQL */ `
  scalar Timestamp

  type Query {
    users: [User!]!
    login(email: String, username: String, password: String): AuthResponse!
    logout: SuccessResponse!
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
    forgotPassword(email: String): SuccessResponse!
    resetPassword(password: String, token: String): SuccessResponse!
    getUserById(id: Int): User!
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
    updateUserPassword(email: String, password: String, newPassword: String): SuccessResponse!
    deleteUser(id: Int): SuccessResponse!
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
  }

  type Patient {
    id: ID!
    user_id: Int!
    medical_id: String!
    height: String
    weight: String
    created_at: Timestamp!
    updated_at: Timestamp
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
    users: async (parent: unknown, args: User, context: IContext): Promise<UserContact[]> => {
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
      return await prisma.user.findMany({ include: { Contact: true } })
    },
    getUserById: async (parent: unknown, args: User, context: IContext): Promise<Omit<User, 'password'>> => {
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({ where: { id: args.id } })
      if (!user) throw CustomApiErrorUserNotFound()

      return omit(user, 'password')
    },
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
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()
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
        process.env.RECIPIENT_EMAIL!, // TODO: Production: Use "user.email"
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
    createPatient: async (
      parent: unknown,
      args: User & Contact & Patient,
      context: IContext
    ): Promise<AuthResponse> => {
      const findEmail = await prisma.user.findUnique({ where: { email: args.email } })
      if (findEmail) throw CustomApiError(409, 'Email already exists.', 'DUPLICATE_EMAIL')

      if (args.username) {
        const findUsername = await prisma.user.findUnique({ where: { username: args.username } })
        if (findUsername) throw CustomApiError(409, 'Username already exists.', 'DUPLICATE_USERNAME')
      }

      const findMedicalId = await prisma.patient.findUnique({ where: { medical_id: args.medical_id } })
      if (findMedicalId) {
        throw CustomApiError(409, 'The medical ID belongs to an existing user.', 'DUPLICATE_MEDICAL_ID')
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
          Patient: {
            create: {
              medical_id: args.medical_id,
              height: args.height,
              weight: args.weight,
            },
          },
        },
      })
      if (!user) throw CustomApiError(404, 'Bad request', 'GENERAL')

      const token = createTokens.accessToken(user)
      setAuthCookie(context.res, token)

      return { token, message: 'ACCOUNT_CREATED' }
    },
    updatePatient: async (
      parent: unknown,
      args: User & Contact & Patient,
      context: IContext
    ): Promise<PatientContact> => {
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({
        where: { id: args.id },
        include: { Contact: true, Patient: true },
      })
      if (!user) throw CustomApiErrorUserNotFound()

      // TODO:
      // const findEmail = await prisma.user.findUnique({ where: { NOT: { id: { equals: user.id } }, email: args.email } })
      // if (findEmail) throw CustomApiError(409, 'Email already exists.', 'DUPLICATE_EMAIL')

      // if (args.username) {
      //   const findUsername = await prisma.user.findUnique({ where: { username: args.username } })
      //   if (findUsername) throw CustomApiError(409, 'Username already exists.', 'DUPLICATE_USERNAME')
      // }

      // const findMedicalId = await prisma.patient.findUnique({ where: { medical_id: args.medical_id } })
      // if (findMedicalId) {
      //   throw CustomApiError(409, 'The medical ID belongs to an existing user.', 'DUPLICATE_MEDICAL_ID')
      // }

      const updatedUser = await prisma.user.update({
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

      return updatedUser
    },
    updateUserPassword: async (
      parent: unknown,
      args: User & { new_password: string },
      context: IContext
    ): Promise<SuccessResponse> => {
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      const user = await prisma.user.findUnique({ where: { email: args.email } })
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
      if (!getAuthCookie(context.req)) throw CustomApiErrorUnauthorized()

      await prisma.user.delete({
        where: { id: args.id },
        include: {
          Contact: true,
        },
      })

      return { message: 'USER_DELETED' }
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
    allowedHeaders: ['Authorization'],
  },
})
