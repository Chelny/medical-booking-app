import { format, subYears } from 'date-fns'

export const Common = {
  APP_NAME: 'Medical Booking App',
  API_URL: 'http://localhost:3000/api/graphql',
  BREAKPOINT: {
    XS: 480,
    SM: 768,
    MD: 976,
    LG: 1440,
  },
  DATE_FORMAT: 'yyyy-MM-dd',
  ERROR_MESSAGE_ID_PREFIX: 'errorMessage',
  SEARCH: {
    QUERY_MIN_LENGTH: 3,
  },

  // USER PROFILE
  BIRTH_DATE: {
    MIN: format(subYears(new Date(), 100), 'yyyy-MM-dd'),
    MAX: format(subYears(new Date(), 18), 'yyyy-MM-dd'),
  },
  HEIGHT: {
    MIN: 1,
    STEP: 0.01,
  },
  MEDICAL_ID: {
    PLACEHOLDER: 'ABCD-1234-EFGHI',
    MAX_LENGTH: 15,
  },
  PAGINATION: {
    LIMIT: 10,
    RESULTS_PER_PAGE: [10, 25, 50, 100, 200, 500],
  },
  PHONE_NUMBER: {
    PLACEHOLDER: '(555) 555-5555',
    MAX_LENGTH: 14,
  },
  POST_CODE: {
    MAX_LENGTH: 10,
  },
  WEIGHT: {
    MIN: 1,
    STEP: 0.01,
  },
}
