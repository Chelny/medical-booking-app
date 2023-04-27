import { ReactNode } from 'react'
import styles from './FormWrapper.module.css'

type FormWrapperProps = {
  title?: string
  children: ReactNode
}

export const FormWrapper = (props: FormWrapperProps): JSX.Element => {
  return (
    <>
      <h3 className={styles.heading}>{props.title}</h3>
      {props.children}
    </>
  )
}
