import { Manager, PlayerOptions, Structure } from 'erela.js'
import type Bot from '../Bot'
import type Message from '../structures/Message'
import { LavaLinkOptions } from '../types/Interfaces'

/**
 * Credits: BONEE#9999 for helping
 * GitHub: https://github.com/BONEE4
 */
require('./Player')
class Lavalink extends Manager {
  constructor (
    client: Bot,
    host: string,
    port: number,
    password: string,
    options?: LavaLinkOptions
  ) {
    super({
      nodes: [{
        host,
        port,
        password,
        identifier: options?.identifier,
        requestTimeout: options?.requestTimeout ?? 60000
        // retryAmount: options?.retryAmount ?? 5,
        // retryDelay: options?.retryDelay ?? 15000,
        // secure: options?.secure ?? true
      }],
      autoPlay: options?.autoPlay ?? true,
      clientName: options?.clientName ?? client.user?.username ?? 'DarkCord<Bot>',
      send (id, payload) {
        const guild = client.guilds.get(id)
        if (guild) guild.shard?.send(payload)
      }
    })

    if (client.uptime! > 100) {
      this.init(client.user.id)
    } else {
      client.on('ready', () => {
        this.init(client.user.id)
      })
    }

    client.on('raw', (payload) => {
      this.updateVoiceState(payload.d)
    })
  }

  player (
    message: Message,
    selfDeafen: boolean = true,
    selfMute: boolean = false
  ) {
    const player = this.create({
      guild: <string>message.guild?.id,
      voiceChannel: message.member?.voiceState?.channel.id,
      textChannel: message.channel.id,
      selfDeafen,
      selfMute
    })

    player.connect()
    player.setVolume(100)
    return player
  }
}

export default Lavalink
