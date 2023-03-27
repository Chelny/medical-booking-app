export enum DoctorDepartment {
  DENTIST = 1,
  DERMATOLOGY = 2,
  DIETETICS = 3,
  FAMILY_MEDICINE = 4,
  OPTOMETRY = 5,
  PEDIATRICS = 6,
  PLASTIC_SURGERY = 7,
  PSYCHOLOGY = 8,
}

export const DoctorDepartmentsMap = Object.values(DoctorDepartment).filter(
  (departmentId) => typeof departmentId === 'number'
) as number[]
