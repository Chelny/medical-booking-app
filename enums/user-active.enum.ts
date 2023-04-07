export enum UserActive {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const UserActiveMap = Object.values(UserActive)
  .filter((active) => typeof active === 'number')
  .map((active) => Boolean(active))
