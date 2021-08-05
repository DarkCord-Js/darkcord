import fs from 'fs'
import fetch from 'node-fetch'
import Multipart from './Multipart'

interface AttachmentData {
  file: Buffer | string;
  filename?: string;
}

class Attachment {
  isBuffer: boolean
  isString: boolean
  multi: Multipart
  file?: Buffer
  constructor (public data: AttachmentData) {
    this.isBuffer = (data.file instanceof Buffer)
    this.isString = (typeof data.file === 'string')
    this.multi = new Multipart()

    if (this.isBuffer) {
      this.file = <Buffer>data.file
    }

    if (this.isString) {
      if (data.file.includes('http' || 'https')) {
        fetch(<string>data.file).then(async (res) => {
          this.file = await res.buffer()
        })
      } else {
        try {
          this.file = fs.readFileSync(data.file)
        } catch {
          throw new Error(`File does not exists: ${data.file}`)
        }
      }
    }
  }
}

export default Attachment
