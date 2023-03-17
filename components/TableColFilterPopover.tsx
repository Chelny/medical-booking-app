import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Popover } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import Button from 'components/Button'

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
          className={selectedValues.length !== list.length ? 'text-active' : 'text-inactive'}
        />
      </Popover.Button>

      <Popover.Panel
        as="form"
        className="absolute left-[50%] z-10 translate-x-[-50%] w-max-content p-2 border border-light-shade rounded-md drop-shadow-2xl bg-white dark:border-dark-tint dark:bg-dark-shade"
      >
        <Listbox multiple value={selectedItems} onChange={selectItems}>
          <Listbox.Options static>
            {list.map((item: T, index: number) => (
              <Listbox.Option
                key={index}
                value={item}
                disabled={selectedItems.includes(item) && selectedItems.length === 1}
                className="grid grid-cols-listbox items-center gap-2 px-1 py-2 rounded-md cursor-pointer hover:bg-light-shade ui-not-selected:text-black ui-selected:text-black ui-selected:font-medium ui-not-selected:text-black ui-disabled:opacity-50 ui-disabled:cursor-not-allowed dark:hover:bg-dark dark:ui-selected:text-white dark:ui-not-selected:text-white"
              >
                <>
                  <FontAwesomeIcon icon="check" className="invisible ui-selected:visible ui-selected:text-active" />
                  {t(`${translationPrefix}.${item}`)}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <div className="flex flex-cols gap-1">
          <Button type="reset" className="flex-[0_50%]" onClick={() => setSelectedItems(list)}>
            {t('BUTTON.RESET')}
          </Button>
          <Popover.Button type="submit" className="flex-[0_50%]" onClick={() => handleChange(selectedItems)}>
            {t('BUTTON.APPLY')}
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default TableColFilterPopover
