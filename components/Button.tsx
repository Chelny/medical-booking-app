import { MouseEventHandler, ReactElement } from 'react'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: ReactElement
  type?: ButtonType
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, type, className, disabled, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      type={type ?? 'button'}
      className={`w-full px-3 py-2 rounded-sm shadow-sm my-1 text-sm text-white hover:relative hover:top-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
