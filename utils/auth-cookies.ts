import { serialize, parse } from 'cookie'
import { Request, Response } from 'express'

const TOKEN_NAME = 'medicalBookingAppToken'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export const getAuthCookie = (req: Request) => {
  // For API Routes, we don't need to parse the cookies
  if (req.cookies) return req.cookies[TOKEN_NAME]

  // For pages, we do need to parse the cookies
  const cookies = parse(req.headers.cookie || '')
  return cookies[TOKEN_NAME]
}

export const setAuthCookie = (res: Response, token: string) => {
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    maxAge: MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  res.setHeader('Set-Cookie', cookie)
}

export const removeAuthCookie = (res: Response) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}
