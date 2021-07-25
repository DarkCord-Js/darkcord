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
      private client: Bot
  ) {
    super()

    this.token = this.client.token
    this.ws = null
  }

  async connect (token?: string) {
    if (token) this.token = token
    this.ws = new WebSocket(Constants.gateway, {

    })
    this.ws.on('open', () => {
      this.emit('connect', this.id)
      this.receivedAck = true
    })
    this.ws.on('message', async (data: Buffer) => {
      try {
        const PayLoad: payload = Erlpack.unpack(data)

        const { t: event, op, d } = PayLoad

        if (d?.user) {
          const clientUser = d.user
          this.client.user = new BotUser(
            clientUser.id,
            clientUser.username,
            clientUser.discriminator,
            clientUser.avatar,
            clientUser.verified,
            clientUser.flags
          )
        }
        switch (op) {
          case 9:
            this.client.emit('error', new TypeError('Invalid gateway.'))
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
              const handler = new EventHandler(this.client, PayLoad)

              const _event = <EventResolvable>Event
              await handler[_event]()
            } catch {
              this.client.emit(Event)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    })
    this.ws.on('error', (err) => this.client.emit('error', err))
    this.ws.on('close', (code, reason) => {
      this.client.emit(Events.DEBUG, `WebSocket Closed:\n${JSON.stringify({ code, reason })}`)
    })
  }

  updateStatus (afk: boolean, game: string, since: number, status: string) {
    const data = Erlpack.pack({
      op: 3,
      d: {
        afk,
        game,
        since,
        status
      }
    })
    this.ws?.send(data)
  }

  private identify (token: string) {
    identify.d.intents = this.client.options.intents
    identify.d.token = token

    const data = Erlpack.pack(identify)
    this.ws?.send(data)
    this.emit('ready')
  }

  private async heartbeat (ms: number) {
    return setInterval(() => {
      this.lastHeartBeatSent = Date.now()
      this.ws?.send(Erlpack.pack(HeartBeat))
      this.client.emit(Events.DEBUG, `HeartBeat Sent:\n${JSON.stringify({
        lastHeartBeatReceived: this.lastHeartBeatReceived,
        lastHeartBeatSent: this.lastHeartBeatSent,
        interval: this.interval,
        timestamp: Date.now()
      })}`)
    }, ms)
  }
}

export default Shard
