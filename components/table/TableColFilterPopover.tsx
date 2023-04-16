import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Popover } from '@headlessui/react'
import { useTranslation } from 'next-i18next'

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
    <Popover className="relative">
      <Popover.Button>
        <FontAwesomeIcon
          icon="filter"
          className={selectedValues.length !== list.length ? 'text-highlight' : 'text-white'}
        />
      </Popover.Button>

      <Popover.Panel
        as="form"
        className="absolute left-[50%] z-10 translate-x-[-50%] min-w-[150px] p-2 border border-light-mode-border rounded-md drop-shadow-2xl bg-light-mode-foreground dark:border-dark-mode-border dark:bg-dark-mode-foreground"
        noValidate
      >
        <Listbox multiple value={selectedItems} onChange={selectItems}>
          <Listbox.Options static>
            {list.map((item: T, index: number) => (
              <Listbox.Option
                key={index}
                value={item}
                disabled={selectedItems.includes(item) && selectedItems.length === 1}
                className="grid grid-cols-listbox items-center gap-2 px-1 py-2 rounded-md cursor-pointer hover:bg-light-mode-background ui-selected:text-black ui-selected:font-medium ui-not-selected:text-black ui-disabled:opacity-50 ui-disabled:cursor-not-allowed dark:hover:bg-dark-mode-background dark:ui-selected:text-white dark:ui-not-selected:text-white"
              >
                <>
                  <FontAwesomeIcon icon="check" className="invisible ui-selected:visible ui-selected:text-highlight" />
                  {t(`${translationPrefix}.${item}`.toUpperCase())}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <Popover.Button className="text-white" onClick={() => handleChange(selectedItems)}>
          {t('BUTTON.APPLY')}
        </Popover.Button>
      </Popover.Panel>
    </Popover>
  )
}

export default TableColFilterPopover
