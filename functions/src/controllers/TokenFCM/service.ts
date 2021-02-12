import { Request } from 'express'
import { db } from '@config/firestore'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import schema from '@controllers/TokenFCM/schema'
import useValidation from '@helpers/useValidation'
import useFirestoreDate from '@helpers/useFirestoreDate'
import useQuery from '@modules/FirestoreQuery/useQuery'
import ResponseError from '@modules/Response/ResponseError'
import { TokenFCMAttributes, TokenFcmCollection } from './model'

class TokenFCMService {
  public static _collection = db.collection(TokenFcmCollection)

  /**
   *
   * @param req - Request
   */
  public static async getAll(req: Request) {
    const reqQuery = req.getQuery()

    // @ts-ignore
    const ref = await useQuery(reqQuery, this._collection)

    const docsData: admin.firestore.DocumentData = []
    ref.forEach((doc: firebase.default.firestore.DocumentData) => {
      const snap = { id: doc.id, ...doc.data() }
      return docsData.push(snap)
    })
    const data = useFirestoreDate(docsData)

    return { data, total: data.length }
  }

  /**
   *
   * @param id
   */
  public static async findById(id: string) {
    const ref: admin.firestore.DocumentReference = this._collection.doc(id)
    const snap: admin.firestore.DocumentSnapshot = await ref.get()

    if (!snap.exists) {
      throw new ResponseError.NotFound(
        'token fcm data not found or has been deleted'
      )
    }

    const docsData = snap.data()
    const data = useFirestoreDate({ id: snap.id, ...docsData })

    return data
  }

  /**
   *
   * @param userId
   */
  public static async findByUserId(userId: string) {
    const refQuery = this._collection.where('UserId', '==', userId)
    const ref = await refQuery.get()

    const docsData: admin.firestore.DocumentData = []
    ref.forEach((doc: firebase.default.firestore.DocumentData) => {
      const snap = { id: doc.id, ...doc.data() }
      return docsData.push(snap)
    })

    const data = useFirestoreDate(docsData)

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: TokenFCMAttributes) {
    const newFormData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const value = useValidation(schema.create, newFormData)

    const ref = await this._collection.add(value)
    const snap = await ref.get()
    const data = useFirestoreDate({ id: ref.id, ...snap.data() })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: TokenFCMAttributes) {
    const ref: admin.firestore.DocumentReference = this._collection.doc(id)
    const getOne = await this.findById(id)

    const newFormData = {
      ...formData,
      updatedAt: new Date(),
    }

    const value = useValidation(schema.create, {
      ...getOne,
      ...newFormData,
    })

    await ref.update(value)
    const updated = await ref.get()
    const data = useFirestoreDate({ id: ref.id, ...updated.data() })

    return data
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string) {
    const ref: admin.firestore.DocumentReference = this._collection.doc(id)
    await ref.delete()
  }
}

export default TokenFCMService
