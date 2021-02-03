import { NextFunction, Request, Response } from 'express'

async function ExpressErrorFirebase(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(400).json({
      code: 400,
      message: err.message,
    })
  }

  next(err)
}

export default ExpressErrorFirebase
