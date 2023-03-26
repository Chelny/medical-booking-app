export enum DoctorDepartment {
  FAMILY_MEDICINE = 1,
  CARDIOLOGY = 2,
  DERMATOLOGY = 3,
  RADIOLOGY = 4,
  NEUROLOGY = 5,
  GYNECOLOGY = 6,
  GASTROENTEROLOGY = 7,
  OPHTHALMOLOGY = 8,
  REHABILITATION = 9,
  ONCOLOGY = 10,
  RESPIROLOGY = 11,
  UROLOGY = 12,
  RHEUMATOLOGY = 13,
  PSYCHIATRY = 14,
  PLASTIC_SURGERY = 15,
}

export const DoctorDepartmentsMap = Object.values(DoctorDepartment).filter(
  (departmentId) => typeof departmentId === 'number'
) as number[]
