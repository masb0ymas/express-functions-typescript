import { Request, Response } from 'express'
import asyncHandler from '@helpers/asyncHandler'
import routes from '@routes/public'
import BuildResponse from '@modules/Response/BuildResponse'
import RoleService from '@controllers/Role/service'

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await RoleService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await RoleService.findById(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role',
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RoleService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/role/:id',
  asyncHandler(async function update(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/role/:id',
  asyncHandler(async function destroy(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
