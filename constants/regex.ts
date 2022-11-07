import XRegExp from 'xregexp'

export const Regex = {
  BIRTHDAY_PATTERN: /^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[0-9]|[1-2][0-9]|3[0-1])$/,
  EMAIL_PATTERN:
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
  /**
   * Medical ID
   * Pattern: ABCD-1234-EFGHI
   */
  MEDICAL_ID: /^[A-Z]{4}\-?[0-9]{4}\-?[A-Z]{5}$/,
  /**
   * Name Pattern
   * - Name must have letters and hyphen, space or an apostrophe
   * - Name must start with a capital letter
   * - No lowercase and uppercase-only name
   * - First letter must be uppercase
   * - The letter following a hyphen, space or an apostrophe must be uppercase
   * - Accented characters are allowed
   * - No -- or <space><space> or '' inside
   */
  NAME_PATTERN: XRegExp("^([\\p{L}]{2,})?(?:((^| )[\\p{L}]{1,3}\\. |[-' ])[\\p{L}]{2,})*$"),
  /**
   * Password Pattern
   * - Password must be at least 8 characters long
   * - Must contain at least one digit
   * - Must contain at least one special character from !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
   */
  PASSWORD_PATTERN:
    /^(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
  /**
   * Phone Number Pattern
   * - Valid values:
   *   - 1234567890 (Will auto-format on blur)
   *   - (123) 456-7890
   */
  PHONE_PATTERN: /^(([0-9]{10})|\([0-9]{3}\)\s[0-9]{3}-[0-9]{4})$/,
  PHONE_EXT_PATTERN: /^[1-9][0-9]{2,3}$/,
  /**
   * Username Pattern
   * - Username must be between 5 and 16 characters long
   * - Allowed characters: letters, digits, periods and underscores
   * - No _ or . at the beginning
   * - No __ or _. or ._ or .. inside
   * - No _ or . at the end
   *
   * Source: https://stackoverflow.com/a/12019115
   */
  USERNAME_PATTERN: /^(?=[a-zA-Z0-9._]{5,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
  /**
   * Zip Code Pattern
   * Canada: A0A 0A0
   * USA: 55555 OR 55555-5555
   */
  ZIP_CODE_CAN_PATTERN: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s-]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
  ZIP_CODE_USA_PATTERN: /^(?!0{5})(\d{5})(?!-?0{4})(|-\d{1,4})?$/,
}
