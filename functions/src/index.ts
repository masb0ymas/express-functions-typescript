import 'module-alias/register'
import './pathAlias'

import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import firebase from 'firebase'
import * as functions from 'firebase-functions'
import initialDatabase from '@config/firebase'
import indexRoutes from '@routes/index'
import ExpressErrorResponse from '@middlewares/ExpressErrorResponse'
import { winstonStream } from '@config/winston'

firebase.initializeApp(initialDatabase)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('combined', { stream: winstonStream }))

// initial routes
app.use(indexRoutes)

app.use('/v1', ExpressErrorResponse)

const api = functions.region('asia-southeast2').https.onRequest(app)
export { api }
