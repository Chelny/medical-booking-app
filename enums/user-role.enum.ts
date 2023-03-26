export enum UserRole {
  ADMIN = 1,
  DOCTOR = 2,
  PATIENT = 3,
}

export const UserRolesMap = Object.values(UserRole).filter((roleId) => typeof roleId === 'number') as number[]
