import { db } from '@config/firestore'
import useFirestoreDate from '@helpers/useFirestoreDate'
import ResponseError from '@modules/Response/ResponseError'
import * as admin from 'firebase-admin'

const collectionName = 'users'

class UserService {
  public static _collection = db.collection(collectionName)

  /**
   *
   * @param id
   */
  public static async findById(id: string) {
    const ref: admin.firestore.DocumentReference = this._collection.doc(id)
    const snap: admin.firestore.DocumentSnapshot = await ref.get()

    if (!snap.exists) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    const docsData = snap.data()
    const data = useFirestoreDate({ id: snap.id, ...docsData })

    return data
  }
}

export default UserService
