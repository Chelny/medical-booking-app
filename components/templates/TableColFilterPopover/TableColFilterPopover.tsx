import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Popover } from '@headlessui/react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import styles from './TableColFilterPopover.module.css'

type TableColFilterPopoverProps<T> = {
  list: T[]
  selectedValues: T[]
  translationPrefix: string
  handleChange: (selectedItems: T[]) => void
}

const TableColFilterPopover = <T,>({
  list,
  selectedValues,
  translationPrefix,
  handleChange,
}: TableColFilterPopoverProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] = useState<T[]>(selectedValues)

  const selectItems = (value: T[]) => {
    setSelectedItems(value)
  }

  return (
    <Popover className={styles.popover}>
      <Popover.Button>
        <FontAwesomeIcon
          icon="filter"
          className={classNames({
            [styles.filterIcon]: selectedValues.length === list.length,
            [styles.filterIconActive]: selectedValues.length !== list.length,
          })}
        />
      </Popover.Button>

      <Popover.Panel as="form" className={styles.panel} noValidate>
        <Listbox multiple value={selectedItems} onChange={selectItems}>
          <Listbox.Options static>
            {list.map((item: T, index: number) => (
              <Listbox.Option
                key={index}
                value={item}
                disabled={selectedItems.includes(item) && selectedItems.length === 1}
                className={styles.option}
              >
                <>
                  <FontAwesomeIcon icon="check" className={styles.optionCheckedIcon} />
                  {t(`${translationPrefix}.${item}`.toUpperCase())}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <Popover.Button type="button" onClick={() => handleChange(selectedItems)}>
          {t('BUTTON.APPLY')}
        </Popover.Button>
      </Popover.Panel>
    </Popover>
  )
}

export default TableColFilterPopover
