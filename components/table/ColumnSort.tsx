import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/Button'

type ColumnSortProps<T> = {
  columnName: string
  params: T
  handleClick: (field: string) => void
}

const ColumnSort = <T extends { orderBy: string }>({
  columnName,
  params,
  handleClick,
}: ColumnSortProps<T>): JSX.Element => {
  return (
    <Button handleClick={() => handleClick(columnName)}>
      <FontAwesomeIcon
        icon={params.orderBy !== columnName ? 'sort' : 'sort-up'}
        className="text-white group-aria-[sort=ascending]:text-highlight group-aria-[sort=ascending]:rotate-0 group-aria-[sort=descending]:text-highlight group-aria-[sort=descending]:rotate-180"
      />
    </Button>
  )
}

export default ColumnSort
