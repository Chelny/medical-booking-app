import { Common } from 'constantss'

export const useRequest = async <T>(query: string): Promise<T> => {
  const res = await fetch(Common.API_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  return res.json()
}
