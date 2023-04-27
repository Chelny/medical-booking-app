import { MouseEventHandler, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './Button.module.css'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonProps = {
  children: ReactNode
  type?: ButtonType
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button
      type={props.type}
      className={`${styles.button} ${classNames(props.className)}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
