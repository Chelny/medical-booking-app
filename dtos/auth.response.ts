import { User } from '@prisma/client'

export interface IAuthResponse {
  token: string
  message?: string
  user?: Omit<User, 'password'>
}
