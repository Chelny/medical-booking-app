import { MouseEventHandler } from 'react'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: JSX.Element
  type?: ButtonType
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, type, className, disabled, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      className={
        'w-full p-3 rounded-md shadow-md my-1 text-white hover:relative hover:top-0.5 disabled:opacity-50 disabled:cursor-wait dark:bg-primary-night ' +
        className
      }
      type={type ?? 'button'}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
