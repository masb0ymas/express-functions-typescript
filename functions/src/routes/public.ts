import express from 'express'

const router = express.Router()

export default router

// List require route controllers
require('@controllers/Auth/controller')
require('@controllers/User/controller')
require('@controllers/Role/controller')
