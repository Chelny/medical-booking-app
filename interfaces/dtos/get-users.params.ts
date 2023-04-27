import { Prisma, User_gender } from '@prisma/client'

export interface IGetUsersParams {
  offset: number
  limit: number
  query: string
  genders: User_gender[]
  roles: number[]
  languages: string[]
  active: boolean | null
  order_by: string
  sort: Prisma.SortOrder
}
