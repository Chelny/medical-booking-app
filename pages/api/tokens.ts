import { User } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { pick } from 'lodash-es'

export const createTokens = {
  accessToken: (user: User): string =>
    sign({ user: pick(user, ['id', 'email', 'role_id']) }, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      subject: String(user.id),
      expiresIn: '24h',
    }),
  refreshToken: (user: User): string =>
    sign({ user: pick(user, ['id', 'email', 'role_id']) }, process.env.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      subject: String(user.id),
      expiresIn: '7d',
    }),
}
