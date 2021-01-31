/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import * as admin from 'firebase-admin'

function useFirestoreDate(objectData: object | any) {
  for (const props in objectData) {
    // guard for-in
    if (Object.prototype.hasOwnProperty.call(objectData, props)) {
      // check instance Timestamp
      if (objectData[props] instanceof admin.firestore.Timestamp) {
        objectData[props] = objectData[props].toDate()
      }

      if (typeof objectData[props] === 'object') {
        useFirestoreDate(objectData[props])
      }
    }
  }

  return objectData
}

export default useFirestoreDate
