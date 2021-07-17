import { Constants, EndPoints } from '../constants/Constants'
import { headers } from '../constants/PayLoads'
import fetch from 'node-fetch'

class Fetch {
  async user (id: string): Promise<any> {
    const res = await fetch(`${Constants.API}/${EndPoints.users}/${id}`, { headers })
    return res.json()
  }

  async message (channelId: string, messageId: string): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.channels}/${channelId}/${EndPoints.messages}/${messageId}`,
            { method: 'GET', headers }
    )

    return res.json()
  }

  async member (guildId: string, memberId: string): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.guilds}/${guildId}/${EndPoints.members}/${memberId}`,
            { headers }
    )

    return res.json()
  }

  async channel (id: string): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.channels}/${id}`,
            { headers }
    )

    return res.json()
  }

  async guild (id: string): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.guilds}/${id}?with_counts=true`,
            { headers }
    )

    return res.json()
  }

  async guilds (): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.guilds}`,
            { headers }
    )

    return res.json()
  }

  async guildChannels (id: string): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.guilds}/${id}/${EndPoints.channels}`,
            { headers }
    )

    return res.json()
  }

  async guildMembers (id: string, max: number): Promise<any> {
    const res = await fetch(
            `${Constants.API}/${EndPoints.guilds}/${id}/${EndPoints.members}?limit=${max}`,
            { headers }
    )

    return res.json()
  }
}

export default Fetch
