import { FormEvent, useState } from 'react'
import FormElement from 'components/form/FormElement'
import { Common } from 'constants/common'
import { InputMaskUtil } from 'utils/input-mask'

type UserProfilePatientInfoProps = {
  values: { [key: string]: number | string }
  errors: IStringMap
  handleChange: (event: FormEvent<HTMLElement>) => void
}

const UserProfilePatientInfo = ({ values, errors, handleChange }: UserProfilePatientInfoProps): JSX.Element => {
  const [maskMedicalId, setMaskMedicalId] = useState(values.medicalId)

  return (
    <>
      <FormElement fieldName="medicalId" error={errors.medicalId}>
        <input
          data-testid="form-input-medical-id"
          type="text"
          id="medicalId"
          placeholder={Common.MEDICAL_ID.PLACEHOLDER}
          maxLength={Common.MEDICAL_ID.MAX_LENGTH}
          value={maskMedicalId}
          aria-required="true"
          aria-invalid={!!errors.medicalId}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_medicalId`}
          onChange={(e) => InputMaskUtil.maskMedicalId(e, setMaskMedicalId, handleChange)}
        />
      </FormElement>
      <div className="grid grid-cols-2 gap-4">
        <FormElement fieldName="height" error={errors.height} optional>
          <input
            data-testid="form-input-height"
            type="number"
            id="height"
            min={Common.HEIGHT.MIN}
            step={Common.HEIGHT.STEP}
            value={values.height}
            aria-required="false"
            aria-invalid={!!errors.height}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_height`}
            onChange={handleChange}
          />
        </FormElement>
        <FormElement fieldName="weight" error={errors.weight} optional>
          <input
            data-testid="form-input-weight"
            type="number"
            id="weight"
            min={Common.WEIGHT.MIN}
            step={Common.WEIGHT.STEP}
            value={values.weight}
            aria-required="false"
            aria-invalid={!!errors.weight}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_weight`}
            onChange={handleChange}
          />
        </FormElement>
      </div>
    </>
  )
}

export default UserProfilePatientInfo
