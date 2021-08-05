import { Constants } from '../constants/Constants'
import type Bot from '../Bot'
import fetch from 'node-fetch'
import Attachment from '../structures/Attachment'
import path from 'path'
import WebHook from '../WebHook'

async function RequestHandler (bot: Bot | WebHook, headers: any, method: string, endpoint: string, data?: any) {
  const init: any = {
    method,
    headers
  }

  if (data) {
    if ('file' in data) {
      init.headers['Content-Type'] = `multipart/form-data; boundary=${data.file.multi.boundary}`

      if (Array.isArray(data.file)) {
        data.file.forEach((f: Attachment) => {
          const file = f
          const d: any[] = [
            ['file', file.file, file.data.filename || path.basename(<string>file.data.file)]
          ]

          for (const [key, value] of Object.entries(data)) {
            if (key !== 'file') d.push([key, value])
          }
        })

        init.body = data.file[0].multi.finalize().result
      } else {
        const file: Attachment = data.file
        const d: any[] = [
          ['file', file.file, file.data.filename || path.basename(<string>file.data.file)]
        ]

        for (const [key, value] of Object.entries(data)) {
          if (key !== 'file') d.push([key, value])
        }

        d.forEach(data.file.multi.append, data.file.multi)

        init.body = data.file.multi.finalize().result
      }
    } else {
      init.body = typeof data === 'string' ? data : JSON.stringify(data)
    }
  }

  const req = await fetch(`${Constants.API}${endpoint.startsWith('/') ? `${endpoint}` : `/${endpoint}`}`, init)

  try {
    const json = await req.json()

    if (json.message) {
      if (json.errors.guild_id) return json
      else bot.emit('error', json)
    }

    return json
  } catch {
    return req
  }
}

export default RequestHandler
