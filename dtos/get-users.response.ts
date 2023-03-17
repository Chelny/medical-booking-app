import { UserContact } from 'dtos/user-contact.response'

export interface GetUsersResponse {
  results: UserContact[]
  count: number
}
