import { ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { FormElement, FormWrapper } from 'components'
import { Common } from 'constantss'
import { DoctorDepartmentsMap, DoctorDepartment } from 'enums'
import { IDoctorFormData } from 'interfaces'
import { Utilities } from 'utils'

type DoctorFormProps = IDoctorFormData & { updateFields: (fields: Partial<IDoctorFormData>) => void }

export const DoctorForm = (props: DoctorFormProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <FormWrapper>
      <FormElement
        fieldName="departmentId"
        type="select"
        required={true}
        value={props.departmentId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => props.updateFields({ departmentId: e.target.value })}
      >
        <option value="" disabled={!!props.departmentId}>
          {t('FORM.PLACEHOLDER.SELECT')}
        </option>
        {DoctorDepartmentsMap.map((id: number) => (
          <option key={id} value={id}>
            {t(`DOCTOR_DEPARTMENTS.${DoctorDepartment[id]}`)}
          </option>
        ))}
      </FormElement>
      {/* TODO: Image upload logic */}
      <FormElement
        fieldName="imageName"
        type="file"
        required={false}
        accept={Common.PROFILE_PICTURE.FORMATS}
        size={Common.PROFILE_PICTURE.MAX_SIZE}
        value={props.imageName}
        disabled={true} // TODO: Remove when image upload logic will be done
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ imageName: e.target.value })}
      />
      <FormElement
        fieldName="startDate"
        type="date"
        required={true}
        value={Utilities.formatISOToStringDate(props.startDate)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.updateFields({ startDate: Utilities.utcToZonedTime(e.target.value) })
        }
      />
      <FormElement
        fieldName="endDate"
        type="date"
        required={false}
        value={Utilities.formatISOToStringDate(props.endDate)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.updateFields({ endDate: Utilities.utcToZonedTime(e.target.value) })
        }
      />
    </FormWrapper>
  )
}
