import express, { NextFunction, Request, Response } from 'express'
import BuildResponse from '@modules/Response/BuildResponse'
import ResponseError from '@modules/Response/ResponseError'
import publicRoute from '@routes/public'

require('dotenv').config()

const { APP_NAME } = process.env

const router = express.Router()

/* Home Page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  const buildResponse = BuildResponse.get({
    message: `${APP_NAME} TS, Powered by masb0ymas`,
    github: 'https://github.com/masb0ymas/express-functions-typescript',
  })
  return res.json(buildResponse)
})

/* Forbidden Page. */
router.get('/v1', function (req: Request, res: Response, next: NextFunction) {
  throw new ResponseError.Forbidden('forbidden, wrong access endpoint')
})

/* Declare Route */
router.use('/v1', publicRoute)

export default router
