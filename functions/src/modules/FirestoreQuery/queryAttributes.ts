export interface FilterParamsAttributes {
  id: string
  value: string
}

export interface SortParamsAttributes {
  id: string
  desc: boolean
}

export interface FilterQueryAttributes {
  page: string | number
  pageSize: string | number
  filtered: FilterParamsAttributes[] | string
  sorted: SortParamsAttributes[] | string
}
