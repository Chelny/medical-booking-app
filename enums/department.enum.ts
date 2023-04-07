export enum DoctorDepartment {
  DENTIST = 1,
  DENTUROLOGIST = 2,
  DERMATOLOGIST = 3,
  FAMILY_DOCTOR = 4,
  OPTOMETRIST = 5,
  PEDIATRICIAN = 6,
  PLASTIC_SURGEON = 7,
  PSYCHOLOGIST = 8,
}

export const DoctorDepartmentsMap = Object.values(DoctorDepartment).filter(
  (departmentId) => typeof departmentId === 'number'
) as number[]
