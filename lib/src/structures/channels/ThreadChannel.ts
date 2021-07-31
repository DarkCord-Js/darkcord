import type Bot from '../../Bot'
import Collection from '../../collection/Collection'
import { EndPoints } from '../../constants/Constants'
import type { ChannelTypeDef } from '../../types/Types'
import Resolve from '../../util/Resolve'
import CacheManager from '../../managers/CacheManager'
import type Guild from '../Guild'
import Member from '../Member'
import GuildChannel from './GuildChannel'

interface editOptions {
    name?: string;
    archived: boolean;
    autoArchiveDuration: number;
    locked: boolean;
    rateLimitPerUser?: number;
}

class ThreadChannel extends GuildChannel {
    members: Collection<string, Member>
    constructor (
      _id: string,
      _bot: Bot,
      _type: ChannelTypeDef,
      _name: string,
      _lastMessageId: string,
      _lastPinTimestamp: Date,
      _position: number,
      _parentId: string,
      _topic: string,
      _guild: Guild,
      _permissionOverwrites: any[],
      _nsfw: boolean,
      _rateLimitPerUser: number,
      private _threadMetadata: any
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

      this.members = new Collection()
    }

    get metadata () {
      return {
        archived: this._threadMetadata.archived,
        autoArchiveDuration: this._threadMetadata.auto_archive_duration,
        archiveTimestamp: this._threadMetadata.archive_timestamp,
        locked: this._threadMetadata.locked
      }
    }

    get archivedAt () {
      return new Date(this.metadata.archiveTimestamp)
    }

    get threadMembers () {
      return this.members
    }

    async join () {
      await this.bot.requestHandler('PUT', `${EndPoints.channels}/${this.id}/${EndPoints.thread_members}/@me`)
      return this
    }

    async leave () {
      await this.bot.requestHandler('DELETE', `${EndPoints.channels}/${this.id}/${EndPoints.thread_members}/@me`)
      return this
    }

    async edit (options: editOptions) {
      let newThreadChannel = await this.bot.requestHandler('PATCH', `${EndPoints.channels}/${this.id}`, {
        name: options.name ?? this.name,
        archived: options.archived,
        auto_archive_duration: options.autoArchiveDuration,
        rate_limit_per_user: options.rateLimitPerUser ?? this.rateLimitPerUser,
        locked: options.locked
      })

      const resolve = new Resolve(this.bot)
      newThreadChannel = resolve.resolveThreadChannel(newThreadChannel)
      new CacheManager(this.bot).manage('channels', this.id, newThreadChannel)
    }
}

export default ThreadChannel
