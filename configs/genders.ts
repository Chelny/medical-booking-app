interface IGender {
  id: number
  label: string
  value: string
}

export const Genders: IGender[] = [
  {
    id: 1,
    label: 'Male',
    value: 'M',
  },
  {
    id: 2,
    label: 'Female',
    value: 'F',
  },
  {
    id: 3,
    label: 'Other',
    value: 'O',
  },
]
