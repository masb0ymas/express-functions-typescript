import express, { NextFunction, Request, Response } from 'express'
import BuildResponse from '@modules/Response/BuildResponse'
import ResponseError from '@modules/Response/ResponseError'

const router = express.Router()

/* Home Page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  const buildResponse = BuildResponse.get({
    message: 'Express Functions TS, Powered by masb0ymas',
    github: 'https://github.com/masb0ymas/express-functions-typescript',
  })
  return res.json(buildResponse)
})

/* Forbidden Page. */
router.get('/v1', function (req: Request, res: Response, next: NextFunction) {
  throw new ResponseError.Forbidden('forbidden, wrong access endpoint')
})

export default router
