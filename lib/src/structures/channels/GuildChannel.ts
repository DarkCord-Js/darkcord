import type Bot from '../../Bot'
import type Guild from '../Guild'
import type { ChannelTypeDef } from '../../types/Types'
import BaseChannel from './BaseChannel'
import { EndPoints } from '../../constants/Constants'
import { CreateInviteOptions } from '../../types/Interfaces'
import Resolve from '../../util/Resolve'

class GuildChannel extends BaseChannel {
  constructor (
    _id: string,
    _bot: Bot,
    _type: ChannelTypeDef,
    _name: string,
        private _lastMessageId: string,
        private _lastPinTimestamp: Date,
        private _position: number,
        private _parentId: string,
        private _topic: string,
        private _guild: Guild,
        private _permissionOverwrites: any[],
        private _nsfw: boolean,
        private _rateLimitPerUser: number
  ) {
    super(_bot, _id, _name, _type)
    return this
  }

  public get lastPinTimestamp (): Date {
    return this._lastPinTimestamp
  }

  public get position (): number {
    return this._position
  }

  public get parentId (): string {
    return this._parentId
  }

  public get topic (): string {
    return this._topic
  }

  public get guild (): Guild {
    return this._guild
  }

  public get nsfw (): boolean {
    return this._nsfw
  }

  public get permissionOverwrites (): any[] {
    return this._permissionOverwrites
  }

  public get lastMessageId (): string {
    return this._lastMessageId
  }

  public get rateLimitPerUser (): number {
    return this._rateLimitPerUser
  }

  set rateLimitPerUser (rate: number) {
    this._rateLimitPerUser = rate
  }

  async delete (timeout?: { timeout: number}) {
    if ('timeout' in timeout!) {
      setTimeout(() => {
        this.delete()
      }, timeout.timeout)
    } else {
      await this.bot.requestHandler('DELETE', `${EndPoints.channels}/${this.id}`)
    }
  }

  public async createInvite (options?: CreateInviteOptions) {
    const optionsResolvable = {
      max_age: options?.maxAge,
      mas_uses: options?.maxUses,
      unique: options?.unique,
      temporary: options?.temporary
    }

    const res = await this.bot.requestHandler('POST', `${EndPoints.channels}/${this.id}/${EndPoints.invites}`, optionsResolvable)

    const resolve = new Resolve(this.bot)

    const channel = await resolve.resolveChannel(await this.bot.rest.fetch.channel(this.id))
    const invite = {
      code: res.code,
      approximatePresenceCount: res.approximate_presence_count,
      approximateMemberCount: res.approximate_member_count,
      inviter: resolve.resolveUser(res.inviter),
      channel
    }

    return invite
  }
}

export default GuildChannel
