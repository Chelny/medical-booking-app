import { MouseEventHandler, ReactElement } from 'react'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: ReactElement | ReactElement
  type?: ButtonType
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, type, className, disabled, onClick }: ButtonProps): JSX.Element => {
  return (
    <button type={type ?? 'button'} className={`btn ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
