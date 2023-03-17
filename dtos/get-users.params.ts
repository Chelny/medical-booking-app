import { Prisma, User_gender } from '@prisma/client'
import { UserRoleValues } from 'enums/user-role.enum'

export interface GetUsersParams {
  offset: number
  limit: number
  query: string
  genders: User_gender[]
  roles: number[]
  languages: string[]
  orderBy: string
  sort: Prisma.SortOrder
}
