import type Client from '../../Client'
import type Guild from '../Guild'
import type { ChannelTypeDef } from '../../types/Types'
import BaseChannel from './BaseChannel'

class GuildChannel extends BaseChannel {
  constructor (
    _id: string,
    _client: Client,
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
    super(_client, _id, _name, _type)
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
}

export default GuildChannel
