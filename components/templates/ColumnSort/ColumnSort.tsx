import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/elements/Button/Button'
import styles from './ColumnSort.module.css'

type ColumnSortProps<T> = {
  columnName: string
  params: T
  handleClick: (field: string) => void
}

const ColumnSort = <T extends { order_by: string }>({
  columnName,
  params,
  handleClick,
}: ColumnSortProps<T>): JSX.Element => {
  return (
    <Button handleClick={() => handleClick(columnName)}>
      <FontAwesomeIcon
        icon={params.order_by !== columnName ? 'sort' : 'sort-up'}
        // "group-*" won't work if used in *.module.css
        className={`${styles.sortIcon} group-aria-[sort=ascending]:text-highlight group-aria-[sort=ascending]:rotate-0 group-aria-[sort=descending]:text-highlight group-aria-[sort=descending]:rotate-180`}
      />
    </Button>
  )
}

export default ColumnSort
