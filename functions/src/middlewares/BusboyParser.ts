import { NextFunction, Response } from 'express'
import os from 'os'
import fs from 'fs'
import path from 'path'
import Busboy from 'busboy'
import slugify from 'slugify'
import { FileInstance, StringKeys } from '@interfaces/file'

const allowedMethod = ['POST', 'PUT']
const defaultLimit = 10 * 1024 * 1024
const defaultAllowedExt = ['.png', '.jpg', '.jpeg', '.xlsx', '.xls', '.pdf']

interface BusboyParserProps {
  name: string
  allowedExt?: string[]
  limit?: number
}

function BusboyParser(props: BusboyParserProps) {
  return function uploadFile(req: any, res: Response, next: NextFunction) {
    if (
      allowedMethod.includes(req.method) &&
      req.rawBody &&
      req.headers['content-type'].startsWith('multipart/form-data')
    ) {
      const busboy = new Busboy({
        headers: req.headers,
        limits: { fileSize: props.limit || defaultLimit },
      })

      const fields: StringKeys = {}
      const files: FileInstance = {}
      const fileWrite: Array<Promise<void>> = []

      const tmpdir = os.tmpdir()

      busboy.on('field', (key, value) => {
        fields[key] = value
      })

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (!fieldname.includes(props.name)) {
          return res.status(400).json({
            code: 400,
            message: 'invalid fieldname upload',
          })
        }

        const ext = path.extname(filename)
        const allowedExt = props.allowedExt || defaultAllowedExt

        if (!allowedExt.includes(ext.toLowerCase())) {
          return res.status(400).json({
            code: 400,
            message: `Only ${allowedExt.join(', ')} ext are allowed`,
          })
        }

        const slugFilename = slugify(filename, {
          replacement: '_',
          lower: true,
        })
        const newFilename = [Date.now(), slugFilename].join('-')
        const filepath = path.join(tmpdir, newFilename)
        console.log(
          `Handling file upload field ${fieldname}: ${newFilename} (${filepath})`
        )

        // limit file
        file.on('limit', () => {
          file.resume()

          // remove file
          console.log(`file ${filepath} has been deleted`)
          fs.unlinkSync(filepath)

          return res.status(400).json({
            code: 400,
            message: 'File too large',
          })
        })

        const writeStream = fs.createWriteStream(filepath)
        file.pipe(writeStream)

        // file write
        fileWrite.push(
          new Promise((resolve, reject) => {
            file.on('end', () => writeStream.end())

            writeStream.on('finish', () => {
              fs.readFile(filepath, (err, buffer) => {
                if (err) {
                  return reject(err)
                }

                const filesize = Buffer.byteLength(buffer)
                console.log(`${newFilename} is ${filesize} bytes`)

                files[fieldname] = {
                  fieldname,
                  filename: newFilename,
                  encoding,
                  mimetype,
                  buffer,
                  size: filesize,
                  path: filepath,
                }

                resolve()
              })
            })

            writeStream.on('error', reject)
          })
        )
      })

      busboy.on('finish', () => {
        Promise.all(fileWrite)
          .then(() => {
            req.body = fields
            req.files = files

            next()
          })
          .catch((err) => console.log(err))
      })

      busboy.end(req.rawBody)
    } else {
      next()
    }
  }
}

export default BusboyParser
