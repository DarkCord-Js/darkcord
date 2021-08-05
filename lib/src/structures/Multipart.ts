class Multipart {
    result: string = ''
    boundary: string = '-----------DarkCordNode'
    constructor () {}

    append (data: [string, any, string]) {
      let str = '\r\n--'
      str += this.boundary + '\r\n'
      str += 'Content-Disposition: form-data; name="' + data[0] + '"'

      if (data[2]) {
        str += '; filename="' + data[2] + '"\r\n'
      }

      if (ArrayBuffer.isView(data[1])) {
        str += 'Content-Type: application/octet-stream'
        if (!(data[1] instanceof Uint8Array)) {
          data[1] = new Uint8Array(data[1].buffer, data[1].byteOffset, data[1].byteLength)
        } else if (typeof data[1] === 'object') {
          str += '\r\nContent-Type: application/json'
          data[1] = Buffer.from(JSON.stringify(data))
        } else {
          data[1] = Buffer.from('' + data)
        }
      }

      str += '\r\n\r\n' + (data[1] instanceof Buffer ? data[1] : Buffer.from(String(data[1]), 'utf-8')).toString('binary')
      this.result += str
    }

    finalize () {
      this.result += '\r\n--' + this.boundary + '--'
      return this
    }
}

export default Multipart
