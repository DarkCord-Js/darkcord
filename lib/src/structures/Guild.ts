import Collection from '../collection/Collection'
import type Role from './Role'
import Member from './Member'
import type Emoji from './Emoji'
import GuildChannel from './channels/GuildChannel'
import type Bot from '../Bot'
import Resolve from '../util/Resolve'
import VoiceState from './VoiceState'
import { snowflake } from '../types/Types'
import Permissions from '../util/Permissions'

class Guild {
    private _roles: Collection<string, Role>;
    private _members: Collection<string, Member>;
    private _emojis: Collection<string, Emoji>;
    private _channels: Collection<string, GuildChannel>;
    private _voiceStates: Collection<string, VoiceState>

    constructor (
        private _id: string,
        private _bot: Bot,
        private _name: string,
        private _icon: string,
        private _description: string,
        private _splash: string,
        private _discoverySplash: string,
        private _features: any[],
        private _banner: string,
        private _ownerId: string,
        private _applicationId: string,
        private _region: string,
        private _afkChannelId: string,
        private _afkTimeout: string,
        private _systemChannelId: string,
        private _widgetEnabled: boolean,
        private _widgetChannelId: string,
        private _verificationLevel: number,
        private _defaultMessageNotifications: number,
        private _mfaLevel: number,
        private _explicitContentFilter: number,
        private _maxPresences: number,
        private _maxMembers: number,
        private _maxVideoChannelUsers: number,
        private _vanityUrl: string,
        private _premiumTier: number,
        private _premiumSubscriptionCount: number,
        private _systemChannelFlags: number,
        private _preferredLocale: string,
        private _rulesChannelId: string,
        private _publicUpdatesChannelId: string,
        private _embedEnabled: boolean,
        private _embedChannelId: string,
        private _stickers: any[],
        private _nsfw_level: number,
        private _memberCount: number,
        private _presenceCount: number
    ) {
      this._roles = new Collection()
      this._members = new Collection()
      this._emojis = new Collection()
      this._channels = new Collection()
      this._voiceStates = new Collection()
    }

    get shard () {
      const shardId = this.bot.guildShards.get(this.id)
      return this.bot.shards.get(shardId || '0')
    }

    get roles (): Collection<string, Role> {
      return this._roles
    }

    set roles (roles: Collection<string, Role>) {
      this._roles = roles
    }

    get emojis (): Collection<string, Emoji> {
      return this._emojis
    }

    set emojis (emojis: Collection<string, Emoji>) {
      this._emojis = emojis
    }

    get channels (): Collection<string, GuildChannel> {
      return this._channels
    }

    set channels (channels: Collection<string, GuildChannel>) {
      this._channels = channels
    }

    get name () {
      return this._name
    }

    get defaultMessageNotifications (): number {
      return this._defaultMessageNotifications
    }

    get members (): Collection<string, Member> {
      return this._members
    }

    get systemChannelFlags (): number {
      return this._systemChannelFlags
    }

    get region (): string {
      return this._region
    }

    set members (members: Collection<string, Member>) {
      this._members = members
    }

    get id (): string {
      return this._id
    }

    get icon (): string {
      return this._icon
    }

    get verificationLevel (): number {
      return this._verificationLevel
    }

    get vanityUrl (): string {
      return this._vanityUrl
    }

    get description (): string {
      return this._description
    }

    get splash (): string {
      return this._splash
    }

    get maxMambers (): number {
      return this._maxMembers
    }

    get nsfwLevel (): number {
      return this._nsfw_level
    }

    get afkTimeout (): string {
      return this._afkTimeout
    }

    get maxPresences (): number {
      return this._maxPresences
    }

    get presenceCount (): number {
      return this._presenceCount
    }

    get banner (): string {
      return this._banner
    }

    get discoverySplash (): string {
      return this._discoverySplash
    }

    get explicitContentFilter (): number {
      return this._explicitContentFilter
    }

    get mfaLevel (): number {
      return this._mfaLevel
    }

    get stickers (): any[] {
      return this._stickers
    }

    get boosterSubscriptionCount (): number {
      return this._premiumSubscriptionCount
    }

    get boosterTier (): number {
      return this._premiumTier
    }

    get applicationId (): string {
      return this._applicationId
    }

    get memberCount (): number {
      return this._memberCount
    }

    get bot (): Bot {
      return this._bot
    }

    get rulesChannelId (): string {
      return this._rulesChannelId
    }

    get features (): any[] {
      return this._features
    }

    get voiceStates () {
      return this._voiceStates
    }

    get ownerId (): snowflake {
      return this._ownerId
    }

    permissionsOf (member: snowflake | Member) {
      const _member = member instanceof Member ? member : this.members.get(member)

      if (_member?.id === this.ownerId) {
        return new Permissions(Permissions.FLAGS.ALL)
      } else {
        let permissions = this.roles.get(this.id)?.permissions.allow!

        if (permissions & Permissions.FLAGS.ADMINISTRATOR) {
          return new Permissions(Permissions.FLAGS.ALL)
        }

        _member?.roles.forEach((role) => {
          const _role = this.roles.get(role.id)

          const allow = _role?.permissions.allow!

          if (allow & Permissions.FLAGS.ADMINISTRATOR) {
            permissions = Permissions.FLAGS.ALL
          } else {
            permissions |= allow
          }
        })

        return new Permissions(permissions!)
      }
    }

    get owner () {
      let owner = this.members.get(this.ownerId)

      if (!owner) {
        const resolve = new Resolve(this.bot)

        async () => {
          const ownerMember = await this.bot.rest.fetch.member(this.id, this.ownerId)
          owner = resolve.resolveMember(ownerMember, this.id)
          this.members.set(this.ownerId, owner)
        }
      }

      return owner
    }

    async rulesChannel (): Promise<GuildChannel> {
      let rulesChannel: GuildChannel = await this._bot.rest.fetch.channel(this._rulesChannelId)
      const resolve = new Resolve(this._bot)
      rulesChannel = await resolve.resolveTextChannel(rulesChannel.id)
      return rulesChannel
    }
}

export default Guild
