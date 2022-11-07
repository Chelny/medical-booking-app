import { Common } from 'constants/common'

export const useRequest = async <T>(query: string, token?: string): Promise<T> => {
  let headers = {}
  headers = { 'Content-type': 'application/json' }

  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return fetch(Common.API_PATH, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  }).then(async (res: Response) => {
    if (!res.ok) {
      const body = await res.json()
      throw body.errors[0]
    }
    return res.json()
  })
}
