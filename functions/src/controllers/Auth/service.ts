import firebase from 'firebase'
import * as admin from 'firebase-admin'
import {
  MemberLoginAttributes,
  UserAttributes,
  UserCollection,
  UserLoginAttributes,
} from '@controllers/User/model'
import { db } from '@config/firestore'
import useValidation from '@helpers/useValidation'
import schemaUser from '@controllers/User/schema'
import schemaAuth from '@controllers/Auth/schema'
import useFirestoreDate from '@helpers/useFirestoreDate'
import UserService from '@controllers/User/service'
import TokenFCMService from '@controllers/TokenFCM/service'

class AuthService {
  public static _collection = db.collection(UserCollection)

  /**
   *
   * @param email
   */
  public static async getUserByEmail(email: string) {
    const getUser = await admin.auth().getUserByEmail(email)
    return getUser
  }

  /**
   *
   * @param formData
   */
  public static async signUp(formData: UserAttributes) {
    const validateUser = useValidation(schemaUser.createUserFirebase, formData)

    const createUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(
        validateUser.email,
        validateUser.confirmNewPassword
      )

    const UserId = createUser?.user?.uid as string

    await admin.auth().setCustomUserClaims(UserId, {
      name: formData.fullName,
      role: formData.role,
    })

    const newFormData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const value = useValidation(schemaAuth.signUp, newFormData)
    if (value.newPassword || value.confirmNewPassword) {
      delete value.newPassword
      delete value.confirmNewPassword
    }

    const ref = await this._collection.doc(UserId)
    await ref.set(value, { merge: true })

    const snap = await ref.get()
    const data = useFirestoreDate({
      id: ref.id,
      ...snap.data(),
    })

    return { message: 'Register account successfully', data }
  }

  /**
   *
   * @param formData
   */
  public static async baseLogin(formData: UserLoginAttributes) {
    const getUser = await this.getUserByEmail(formData.email)

    await admin.auth().setCustomUserClaims(getUser.uid, {
      name: getUser.customClaims?.name,
      role: getUser.customClaims?.role,
    })

    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password)

    const token = await data.user?.getIdToken()
    const refreshToken = await data.user?.refreshToken

    const user = {
      uid: getUser.uid,
      name: getUser.customClaims?.name,
      role: getUser.customClaims?.role,
      email: formData.email,
      photoUrl: data.user?.photoURL,
    }

    return { message: 'Login successfully', token, refreshToken, user }
  }

  /**
   *
   * @param formData
   */
  public static async webLogin(formData: UserLoginAttributes) {
    const value = useValidation(schemaAuth.webLogin, formData)
    const data = await this.baseLogin(value)

    return { ...data }
  }

  /**
   *
   * @param formData
   */
  public static async mobileLogin(formData: MemberLoginAttributes) {
    const value = useValidation(schemaAuth.mobileLogin, formData)

    // base login
    const data = await this.baseLogin({
      email: value.email,
      password: value.password,
    })

    // save device token fcm
    const tokenFcmData = await TokenFCMService.create({
      UserId: data.user.uid,
      deviceToken: value.deviceToken,
    })

    return { ...data, tokenFcm: tokenFcmData }
  }

  /**
   *
   * @param email
   */
  public static async profile(email: string) {
    const getUser = await this.getUserByEmail(email)
    const data = await UserService.findById(getUser.uid)

    return data
  }
}

export default AuthService
