import { Request } from 'express'
import { isEmpty } from 'lodash'

/**
 *
 * @param headers - Get Token from headers
 */
function getToken(headers: any) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')

    // Check Bearer xxx || JWT xxx
    if (parted[0] === 'Bearer' || parted[0] === 'JWT') {
      if (parted.length === 2) {
        return parted[1]
      }
    }

    return null
  }
  return null
}

/**
 *
 * @param req - Request
 */
function currentToken(req: Request) {
  const getCookie = req.getCookies()
  const getHeaders = req.getHeaders()

  let curToken = ''
  if (!isEmpty(getCookie.token)) {
    curToken = getCookie.token
  } else {
    curToken = getToken(getHeaders)
  }

  return curToken
}

export { getToken, currentToken }
