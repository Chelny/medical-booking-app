import { ReactElement } from 'react'

type ConditionalWrapProps = {
  condition: boolean
  wrap: (child: ReactElement) => ReactElement
  children: ReactElement
}

const ConditionalWrap = ({ condition, wrap, children }: ConditionalWrapProps) => (condition ? wrap(children) : children)

export default ConditionalWrap
