import { Request, Response } from 'express'
import routes from '@routes/public'
import asyncHandler from '@helpers/asyncHandler'
import AuthService from '@controllers/Auth/service'
import BuildResponse from '@modules/Response/BuildResponse'
import Authorization from '@middlewares/Authorization'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.signUp(formData)
    const buildResponse = BuildResponse.created(data)

    return res.status(201).json(buildResponse)
  })
)

routes.post(
  '/auth/web/sign-in',
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.webLogin(formData)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/auth/mobile/sign-in',
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.mobileLogin(formData)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function profile(req: Request, res: Response) {
    const userData = req.getState('user')

    const data = await AuthService.profile(userData.email)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)
