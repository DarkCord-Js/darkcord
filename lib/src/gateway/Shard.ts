import { EventEmitter } from 'events'
import Bot from '../Bot'
import WebSocket from 'ws'
import { Constants } from '../constants/Constants'
import { HeartBeat, identify, payload } from '../constants/PayLoads'
import { Events } from '../constants/Events'
import { resolveEvents } from '../util/Resolve'
import EventHandler from '../handler/EventHandler'
import { EventResolvable } from '../types/Types'
import Erlpack from 'erlpack'
import BotUser from '../BotUser'

let Gateway: string = Constants.gateway

class Shard extends EventEmitter {
  private ws: WebSocket | null
  private receivedAck: boolean = false
  // eslint-disable-next-line no-undef
  private interval: NodeJS.Timeout | number = 0
  private token: string;
  private lastHeartBeatReceived: number = 0;
  private lastHeartBeatSent: number = 0;
  constructor (
      public id: string,
      private bot: Bot
  ) {
    super()

    this.token = this.bot.token
    this.ws = null
  }

  async connect (token?: string) {
    this.bot.shards.set(this.id, this)
    if (token) this.token = token
    if (this.bot.options.apiVersion) {
      Gateway = Gateway.replace('v=9', `v=${this.bot.options.apiVersion?.toString()}`)
    }
    this.ws = new WebSocket(Gateway)

    this.ws.on('open', () => this.onOpen())
    this.ws.on('message', async (data: Buffer) => await this.onMessage(data))
    this.ws.on('error', (err) => this.onErr(err))
    this.ws.on('close', (code, reason) => this.onClose(code, reason))
  }

  updateStatus (afk: boolean, game: string, since: number, status: string) {
    this.send({
      op: 3,
      d: {
        afk,
        game,
        since,
        status
      }
    })
  }

  send (data: any) {
    data = Erlpack.pack(data)
    if (this.ws) return this.ws?.send(data)
    else throw new Error('WebSocket does not exists')
  }

  private onOpen () {
    this.emit('connect', this.id)
    this.receivedAck = true
  }

  private onClose (code: number, reason: string) {
    this.bot.emit(Events.DEBUG, `WebSocket Closed:\n${JSON.stringify({ code, reason })}`)
  }

  private onErr (err: Error) {
    this.bot.emit('error', err)
  }

  async onMessage (data: Buffer) {
    try {
      const PayLoad: payload = Erlpack.unpack(data)
      this.bot.emit('raw', PayLoad)

      const { t: event, op, d } = PayLoad

      if (d?.user) {
        const botUser = d.user
        this.bot.user = new BotUser(
          botUser.id,
          botUser.username,
          botUser.discriminator,
          botUser.avatar,
          botUser.verified,
          botUser.flags
        )
      }
      switch (op) {
        case 9:
          this.bot.emit('error', new TypeError('Invalid gateway.'))
          break
        case 10:
          const { heartbeat_interval } = d

          this.lastHeartBeatReceived = Date.now()
          this.interval = await this.heartbeat(heartbeat_interval)
          this.identify(this.token)
          break
        case 11:
          this.receivedAck = true
          break
      }

      if (event) {
        const Event = resolveEvents(event)
        if (Event) {
          try {
            const handler = new EventHandler(this.bot, PayLoad, this.id)

            const _event = <EventResolvable>Event
            await handler[_event]()
          } catch {
            this.bot.emit(Event)
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  private identify (token: string) {
    identify.d.intents = this.bot.options.intents
    identify.d.token = token

    const data = Erlpack.pack(identify)
    this.ws?.send(data)
    this.emit('ready')
  }

  private async heartbeat (ms: number) {
    return setInterval(() => {
      this.lastHeartBeatSent = Date.now()
      this.ws?.send(Erlpack.pack(HeartBeat))
      this.bot.emit(Events.DEBUG, `HeartBeat Sent:\n${JSON.stringify({
        lastHeartBeatReceived: this.lastHeartBeatReceived,
        lastHeartBeatSent: this.lastHeartBeatSent,
        interval: this.interval,
        timestamp: Date.now()
      })}`)
    }, ms)
  }
}

export default Shard
