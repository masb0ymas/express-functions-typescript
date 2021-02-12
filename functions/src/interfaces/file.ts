export interface FileAttributes {
  fieldname: string
  filename: string
  encoding: string
  mimetype: string
  path: string
  size: number
  buffer: Buffer
}

export interface FileInstance {
  [key: string]: FileAttributes
}

export interface StringKeys {
  [key: string]: string
}
