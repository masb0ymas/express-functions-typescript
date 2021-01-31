/* eslint-disable no-param-reassign */
import * as admin from 'firebase-admin'
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { FilterParamsAttributes } from '@modules/FirestoreQuery/queryAttributes'

type TypeOperator =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in'
  | 'pref' // preffix
  | 'betweenDate'
  | 'month-year'
  | 'year'
  | 'atDate'
  | 'beforeDate'
  | 'afterDate'
  | 'match'

const OperatorWhere = [
  '<',
  '<=',
  '==',
  '!=',
  '>=',
  '>',
  'array-contains',
  'in',
  'array-contains-any',
  'not-in',
]

interface UseFilterableProps {
  query: admin.firestore.Query
  queryFiltered: FilterParamsAttributes[]
}

function useFiltered(props: UseFilterableProps) {
  if (!props.queryFiltered || props.queryFiltered?.length < 1) {
    return props.query
  }

  for (let i = 0; i < props.queryFiltered.length; i += 1) {
    const itemQuery = props.queryFiltered[i]
    const { id, value } = itemQuery

    if (id.includes('$')) {
      const [operatorQuery, fieldQuery] = id.split('$')
      const OpQuery = operatorQuery as TypeOperator

      if (OpQuery === 'month-year') {
        // query month year
        const startDay = startOfMonth(new Date(value))
        const endDay = endOfMonth(new Date(value))

        props.query = props.query
          .where(fieldQuery, '>=', startDay)
          .where(fieldQuery, '<=', endDay)
      } else if (OpQuery === 'year') {
        // query year
        const startDay = startOfYear(new Date(value))
        const endDay = endOfYear(new Date(value))

        props.query = props.query
          .where(fieldQuery, '>=', startDay)
          .where(fieldQuery, '<=', endDay)
      } else if (OpQuery === 'atDate') {
        // query at date
        const startDay = startOfDay(new Date(value))
        const endDay = endOfDay(new Date(value))

        props.query = props.query
          .where(fieldQuery, '>=', startDay)
          .where(fieldQuery, '<=', endDay)
      } else if (OpQuery === 'beforeDate') {
        // query before date
        const endDay = endOfDay(new Date(value))

        props.query = props.query.where(fieldQuery, '<=', endDay)
      } else if (OpQuery === 'afterDate') {
        // query after date
        const startDay = startOfDay(new Date(value))

        props.query = props.query.where(fieldQuery, '>=', startDay)
      } else if (OpQuery === 'betweenDate') {
        // query between date
        const dateParam = JSON.parse(value.replace(/'/g, '"'))
        const startDay = startOfDay(new Date(dateParam[0]))
        const endDay = endOfDay(new Date(dateParam[1]))

        props.query = props.query
          .where(fieldQuery, '>=', startDay)
          .where(fieldQuery, '<=', endDay)
          .orderBy(fieldQuery)
      } else if (OpQuery === 'pref') {
        // query pref
        props.query = props.query
          .where(fieldQuery, '>=', value)
          .where(fieldQuery, '<=', `${value}\uf8ff`)
          .orderBy(fieldQuery)
      } else if (OpQuery === 'match') {
        // query match
        props.query = props.query.where(fieldQuery, '==', value)
      } else if (OperatorWhere.includes(OpQuery)) {
        // query include operator
        props.query = props.query.where(fieldQuery, OpQuery, value)
      } else {
        // eslint-disable-next-line no-self-assign
        props.query = props.query
      }
    } else {
      // default query where
      props.query = props.query.where(id, '==', value)
    }
  }

  return props.query
}

export default useFiltered
