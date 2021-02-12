export interface TokenFCMAttributes {
  UserId: string
  deviceToken: string
  createdAt?: Date | null
  updatedAt?: Date | null
}

export const TokenFcmCollection = 'tokenFCM'
