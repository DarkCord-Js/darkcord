import Bot from '../Bot'
import { EndPoints } from '../constants/Constants'
import { snowflake } from '../types/Types'
import VoiceChannel from './channels/VoiceChannel'
import Guild from './Guild'
import Member from './Member'

const defaultApplications = {
  youtube: '755600276941176913',
  poker: '755827207812677713',
  betrayal: '773336526917861400',
  fishing: '814288819477020702',
  chessdev: '832012586023256104',
  chess: '832012774040141894'
  // 'zombsroyale': '519338998791929866'  // Note : First package to offer ZombsRoyake.Io, any other package offering it will be clearly inspired by it, thanks to https://github.com/LilDerp-IsBetter thanks to whom i got the ZombsRoyale.io ID
}

class VoiceState {
  bot: Bot
  id: snowflake
  userId: snowflake
  constructor (
        public guild: Guild,
        private _channel: VoiceChannel,
        private user_id: snowflake,
        private _member: Member | null,
        public suppress: boolean,
        private session_id: snowflake,
        private self_mute: boolean,
        private self_deaf: boolean,
        public deaf: boolean,
        public mute: boolean
  ) {
    this.bot = this.guild.bot
    this.id = this.channel.id
    this.userId = this.user_id
  }

  get member () {
    return this._member || this.bot.guilds.get(this.guild.id)?.members.get(this.id) || null
  }

  get channel () {
    return this._channel
  }

  get sessionId () {
    return this.session_id
  }

  get selfDeaf () {
    return this.self_deaf
  }

  get selfMute () {
    return this.self_mute
  }

  async createActivity (option: keyof (typeof defaultApplications), applications: any = defaultApplications) {
    const data = {
      code: <string><unknown>null,
      toString () { return `https://discord.com/invite/${data.code}` }
    }

    if (option && applications) {
      const appId = applications[option]

      const res = await this.bot.requestHandler('POST',
      `${EndPoints.channels}/${this.channel.id}/${EndPoints.invites}`,
      {
        max_age: 86400,
        max_uses: 0,
        target_application_id: appId,
        target_type: 2,
        temporary: false,
        validate: null
      })

      if (res.error || !res.code) {
        throw new Error(`An error occured while starting ${option} together.\nError: ${res.error}`)
      }

      data.code = `${res.code}`
    } else throw new SyntaxError('Invalid option.')

    return data
  }
}

export default VoiceState
