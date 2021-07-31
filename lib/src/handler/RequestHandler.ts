import { Constants } from '../constants/Constants'
import type Bot from '../Bot'
import fetch from 'node-fetch'

async function RequestHandler (bot: Bot, headers: any, method: string, endpoint: string, data?: any) {
  const init: any = {
    method,
    headers
  }

  if (data) {
    init.body = typeof data === 'string' ? data : JSON.stringify(data)
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
