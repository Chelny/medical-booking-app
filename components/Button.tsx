import { MouseEventHandler, ReactElement } from 'react'
import styles from 'styles/modules/Button.module.css'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: ReactElement | ReactElement[]
  type?: ButtonType
  className?: string
  disabled?: boolean
  handleClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, type, className, disabled, handleClick }: ButtonProps): JSX.Element => {
  return (
    <button type={type} className={`${styles.btn} ${className ?? ''}`} disabled={disabled} onClick={handleClick}>
      {children}
    </button>
  )
}

export default Button
