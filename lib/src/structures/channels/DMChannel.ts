import BaseChannel from './BaseChannel'
import type { ChannelTypeDef, MessageContent } from '../../types/Types'
import type Bot from '../../Bot'
import Collection from '../../collection/Collection'
import type Message from '../Message'
import { MessageOptions } from '../../types/Interfaces'
import Embed from '../Embed'
import Resolve from '../../util/Resolve'

class DMChannel extends BaseChannel {
    private _messages: Collection<string, Message> = new Collection();
    private resolve: Resolve;
    constructor (
      _id: string,
      _bot: Bot,
      _type: ChannelTypeDef,
      _lastMessageId: string,
      _lastPinTimestamp: Date,
      _name: string,
      _position: number
    ) {
      super(_bot, _id, _name, _type)

      this.resolve = new Resolve(_bot)
    }

    get messages (): Collection<string, Message> {
      return this._messages
    }

    async sendMessage (content: MessageContent) {
      if (typeof content === 'string') {
        const body: MessageOptions = { content }
        const res = await this.bot.rest.createMessage(body, this.id)
        return await this.resolve.resolveMessage(res)
      }

      if (content instanceof Embed) {
        const options: MessageOptions = {
          embeds: [content]
        }

        const res = await this.bot.rest.createMessage(options, this.id)
        return await this.resolve.resolveMessage(res)
      }

      const res = await this.bot.rest.createMessage(content, this.id)
      return await this.resolve.resolveMessage(res)
    }
}

export default DMChannel
