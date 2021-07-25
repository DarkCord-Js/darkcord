import { Constants, EndPoints } from '../constants/Constants'
import { headers } from '../constants/PayLoads'
import fetch from 'node-fetch'
import Bot from '../Bot'

class Fetch {
  constructor (public client: Bot) {}

  async user (id: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.users}/${id}`)
  }

  async message (channelId: string, messageId: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.channels}/${channelId}/${EndPoints.messages}/${messageId}`)
  }

  async member (guildId: string, memberId: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.guilds}/${guildId}/${EndPoints.members}/${memberId}`)
  }

  async channel (id: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.channels}/${id}`)
  }

  async guild (id: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.guilds}/${id}?with_counts=true`)
  }

  async guilds (): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.guilds}`)
  }

  async guildChannels (id: string): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.guilds}/${id}/${EndPoints.channels}`)
  }

  async guildMembers (id: string, max: number): Promise<any> {
    return this.client.requestHandler('GET', `${EndPoints.guilds}/${id}/${EndPoints.members}?limit=${max}`)
  }
}

export default Fetch
