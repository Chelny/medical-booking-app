import { ChangeEvent, useEffect, useState } from 'react'
import { FormElement, FormWrapper } from 'components'
import { Common, Regex } from 'constantss'
import { IPatientFormData } from 'interfaces'
import { Utilities } from 'utils'

type PatientFormProps = IPatientFormData & { updateFields: (fields: Partial<IPatientFormData>) => void }

export const PatientForm = (props: PatientFormProps): JSX.Element => {
  const [formattedMedicalId, setFormattedMedicalId] = useState<string>(props.medicalId)

  useEffect(() => {
    if (props.medicalId) Utilities.formatMedicalId(props.medicalId, setFormattedMedicalId)
  }, [])

  return (
    <FormWrapper>
      <FormElement
        fieldName="medicalId"
        type="text"
        required={true}
        pattern={Regex.MEDICAL_ID_PATTERN.source}
        maxLength={Common.MEDICAL_ID.MAX_LENGTH}
        placeholder={Common.MEDICAL_ID.PLACEHOLDER}
        value={formattedMedicalId}
        hints={['MEDICAL_ID_FORMAT']}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.updateFields({ medicalId: Utilities.formatMedicalId(e.target.value, setFormattedMedicalId) })
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <FormElement
          fieldName="height"
          type="number"
          min={Common.HEIGHT.MIN}
          step={Common.HEIGHT.STEP}
          required={false}
          value={props.height}
          onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ height: e.target.value })}
        />
        <FormElement
          fieldName="weight"
          type="number"
          required={false}
          min={Common.WEIGHT.MIN}
          step={Common.WEIGHT.STEP}
          value={props.weight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ weight: e.target.value })}
        />
      </div>
    </FormWrapper>
  )
}
