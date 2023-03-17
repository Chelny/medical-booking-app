import { UserContact } from 'dtos/user-contact.response'

export interface IGetUsersResponse {
  results: UserContact[]
  count: number
}
