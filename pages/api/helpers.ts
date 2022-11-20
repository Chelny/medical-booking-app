import * as crypto from 'crypto'
import { User } from '@prisma/client'
import { differenceInHours } from 'date-fns'

export const Helpers = {
  generatePassword: (): string => {
    let password = ''
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%?&*'
    for (let i = 0; i < 8; i++) {
      const c = Math.floor(Math.random() * chars.length + 1)
      password += chars.charAt(c)
    }
    return password
  },

  //******************************//
  // GENERATE RESET TOKEN
  //******************************//
  // Source: https://medium.com/swlh/generate-forgot-password-token-with-expiration-in-typescript-without-hitting-database-39e12225581c
  generateResetToken: (user: User): string => {
    // Date now - will use it for expiration
    const now = new Date()

    // Convert to Base64
    const timeBase64 = Buffer.from(now.toISOString()).toString('base64')

    // Convert to Base64 user Id - will use for retrieve user
    const userIdBase64 = Buffer.from(String(user.id)).toString('base64')

    // User info string - will use it for sign and use token once
    const userString = `${user.id}${user.email}${user.password}${user.updated_at}`
    const userStringHash = crypto.createHash('md5').update(userString).digest('hex')

    // Generate a formatted string [time]-[userSign]-[userId]
    const tokenize = `${timeBase64}-${userStringHash}-${userIdBase64}`

    // Encrypt token
    return Helpers.encryptToken(tokenize)
  },
  // Encrypt token with password using crypto.Cipheriv
  encryptToken: (stringToEncrypt: string): string => {
    const key = crypto.createHash('sha256').update('popcorn').digest()

    const IV_LENGTH = 16
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    const encrypted = cipher.update(stringToEncrypt)

    const result = Buffer.concat([encrypted, cipher.final()])

    // Formatted string [iv]:[token]
    return iv.toString('hex') + ':' + result.toString('hex')
  },
  decryptToken: (stringToDecrypt: string): string | null => {
    try {
      const key = crypto.createHash('sha256').update('popcorn').digest()

      let textParts = stringToDecrypt.split(':')
      let iv = Buffer.from(String(textParts.shift()), 'hex')
      let encryptedText = Buffer.from(textParts.join(':'), 'hex')
      let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
      let decrypted = decipher.update(encryptedText)

      const result = Buffer.concat([decrypted, decipher.final()])

      return result.toString()
    } catch (error) {
      console.error('decryptToken', error)
      return null
    }
  },
  // Extract userId from decrypted token string
  getUserIdFromToken: (token: string): number | null => {
    try {
      const userIdHash = token.split('-')[2]
      return +Buffer.from(userIdHash, 'base64').toString('ascii')
    } catch (error) {
      console.error('getUserIdFromToken', error)
      return null
    }
  },
  // Validate the token
  validateResetToken: (user: User, token: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Split token string and retrieve timeInfo and userInfoHash
      const [timeHBase64, reqUserStringHash] = token.split('-')

      const timestamp = Buffer.from(timeHBase64, 'base64').toString('ascii')

      // Using differenceInHours method for retrieve dates difference in hours
      const tokenTimestampDate = new Date(timestamp)
      const now = new Date()

      // Fail if more then 24 hours
      const diff = differenceInHours(now, tokenTimestampDate)
      if (Math.abs(diff) > 24) resolve(false)

      const userString = `${user.id}${user.email}${user.password}${user.updated_at}`
      const userStringHash = crypto.createHash('md5').update(userString).digest('hex')

      // Check if userInfoHash is the same - this guarantee the token used once
      resolve(reqUserStringHash === userStringHash)
    })
  },
}
