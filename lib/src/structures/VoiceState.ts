import Bot from '../Bot'
import { snowflake } from '../types/Types'
import VoiceChannel from './channels/VoiceChannel'
import Guild from './Guild'
import Member from './Member'

class VoiceState {
  bot: Bot
  id: any
  channel_id: any
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
    this.id = this.user_id
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
}

export default VoiceState
