import * as admin from 'firebase-admin'
import { isEmpty } from 'lodash'
import { FilterQueryAttributes } from './queryAttributes'
import useFiltered from './useFiltered'
import useSorted from './useSorted'

async function useQuery(
  reqQuery: FilterQueryAttributes,
  collection: admin.firestore.CollectionReference
) {
  const page = reqQuery.page || 1
  const pageSize = reqQuery.pageSize || 10
  const filtered = reqQuery.filtered || []
  const sorted = reqQuery.sorted || []

  const parseLimit = parseInt(pageSize as string)
  // @ts-ignore
  const parseFiltered = !isEmpty(filtered) ? JSON.parse(filtered) : []
  // @ts-ignore
  const parseSorted = !isEmpty(sorted) ? JSON.parse(sorted) : []

  // get skip
  let skip = (Number(page) - 1) * Number(pageSize) || 1
  if (Number(page) > 1) {
    skip = Number(skip) + 1
  }

  // query filtered
  let queryFind = parseFiltered
    ? useFiltered({
        query: collection,
        queryFiltered: parseFiltered,
      })
    : collection

  // query sorted
  queryFind = sorted
    ? useSorted({ query: queryFind, querySorted: parseSorted })
    : queryFind

  // get first record
  const first = await queryFind.limit(skip).get()
  if (first.docs.length <= 0 || first.docs.length < skip) {
    return []
  }

  // get last record
  const last = first.docs[first.docs.length - 1]

  const ref = await queryFind.startAt(last).limit(parseLimit).get()

  return ref
}

export default useQuery
