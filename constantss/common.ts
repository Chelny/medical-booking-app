import { addYears, format, subYears } from 'date-fns'
import { Routes } from './routes'

export const Common = {
  APP_NAME: 'Medical Booking App',
  API_URL: 'http://localhost:3000/api/graphql',
  CONTACT_EMAIL: 'contact@medical-booking.app',
  REPO_URL: 'https://github.com/Chelny/medical-booking-app',

  BREAKPOINT: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  CALENDAR: {
    MIN_DATE: new Date(2022, 0, 1),
    MAX_DATE: addYears(new Date(), 1),
  },
  DATE_FORMAT: 'yyyy-MM-dd',
  ERROR_MESSAGE_ID_PREFIX: 'errorMessage',
  LOCAL_TZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
  MULTI_STEP_FORM: {
    PROGRESS_BAR: {
      DOCTOR_FORM: [
        { translation: { key: 'PROFILE.STEPS.GENERAL_INFORMATION', namespace: 'account' }, iconName: 'user' },
        { translation: { key: 'PROFILE.STEPS.ACCOUNT_INFORMATION', namespace: 'account' }, iconName: 'key' },
        { translation: { key: 'PROFILE.STEPS.CONTACT_INFORMATION', namespace: 'account' }, iconName: 'address-book' },
        { translation: { key: 'PROFILE.STEPS.DOCTOR_INFORMATION', namespace: 'account' }, iconName: 'user-doctor' },
      ],
      PATIENT_FORM: [
        { translation: { key: 'PROFILE.STEPS.GENERAL_INFORMATION', namespace: 'account' }, iconName: 'user' },
        { translation: { key: 'PROFILE.STEPS.ACCOUNT_INFORMATION', namespace: 'account' }, iconName: 'key' },
        { translation: { key: 'PROFILE.STEPS.CONTACT_INFORMATION', namespace: 'account' }, iconName: 'address-book' },
        { translation: { key: 'PROFILE.STEPS.PATIENT_INFORMATION', namespace: 'account' }, iconName: 'hospital-user' },
      ],
    },
  },
  PAGINATION: {
    LIMIT: 10,
    RESULTS_PER_PAGE: [10, 25, 50, 100, 200, 500],
  },
  SEARCH: {
    QUERY_MIN_LENGTH: 3,
  },
  SERVER_SIDE_PROPS: {
    NO_TOKEN: {
      redirect: {
        permanent: false,
        destination: Routes.HOME,
      },
      props: {},
    },
    TOKEN: {
      redirect: {
        permanent: false,
        destination: Routes.DASHBOARD,
      },
      props: {},
    },
    TRANSLATION_NAMESPACES: ['common', 'api'],
  },
  UNAUTH_ROUTES: [Routes.HOME, Routes.SIGN_UP, Routes.FORGOT_PASSWORD, Routes.RESET_PASSWORD],

  // User Profile
  BIRTH_DATE: {
    MIN: format(subYears(new Date(), 100), 'yyyy-MM-dd'),
    MAX: format(subYears(new Date(), 18), 'yyyy-MM-dd'),
  },
  POSTAL_CODE: {
    MAX_LENGTH: 10,
  },
  PHONE_NUMBER: {
    PLACEHOLDER: '(555) 555-5555',
    MAX_LENGTH: 14,
  },
  PHONE_NUMBER_EXT: {
    MAX_LENGTH: 5,
  },
  PROFILE_PICTURE: {
    FORMATS: '.jpeg, .jpg, .png',
    MAX_SIZE: 1024000, // Bytes = 1MB
  },
  MEDICAL_ID: {
    PLACEHOLDER: 'ABCD-1234-EFGHI',
    MAX_LENGTH: 15,
  },
  HEIGHT: {
    MIN: 1,
    STEP: 0.01,
  },
  WEIGHT: {
    MIN: 1,
    STEP: 0.01,
  },
}
