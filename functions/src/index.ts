import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import firebase from 'firebase'
import functions from 'firebase-functions'
import initialDatabase from 'config/firebase'
import indexRoutes from 'routes'

firebase.initializeApp(initialDatabase)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

// initial routes
app.use(indexRoutes)

const api = functions.region('asia-southeast2').https.onRequest(app)
export { api }
