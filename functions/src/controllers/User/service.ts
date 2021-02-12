import { db } from '@config/firestore'
import useFirestoreDate from '@helpers/useFirestoreDate'
import ResponseError from '@modules/Response/ResponseError'
import * as admin from 'firebase-admin'
import { UserCollection } from './model'

class UserService {
  public static _collection = db.collection(UserCollection)

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
