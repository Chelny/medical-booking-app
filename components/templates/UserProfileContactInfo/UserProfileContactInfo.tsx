import { FormEvent, useState } from 'react'
import { useTranslation } from 'next-i18next'
import FormElement from 'components/elements/FormElement/FormElement'
import { Countries, CountriesMap } from 'configs/countries'
import { Common } from 'constants/common'
import { InputMaskUtil } from 'utils/input-mask'

type UserProfileContactInfoProps = {
  values: { [key: string]: number | string }
  errors: IStringMap
  handleChange: (event: FormEvent<HTMLElement>) => void
}

const UserProfileContactInfo = ({ values, errors, handleChange }: UserProfileContactInfoProps): JSX.Element => {
  const { t } = useTranslation()

  const [phoneNumber, setPhoneNumber] = useState(values.phoneNumber)
  const [postCode, setPostCode] = useState(values.postCode)
  const [postCodeMaxLength, setPostCodeMaxLength] = useState(Common.POST_CODE.MAX_LENGTH)

  return (
    <>
      <FormElement fieldName="addressLine1" error={errors.addressLine1}>
        <input
          data-testid="form-input-address-line1"
          type="text"
          id="addressLine1"
          value={values.addressLine1}
          aria-required={true}
          aria-invalid={!!errors.addressLine1}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_addressLine1`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="addressLine2" error={errors.addressLine2} optional>
        <input
          data-testid="form-input-address-line2"
          type="text"
          id="addressLine2"
          placeholder={t('FORM.PLACEHOLDER.ADDRESS_LINE2')}
          value={values.addressLine2}
          aria-required="false"
          aria-invalid={!!errors.addressLine2}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_addressLine2`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="country" error={errors.country}>
        <select
          data-testid="form-input-country"
          id="country"
          value={values.country}
          aria-required={true}
          aria-invalid={!!errors.country}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_country`}
          onChange={handleChange}
        >
          <option label={t('FORM.PLACEHOLDER.SELECT')} disabled={!!values.country} />
          {CountriesMap.map((code: string, index: number) => (
            <option key={+index} value={code}>
              {t(`COUNTRIES.${code}.COUNTRY`)}
            </option>
          ))}
        </select>
      </FormElement>
      <FormElement fieldName="region" error={errors.region}>
        <select
          data-testid="form-input-region"
          id="region"
          disabled={!values.country}
          value={values.region}
          aria-required={true}
          aria-invalid={!!errors.region}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_region`}
          onChange={handleChange}
        >
          <option>{!values.country ? t('FORM.PLACEHOLDER.REGION') : ''}</option>
          {CountriesMap.filter((code: string) => code === values.country).map((code: string) =>
            Countries[code].regions
              .sort((a: string, b: string) => {
                const displayedName = (region: string) => t(`COUNTRIES.${values.country}.REGIONS.${region}`)
                return displayedName(a).localeCompare(displayedName(b))
              })
              .map((region: string, index: number) => (
                <option key={+index} value={region}>
                  {t(`COUNTRIES.${values.country}.REGIONS.${region}`)}
                </option>
              ))
          )}
        </select>
      </FormElement>
      <FormElement fieldName="city" error={errors.city}>
        <input
          data-testid="form-input-city"
          type="text"
          id="city"
          value={values.city}
          aria-required={true}
          aria-invalid={!!errors.city}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_city`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="postCode" error={errors.postCode}>
        <input
          data-testid="form-input-post-code"
          type="text"
          id="post-code"
          maxLength={postCodeMaxLength}
          value={postCode}
          aria-required={true}
          aria-invalid={!!errors.postCode}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_postCode`}
          onChange={(e) => InputMaskUtil.maskPostCode(e, values, setPostCode, setPostCodeMaxLength, handleChange)}
        />
      </FormElement>
      <div className="grid md:grid-cols-phone-number-md md:gap-4">
        <FormElement fieldName="phoneNumber" hints={['PHONE_NUMBER_FORMAT']} error={errors.phoneNumber}>
          <input
            data-testid="form-input-phone-number"
            type="tel"
            id="phone-number"
            placeholder={Common.PHONE_NUMBER.PLACEHOLDER}
            maxLength={Common.PHONE_NUMBER.MAX_LENGTH}
            value={phoneNumber}
            aria-required={true}
            aria-invalid={!!errors.phoneNumber}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_phoneNumber`}
            onChange={(e) => InputMaskUtil.maskPhoneNumber(e, setPhoneNumber, handleChange)}
          />
        </FormElement>
        <FormElement fieldName="phoneNumberExt" error={errors.phoneNumberExt} optional>
          <input
            data-testid="form-input-phone-number-ext"
            type="tel"
            id="phone-number-ext"
            value={values.phoneNumberExt}
            aria-required="false"
            aria-invalid={!!errors.phoneNumberExt}
            aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_phoneNumberExt`}
            onChange={handleChange}
          />
        </FormElement>
      </div>
    </>
  )
}

export default UserProfileContactInfo
