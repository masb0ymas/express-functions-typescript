import 'module-alias/register'
import './pathAlias'

import fs from 'fs'
import path from 'path'
import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import firebase from 'firebase'
import * as functions from 'firebase-functions'
import initialDatabase from '@config/firebase'
import indexRoutes from '@routes/index'
import withState from '@helpers/withState'
import winstonLogger, { winstonStream } from '@config/winston'
import ExpressErrorResponse from '@middlewares/ExpressErrorResponse'
import ExpressErrorYup from '@middlewares/ExpressErrorYup'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  throw new Error(
    'Missing env!!!\nCopy / Duplicate ".env.example" root directory to ".env"'
  )
}

firebase.initializeApp(initialDatabase)

const app = express()
app.use(helmet())
app.use(cors())
app.use(logger('combined', { stream: winstonStream }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req: Request, res, next) => {
  new withState(req)
  next()
})

// initial routes
app.use(indexRoutes)

app.use('/v1', ExpressErrorYup)
app.use('/v1', ExpressErrorResponse)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // add this line to include winston logging
  winstonLogger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  )

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const api = functions.region('asia-southeast2').https.onRequest(app)
export { api }
