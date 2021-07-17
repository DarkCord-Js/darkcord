import { ImageFormat } from './types/Types'

class ClientUser {
  constructor (
        private _id: string,
        private _username: string,
        private _discriminator: string,
        private _avatar: string,
        private _verified: boolean,
        private _flags: number
  ) {
    return this
  }

  public get flags (): number {
    return this._flags
  }

  public get id (): string {
    return this._id
  }

  public get username (): string {
    return this._username
  }

  public get discriminator (): string {
    return this._discriminator
  }

  public get avatar (): string {
    return this._avatar
  }

  public get verified (): boolean {
    return this._verified
  }

  public get tag (): string {
    return `${this.username}#${this.discriminator}`
  }

  public avatarURL ({ format = 'webp', dynamic = false, size = '128' }: { format: ImageFormat, dynamic: boolean, size: '128' | '2048' }) {
    if (dynamic) format = this.avatar.startsWith('a_') ? 'gif' : format

    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}?${size}`
  }
}

export default ClientUser
