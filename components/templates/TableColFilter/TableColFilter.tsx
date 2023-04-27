import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Popover } from '@headlessui/react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import styles from './TableColFilter.module.css'

type TableColFilterProps<T> = {
  list: T[]
  selectedValues: T[]
  translationPrefix: string
  onChange: (selectedItems: T[]) => void
}

export const TableColFilter = <T,>(props: TableColFilterProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] = useState<T[]>(props.selectedValues)

  const selectItems = (value: T[]) => {
    setSelectedItems(value)
  }

  return (
    <Popover className={styles.popover}>
      <Popover.Button>
        <FontAwesomeIcon
          icon="filter"
          className={classNames({
            [styles.filterIcon]: props.selectedValues.length === props.list.length,
            [styles.filterIconActive]: props.selectedValues.length !== props.list.length,
          })}
        />
      </Popover.Button>

      <Popover.Panel as="form" className={styles.panel} noValidate>
        <Listbox multiple value={selectedItems} onChange={selectItems}>
          <Listbox.Options static>
            {props.list.map((item: T, index: number) => (
              <Listbox.Option
                key={index}
                value={item}
                disabled={selectedItems.includes(item) && selectedItems.length === 1}
                className={styles.option}
              >
                <>
                  <FontAwesomeIcon icon="check" className={styles.optionCheckedIcon} />
                  {t(`${props.translationPrefix}.${item}`.toUpperCase())}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <Popover.Button type="button" onClick={() => props.onChange(selectedItems)}>
          {t('BUTTON.APPLY')}
        </Popover.Button>
      </Popover.Panel>
    </Popover>
  )
}
