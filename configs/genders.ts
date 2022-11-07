interface IGender {
  id: number
  label: string
  value: string
}

export const Genders: IGender[] = [
  {
    id: 1,
    label: 'male',
    value: 'M',
  },
  {
    id: 2,
    label: 'female',
    value: 'F',
  },
  {
    id: 3,
    label: 'other',
    value: 'O',
  },
]
