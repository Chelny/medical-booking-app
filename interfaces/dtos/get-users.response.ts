import { UserContact } from 'interfaces/dtos/user-contact.response'

export interface IGetUsersResponse {
  results: UserContact[]
  count: number
}
