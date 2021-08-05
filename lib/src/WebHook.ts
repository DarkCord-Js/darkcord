import EventEmitter from 'events'
import fetch from 'node-fetch'
import { Constants } from './constants/Constants'
import { headers } from './constants/PayLoads'
import RequestHandler from './handler/RequestHandler'
import RestAPI from './rest/RestAPI'
import Embed from './structures/Embed'
import { MessageOptions } from './types/Interfaces'
import type { MessageContent, requestTypes } from './types/Types'

/* Danger */
class Webhook extends EventEmitter {
    id: string
    token: string
    guildId?: string
    channelId?: string
    avatar?: string
    name?: string
    applicationId?: string
    rest: RestAPI
    constructor (public url: string) {
      super()
      const urlMatch = url.match(/^https?:\/\/(?:canary|ptb)?\.?discord\.com\/api\/webhooks(?:\/v[0-9]\d*)?\/([^\\/]+)\/([^\\/]+)/i)!

      if (urlMatch.length <= 1) throw new Error('Invalid webhook url.')

      this.rest = new RestAPI(this)
      this.id = urlMatch[1]
      this.token = urlMatch[2];

      (async () => {
        const res = await (await fetch(`${Constants.API}/webhooks/${this.id}/${this.token}`)).json()

        const setProperty = (key: string, value: any) => {
          Object.defineProperty(this, key, { value, writable: false })
        }

        for (let [key, value] of Object.entries(res)) {
          const split = key.split('_')

          key = split[1] ? `${split[0]}${split[1].toUpperCase().replace('D', 'd')}` : split[0]
          setProperty(key, value)
        }
      }).call(this)
    }

    async requestHandler (method: requestTypes, endpoint: string, data?: any) {
      headers.Authorization = this.token
      return await RequestHandler(this, headers, method, endpoint, data)
    }

    async execute (content: MessageContent) {
      const sendMessage = async (body: any) => {
        const req = await fetch(`${Constants.API}/webhooks/${this.id}/${this.token}`, {
          method: 'POST',
          body
        })

        const res = await req.json()

        console.log(res)
        return {
          id: <string>res.id
        }
      }

      if (typeof content === 'string') {
        const body: MessageOptions = { content }
        return await sendMessage(body)
      }

      if (content instanceof Embed) {
        const body: MessageOptions = {
          embeds: [content]
        }

        return await sendMessage(body)
      }

      content = <MessageOptions>content
      const contentResolvable: any = content
      if (content.messageReference) {
        contentResolvable.message_reference = {
          guild_id: content.messageReference.guildId,
          channel_id: content.messageReference.channelId,
          message_id: content.messageReference.messageId
        }
      }

      if (content.allowedMentions) {
        contentResolvable.allowed_mentions = {
          roles: content.allowedMentions.roles,
          users: content.allowedMentions.users,
          replied_user: content.allowedMentions.repliedUser
        }
      }

      return await sendMessage(contentResolvable)
    }
}
export default Webhook
