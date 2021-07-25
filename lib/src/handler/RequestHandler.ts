import { Constants } from '../constants/Constants'
import type Bot from '../Bot'
import fetch from 'node-fetch'

async function RequestHandler (client: Bot, headers: any, method: string, endpoint: string, data?: any) {
  const init: any = {
    method,
    headers
  }

  if (data) {
    init.body = typeof data === 'string' ? data : JSON.stringify(data)
  }

  const req = await fetch(`${Constants.API}${endpoint.startsWith('/') ? `${endpoint}` : `/${endpoint}`}`, init)

  try {
    return await req.json()
  } catch {
    return req
  }
}

export default RequestHandler
