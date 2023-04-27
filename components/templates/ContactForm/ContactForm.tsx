import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { FormElement, FormWrapper } from 'components'
import { CountriesMap, Countries } from 'configs'
import { Common, Regex } from 'constantss'
import { Country } from 'enums'
import { IContactFormData } from 'interfaces'
import { Utilities } from 'utils'

type ContactFormProps = IContactFormData & { updateFields: (fields: Partial<IContactFormData>) => void }

export const ContactForm = (props: ContactFormProps): JSX.Element => {
  const { t } = useTranslation()
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>(props.phoneNumber)
  const [formattedPostalCode, setFormattedPostalCode] = useState<string>(props.postalCode)
  const [postalCodeMaxLength, setPostalCodeMaxLength] = useState<number>(Common.POSTAL_CODE.MAX_LENGTH)

  useEffect(() => {
    if (props.postalCode) {
      Utilities.formatPostalCode(props.postalCode, props.country, setFormattedPostalCode, setPostalCodeMaxLength)
    }

    if (props.phoneNumber) Utilities.formatPhoneNumber(props.phoneNumber, setFormattedPhoneNumber)
  }, [])

  return (
    <FormWrapper>
      <FormElement
        fieldName="addressLine1"
        type="text"
        required={true}
        value={props.addressLine1}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ addressLine1: e.target.value })}
      />
      <FormElement
        fieldName="addressLine2"
        type="text"
        required={false}
        value={props.addressLine2}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ addressLine2: e.target.value })}
      />
      <FormElement
        fieldName="country"
        type="select"
        required={true}
        value={props.country}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => props.updateFields({ country: e.target.value })}
      >
        <option value="" disabled={!!props.country}>
          {t('FORM.PLACEHOLDER.SELECT')}
        </option>
        {CountriesMap.map((code: string, index: number) => (
          <option key={+index} value={code}>
            {t(`COUNTRIES.${code}.COUNTRY`)}
          </option>
        ))}
      </FormElement>
      <FormElement
        fieldName="region"
        type="select"
        required={true}
        value={props.region}
        disabled={!props.country}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => props.updateFields({ region: e.target.value })}
      >
        <option value="" disabled={!!props.region}>
          {!props.country ? t('FORM.PLACEHOLDER.REGION') : t('FORM.PLACEHOLDER.SELECT')}
        </option>
        {CountriesMap.filter((code: string) => code === props.country).map((code: string) =>
          Countries[code].regions
            .sort((a: string, b: string) => {
              const displayedName = (region: string) => t(`COUNTRIES.${props.country}.REGIONS.${region}`)
              return displayedName(a).localeCompare(displayedName(b))
            })
            .map((region: string, index: number) => (
              <option key={+index} value={region}>
                {t(`COUNTRIES.${props.country}.REGIONS.${region}`)}
              </option>
            ))
        )}
      </FormElement>
      <FormElement
        fieldName="city"
        type="text"
        required={true}
        value={props.city}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ city: e.target.value })}
      />
      <FormElement
        fieldName="postalCode"
        type="text"
        required={true}
        pattern={
          props.country == Country.CANADA
            ? Regex.POSTAL_CODE_CA_PATTERN.source
            : props.country == Country.USA
            ? Regex.POSTAL_CODE_US_PATTERN.source
            : '.*'
        }
        maxLength={postalCodeMaxLength}
        value={formattedPostalCode}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.updateFields({
            postalCode: Utilities.formatPostalCode(
              e.target.value,
              props.country,
              setFormattedPostalCode,
              setPostalCodeMaxLength
            ),
          })
        }
      />
      <div className="grid md:grid-cols-phone-number-md md:gap-4">
        <FormElement
          fieldName="phoneNumber"
          type="tel"
          required={true}
          pattern={Regex.PHONE_NUMBER_PATTERN.source}
          maxLength={Common.PHONE_NUMBER.MAX_LENGTH}
          placeholder={Common.PHONE_NUMBER.PLACEHOLDER}
          value={formattedPhoneNumber}
          hints={['PHONE_NUMBER_FORMAT']}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            props.updateFields({ phoneNumber: Utilities.formatPhoneNumber(e.target.value, setFormattedPhoneNumber) })
          }
        />
        <FormElement
          fieldName="phoneNumberExt"
          type="text"
          required={false}
          pattern={Regex.PHONE_NUMBER_EXT_PATTERN.source}
          maxLength={Common.PHONE_NUMBER_EXT.MAX_LENGTH}
          value={props.phoneNumberExt}
          onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ phoneNumberExt: e.target.value })}
        />
      </div>
    </FormWrapper>
  )
}
