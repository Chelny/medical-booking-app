import { GraphQLError } from 'graphql'

export const CustomApiError = (status = 500, message = 'Internal Server Error', code = 'INTERNAL_SERVER_ERROR') => {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { ok: false, status },
    },
  })
}

export const CustomApiBadRequest = (message = 'Bad request', code = 'BAD_REQUEST') => {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { ok: false, status: 400 },
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

export const CustomApiErrorUnauthorized = () => {
  return new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
      http: { ok: false, status: 401 },
    },
  })
}

export const CustomApiErrorInactiveUser = () => {
  return new GraphQLError('Inactive user', {
    extensions: {
      code: 'INACTIVE_ACCOUNT',
      http: { ok: false, status: 403 },
    },
  })
}

export const CustomApiErrorNotFound = (message = 'Not found', code = 'NOT_FOUND') => {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { ok: false, status: 404 },
    },
  })
}

export const CustomApiErrorUserNotFound = () => {
  return new GraphQLError('User not found', {
    extensions: {
      code: 'USER_NOT_FOUND',
      http: { ok: false, status: 404 },
    },
  })
}

export const CustomApiErrorDuplicateEmail = () => {
  return new GraphQLError('Duplicate email', {
    extensions: {
      code: 'DUPLICATE_EMAIL',
      http: { ok: false, status: 409 },
    },
  })
}

export const CustomApiErrorDuplicateUsername = () => {
  return new GraphQLError('Duplicate username', {
    extensions: {
      code: 'DUPLICATE_USERNAME',
      http: { ok: false, status: 409 },
    },
  })
}

export const CustomApiErrorDuplicateMedicalId = () => {
  return new GraphQLError('Duplicate medical ID', {
    extensions: {
      code: 'DUPLICATE_MEDICAL_ID',
      http: { ok: false, status: 409 },
    },
  })
}
