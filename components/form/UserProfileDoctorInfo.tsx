import { FormEvent } from 'react'
import { useTranslation } from 'next-i18next'
import FormElement from 'components/form/FormElement'
import { Common } from 'constants/common'
import { DoctorDepartment, DoctorDepartmentsMap } from 'enums/department.enum'

type UserProfileDoctorInfoProps = {
  values: { [key: string]: number | string }
  errors: IStringMap
  handleChange: (event: FormEvent<HTMLElement>) => void
}

const UserProfileDoctorInfo = ({ values, errors, handleChange }: UserProfileDoctorInfoProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <FormElement fieldName="departmentId" error={errors.departmentId}>
        <select
          data-testid="form-input-department-id"
          id="departmentId"
          value={values.departmentId}
          aria-required="true"
          aria-invalid={!!errors.departmentId}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_departmentId`}
          onChange={handleChange}
        >
          <option aria-label={t('FORM.PLACEHOLDER.SELECT')} />
          {DoctorDepartmentsMap.map((id: number) => (
            <option key={id} value={id}>
              {t(`DOCTOR_DEPARTMENTS.${DoctorDepartment[id]}`)}
            </option>
          ))}
        </select>
      </FormElement>
      {/* TODO: Image upload logic */}
      <FormElement fieldName="imageName" error={errors.imageName} optional>
        <input
          data-testid="form-input-image-name"
          type="file"
          id="imageName"
          accept={Common.PROFILE_PICTURE.FORMATS}
          size={Common.PROFILE_PICTURE.MAX_SIZE}
          value={values.imageName ?? undefined}
          aria-required="false"
          aria-invalid={!!errors.imageName}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_imageName`}
          disabled // TODO: Remove when image upload logic will be done
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="startDate" error={errors.startDate}>
        <input
          data-testid="form-input-start-date"
          type="date"
          id="startDate"
          value={values.startDate}
          aria-required="true"
          aria-invalid={!!errors.startDate}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_startDate`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="endDate" error={errors.endDate} optional>
        <input
          data-testid="form-input-end-date"
          type="date"
          id="endDate"
          value={values.endDate}
          aria-required="false"
          aria-invalid={!!errors.endDate}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_endDate`}
          onChange={handleChange}
        />
      </FormElement>
    </>
  )
}

export default UserProfileDoctorInfo
