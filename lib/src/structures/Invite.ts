import Bot from '../Bot'
import Resolve from '../util/Resolve'
import Guild from './Guild'

class Invite {
  constructor (
        private bot: Bot,
        private _code: string,
        private _guild: Guild,
        private _channel: any,
        private _inviter: any,
        private _approximate_presence_count: number,
        private _approximate_member_count: number
  ) {}

  /** Invite code */
  get code () {
    return this._code
  }

  /** Invite Channel */
  get channel () {
    const resolve = new Resolve(this.bot)

    return resolve.resolveChannel(this._channel)
      .then((channel) => channel)
  }

  get inviter () {
    const resolve = new Resolve(this.bot)

    return resolve.resolveUser(this._inviter)
  }

  presenceCount () {
    return this._approximate_presence_count
  }

  memberCount () {
    return this._approximate_member_count
  }
}

export default Invite
