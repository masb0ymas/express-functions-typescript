import * as admin from 'firebase-admin'
import { SortParamsAttributes } from './queryAttributes'

interface UseSortedProps {
  query: admin.firestore.Query
  querySorted: SortParamsAttributes[]
}

function useSorted(props: UseSortedProps) {
  if (!props.querySorted || !props.querySorted[0]?.id) {
    return props.query
  }

  const { id, desc = true } = props.querySorted[0]
  const sortType = desc === true ? 'desc' : 'asc'

  return props.query.orderBy(id, sortType)
}

export default useSorted
