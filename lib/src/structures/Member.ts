import Bot from '../Bot'
import { ImageFormat } from '../types/Types'
import User from './User'
import Format from '../util/DFormats'
import Collection from '../collection/Collection'
import Role from './Role'

class Member {
  private _roles: Collection<string, Role>
  constructor (
        private _id: string,
        private bot: Bot,
        private _user: User,
        private _nickname: string,
        private _joinedDate: Date,
        private _boosterSince: Date,
        private _deaf: boolean = false,
        private _muted: boolean = false,
        private _avatar: string,
        private _guildId: string,
        public rolesIds: string[]
  ) {
    this._roles = new Collection()

    return this
  }

  get mention () {
    return Format.createUserMention(this.id)
  }

  get id (): string {
    return this._id
  }

  get nickname (): string {
    return this._nickname
  }

  get permissions () {
    return this.guild?.permissionsOf(this.id)
  }

  get joinedDate (): Date {
    return this._joinedDate
  }

  get boosterSince (): Date {
    return this._boosterSince
  }

  get deaf (): boolean {
    return this._deaf
  }

  get muted (): boolean {
    return this._muted
  }

  get user (): User {
    return this._user
  }

  get avatar (): string {
    return this._avatar
  }

  get guild () {
    return this.bot.guilds.get(this._guildId)
  }

  get voiceState () {
    return this.guild?.voiceStates.get(this.id)
  }

  async ban (reason?: string, days: number = 0) {
    return await this.bot.rest.banMember(this._guildId, this.id, days, reason)
  }

  avatarURL ({ format = 'webp', dynamic = false, size = '128' }: { format: ImageFormat, dynamic: boolean, size: '128' | '2048' }) {
    if (dynamic) format = this.avatar.startsWith('a_') ? 'gif' : format
    return `https://cdn.discordapp.com/guilds/${this._guildId}/users/${this.id}/avatars/${this.avatar}.${format}?${size}`
  }

  get roles () {
    this.findMemberRoles()
    return this._roles
  }

  private findMemberRoles () {
    for (const roleId of this.rolesIds) {
      this.guild?.roles
        .filter((role) => role.id === roleId)
        .forEach((role) => {
          this._roles.set(role.id, role)
        })
    }
  }

  toString () {
    return this.mention
  }
}

export default Member
