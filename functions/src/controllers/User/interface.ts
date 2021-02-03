export interface BaseUserAttributes {
  fullName: string
  email: string
  role: string
  picturePath?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface UserDecodedAttributes {
  uid: string
  name: string
  email: string
}

export interface UserLoginAttributes {
  email: string
  password: string
}

export interface UserAttributes extends BaseUserAttributes {
  newPassword: string
  confirmNewPassword: string
}
