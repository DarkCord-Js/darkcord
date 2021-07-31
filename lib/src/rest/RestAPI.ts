import type Bot from '../Bot'
import { headers } from '../constants/PayLoads'
import type { API_ChannelCreate, MessageOptions } from '../types/Interfaces'
import { Constants, EndPoints } from '../constants/Constants'
import Fetch from './Fetch'
import { requestTypes } from '../types/Types'

class RestAPI {
    private _token: string = '';
    public fetch: Fetch;
    private requestHandler: (method: requestTypes, endpoint: string, data?: any) => Promise<any>
    constructor (private bot: Bot) {
      this._token = ''
      this.fetch = new Fetch(this.bot)

      this.requestHandler = this.bot.requestHandler
    }

    async createMessage (options: MessageOptions, id: string): Promise<any> {
      return await this.requestHandler('POST', `${EndPoints.channels}/${id}/${EndPoints.messages}`, options)
    }

    async deleteMessage (channelId: string, messageId: string) {
      return await this.requestHandler('POST', `${EndPoints.channels}/${channelId}/${EndPoints.messages}/${messageId}`)
    }

    async createChannel (guildId: string, options: API_ChannelCreate) {
      return await this.requestHandler('POST', `${EndPoints.guilds}/${guildId}/${EndPoints.channels}`, options)
    }

    async deleteChannel (channelId: string, reason: string) {
      return await this.requestHandler('DELETE', `${Constants.API}/${EndPoints.channels}`, { reason })
    }

    async editMessage (options: MessageOptions, channelId: string, messageId: string) {
      return await this.requestHandler('POST', `${EndPoints.channels}/${channelId}/${EndPoints.messages}/${messageId}`, options)
    }

    async createGuildEmoji (guildId: string, options: API_ChannelCreate) {
      return await this.requestHandler('POST', `${EndPoints.guilds}/${guildId}/${EndPoints.emojis}`, options)
    }

    async deleteGuildEmoji (guildId: string, emojiId: string, reason: string) {
      return await this.requestHandler('DELETE', `${EndPoints.guilds}/${guildId}/${EndPoints.emojis}/${emojiId}`, { reason })
    }

    async banMember (guildId: string, memberId: string, days: number, reason?: string) {
      return await this.requestHandler('PUT', `${EndPoints.guilds}/${guildId}/bans/${memberId}`, {
        delete_message_days: days,
        reason
      })
    }

    set token (token: string) {
      this._token = token
      headers.Authorization = `Bot ${this._token}`
    }
}

export default RestAPI
