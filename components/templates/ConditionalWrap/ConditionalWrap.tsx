import { ReactElement } from 'react'

type ConditionalWrapProps = {
  condition: boolean
  wrap: (child: ReactElement) => JSX.Element
  children: JSX.Element
}

export const ConditionalWrap = (props: ConditionalWrapProps) =>
  props.condition ? props.wrap(props.children) : props.children
