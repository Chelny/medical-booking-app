import { MouseEventHandler, ReactElement } from 'react'
import classNames from 'classnames'
import styles from './Button.module.css'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: ReactElement | ReactElement[] | string
  type?: ButtonType
  className?: string
  disabled?: boolean
  handleClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, type, className, disabled, handleClick }: ButtonProps): JSX.Element => {
  return (
    <button
      type={type}
      className={`${styles.button} ${classNames(className)}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default Button
