import { GraphQLError } from 'graphql'

export const CustomApiError = (
  status: number = 500,
  message: string = 'Internal Server Error',
  code: string = 'INTERNAL_SERVER_ERROR'
) => {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { ok: false, status },
    },
  })
}

export const CustomApiErrorUnauthorized = () => {
  return new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
      http: { ok: false, status: 401 },
    },
  })
}

export const CustomApiErrorInvalidToken = () => {
  return new GraphQLError('Invalid token', {
    extensions: {
      code: 'INVALID_TOKEN',
      http: { ok: false, status: 400 },
    },
  })
}

export const CustomApiErrorUserNotFound = () => {
  return new GraphQLError('User not found.', {
    extensions: {
      code: 'USER_NOT_FOUND',
      http: { ok: false, status: 404 },
    },
  })
}
