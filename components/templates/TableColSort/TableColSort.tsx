import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'components'
import styles from './TableColSort.module.css'

type TableColSortProps<T> = {
  columnName: string
  params: T
  onClick: (field: string) => void
}

export const TableColSort = <T extends { order_by: string }>(props: TableColSortProps<T>): JSX.Element => {
  return (
    <Button onClick={() => props.onClick(props.columnName)}>
      <FontAwesomeIcon
        icon={props.params.order_by !== props.columnName ? 'sort' : 'sort-up'}
        // "group-*" won't work if used in *.module.css
        className={`${styles.sortIcon} group-aria-[sort=ascending]:text-highlight group-aria-[sort=ascending]:rotate-0 group-aria-[sort=descending]:text-highlight group-aria-[sort=descending]:rotate-180`}
      />
    </Button>
  )
}
