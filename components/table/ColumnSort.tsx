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
        className="text-inactive group-aria-[sort=ascending]:text-active group-aria-[sort=ascending]:rotate-0 group-aria-[sort=descending]:text-active group-aria-[sort=descending]:rotate-180"
      />
    </Button>
  )
}

export default ColumnSort
