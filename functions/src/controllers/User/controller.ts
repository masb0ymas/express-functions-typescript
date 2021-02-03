import { Request, Response } from 'express'
import asyncHandler from '@helpers/asyncHandler'
import routes from '@routes/public'
import BuildResponse from '@modules/Response/BuildResponse'
import UserService from '@controllers/User/service'
import Authorization from '@middlewares/Authorization'

routes.get(
  '/user/:id',
  Authorization,
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await UserService.findById(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)
