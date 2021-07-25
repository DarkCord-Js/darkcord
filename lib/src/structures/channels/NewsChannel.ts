import { EndPoints } from '../../constants/Constants'
import GuildChannel from './GuildChannel'
import TextChannel from './TextChannel'

class NewsChannel extends TextChannel {
  async addFollower (channel: GuildChannel | TextChannel, reason?: string) {
    return this.client.requestHandler('POST', `${EndPoints.channels}/${channel.id}/${EndPoints.followers}`, {
      webhook_channel_id: channel.id,
      reason
    })
  }
}

export default NewsChannel
