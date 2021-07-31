import { CreateInviteOptions, MessageOptions, TextBasedChannel } from '../../types/Interfaces'
import GuildChannel from './GuildChannel'
import type Guild from '../Guild'
import type { ChannelTypeDef, MessageContent } from '../../types/Types'
import type Bot from '../../Bot'
import Embed from '../Embed'
import Resolve from '../../util/Resolve'
import Collection from '../../collection/Collection'
import Message from '../Message'
import { EndPoints } from '../../constants/Constants'

class TextChannel extends GuildChannel implements TextBasedChannel {
    private _messages: Collection<string, Message> = new Collection();
    private resolve: Resolve;
    _bot: Bot
    constructor (
      _id: string,
      _bot: Bot,
      _type: ChannelTypeDef,
      _lastMessageId: string,
      _lastPinTimestamp: Date,
      _name: string,
      _position: number,
      _parentId: string,
      _topic: string,
      _guild: Guild,
      _permissionOverwrites: any[],
      _nsfw: boolean,
      _rateLimitPerUser: number
    ) {
      super(
        _id,
        _bot,
        _type,
        _name,
        _lastMessageId,
        _lastPinTimestamp,
        _position,
        _parentId,
        _topic,
        _guild,
        _permissionOverwrites,
        _nsfw,
        _rateLimitPerUser
      )

      this._bot = _bot
      this.resolve = new Resolve(this.bot)
    }

    public get messages (): Collection<string, Message> {
      return this._messages
    }

    public get bot (): Bot {
      return this._bot
    }

    public async createInvite (options?: CreateInviteOptions) {
      const optionsResolvable = {
        max_age: options?.maxAge,
        mas_uses: options?.maxUses,
        unique: options?.unique,
        temporary: options?.temporary
      }

      const res = await this.bot.requestHandler('POST', `${EndPoints.channels}/${this.id}/${EndPoints.invites}`, optionsResolvable)
    }

    public async sendMessage (content: MessageContent) {
      if (typeof content === 'string') {
        const body: MessageOptions = { content }
        const res = await this.bot.rest.createMessage(body, this.id)
        res.guild_id = this.guild.id
        return await this.resolve.resolveMessage(res)
      }

      if (content instanceof Embed) {
        const options: MessageOptions = {
          embeds: [content]
        }

        const res = await this.bot.rest.createMessage(options, this.id)
        res.guild_id = this.guild.id
        return await this.resolve.resolveMessage(res)
      }

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

      const res = await this.bot.rest.createMessage(contentResolvable, this.id)
      return await this.resolve.resolveMessage(res)
    }
}

export default TextChannel
