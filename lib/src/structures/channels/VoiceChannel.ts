import Bot from '../../Bot'
import { ChannelTypeDef, snowflake } from '../../types/Types'
import Resolve from '../../util/Resolve'
import Guild from '../Guild'
import BaseChannel from './BaseChannel'

class VoiceChannel extends BaseChannel {
  constructor (
    _bot: Bot,
    _id: string,
    _name: string,
    _type: ChannelTypeDef,
    public guild: Guild,
    public bitrate: number,
    private rtc_region: string,
    private user_limit: number,
    private user_id: snowflake
  ) {
    super(
      _bot,
      _id,
      _name,
      _type
    )
  }

  get userId () {
    return this.user_id
  }

  get rtcRegion () {
    return this.rtc_region
  }

  get userLimit () {
    return this.user_limit
  }

  get channel () {
    return this.bot.getChannel(this.id).then((channel) => {
      return channel
    })
  }
}

export default VoiceChannel
