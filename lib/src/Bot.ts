import EventEmitter from 'events'
import RestAPI from './rest/RestAPI'
import WebSocket from './ws/WebSocket'
import { Events } from './constants/Events'
import Intents from './util/Intents'
import Collection from './collection/Collection'
import type User from './structures/User'
import type Guild from './structures/Guild'
import type BaseChannel from './structures/channels/BaseChannel'
import type Emoji from './structures/Emoji'
import type { BotOptions, BotOptions2, CommandOptions, Plugin } from './types/Interfaces'
import type { IntentsType } from './types/Types'
import type Message from './structures/Message'
import type Reaction from './structures/Reaction'
import CacheManager from './managers/CacheManager'
import Resolve from './util/Resolve'
import Member from './structures/Member'
import RequestHandler from './handler/RequestHandler'
import BotUser from './BotUser'
import { headers } from './constants/PayLoads'
import type Interaction from './structures/Interaction'
import PluginsManager from './managers/PluginsManager'
declare interface Bot {
  on (event: string | symbol, listener: (...args: any[]) => void): Bot
  on (event: 'message', listener: (message: Message) => void): Bot
  on (event: 'reaction', listener: (reaction: Reaction) => void): Bot
  on (event: 'reactionRemove', listener: (reaction: Reaction) => void): Bot
  on (event: 'ready', listener: () => void): Bot
  on (event: 'guildCreate', listener: (guild: Guild) => void): Bot
  on (event: 'guildDelete', listener: (guildId: string) => void): Bot
  on (event: 'command', listener: (command: CommandOptions) => void): Bot
  on (event: 'hello', listener: (heartbeatInterval: number) => void): Bot
  on (event: 'interaction', listener: (interaction: Interaction) => void): Bot
  on (event: 'debug', listener: (message: string) => void): Bot

  once (event: string | symbol, listener: (...args: any[]) => void): Bot
  once (event: 'message', listener: (message: Message) => void): Bot
  once (event: 'reaction', listener: (reaction: Reaction) => void): Bot
  once (event: 'reactionRemove', listener: (reaction: Reaction) => void): Bot
  once (event: 'ready', listener: () => void): Bot
  once (event: 'guildCreate', listener: (guild: Guild) => void): Bot
  once (event: 'guildDelete', listener: (guildId: string) => void): Bot
  once (event: 'command', listener: (command: CommandOptions) => void): Bot
  once (event: 'hello', listener: (heartbeatInterval: number) => void): Bot
  once (event: 'interaction', listener: (interaction: Interaction) => void): Bot
  once (event: 'debug', listener: (message: string) => void): Bot
}

/** DarkCord Bot */
class Bot extends EventEmitter {
    public rest: RestAPI;
    public token: string = '';
    private startedAt: number | null;
    public options: BotOptions2;
    public users: Collection<string, User>;
    public guilds: Collection<string, Guild>;
    public emojis: Collection<string, Emoji>;
    public channels: Collection<string, BaseChannel>;
    public user: BotUser | any;
    public socket: WebSocket
    public plugins: Record<string, Plugin>
    constructor (private _options?: BotOptions) {
      super()

      this.users = new Collection()
      this.guilds = new Collection()
      this.emojis = new Collection()
      this.channels = new Collection()

      let intents = 0
      if (this._options?.intents) {
        for (const intent of this._options?.intents!) {
          if (typeof intent === 'string') {
            if (Intents[<IntentsType>intent]) {
              intents |= Intents[<IntentsType>intent]
            }
          } else {
            intents |= intent
          }
        }
      }

      this.options = {
        token: this._options?.token,
        apiVersion: this._options?.apiVersion ?? 9,
        intents: intents,
        shardCount: this._options?.shardCount ?? 0,
        plugins: {
          limit: this._options?.plugins?.limit ?? 5,
          plugins: this._options?.plugins?.plugins || []
        },
        cache: {
          guilds: this._options?.cache?.guilds ?? true,
          users: this._options?.cache?.users ?? true,
          roles: this._options?.cache?.roles ?? true,
          channels: this._options?.cache?.channels ?? true,
          presences: this._options?.cache?.presences ?? true,
          overwrites: this._options?.cache?.overwrites ?? true,
          emojis: this._options?.cache?.emojis ?? true
        }
      }

      this.options.plugins.plugins.push({
        name: 'DarkCord Timer Plugin',
        description: 'Plugin darkcord',
        type: 'common',
        startOnReady: true,
        exec: () => {
          if (this._options?.timeCount) {
            const P = ['\u001b[31mD', '\u001b[32mA', '\u001b[33mR', '\u001b[34mK', '\u001b[35mC', '\u001b[36mO', '\u001b[37mR', '\u001b[0mD']
            let x = 0
            let time = 250
            setInterval(() => {
              time += 250
              const timeFormated = `${(time / 1000 / 60).toFixed()}:${(time / 1000 / 60).toFixed()}:${(time / 1000).toFixed()}`
              process.stdout.write(`\r${P[x++]} ${timeFormated} \u001b[30;1mRunning DarkCord ${require('../../../package.json').version}   \u001b[0m`)
              x %= P.length
            }, 250)
          }
        }
      })

      const PluginManager = new PluginsManager(this, this.options.plugins?.limit, this.options.plugins?.plugins)
      PluginManager.loadPlugins()

      this.plugins = PluginManager.plugins
      this.rest = new RestAPI(this)
      this.socket = new WebSocket(this)
      this.token = this.options?.token ?? ''

      this.startedAt = null
    }

    /** Connect bot to Discord API */
    async run (token: string = this.token): Promise<Bot> {
      if (!token) throw new Error('Invalid token.')
      this.token = token = token.replace(/^(Bot|Bearer)/i, '')
      this.rest.token = token

      this.emit(Events.DEBUG, `Token: ${this.token}`)

      headers.Authorization = `Bot ${this.token}`

      await this.socket.connect(this.options.shardCount || 0)
      this.startedAt = Date.now()
      return this
    }

    /** Get bot uptime */
    get uptime (): number | null {
      return this.startedAt ? Date.now() - this.startedAt! : null
    }

    /** Get bot host os */
    get os (): string {
      return `${process.platform}`
    }

    /** Get discord user */
    async getUser (id: string): Promise<User> {
      let user = this.users.get(id)

      if (!user) {
        const userNoResolvable = await this.rest.fetch.user(id)

        const resolve = new Resolve(this)
        user = resolve.resolveUser(userNoResolvable)

        new CacheManager(this).manage('users', id, user)
      }

      return user
    }

    /** Get guild member */
    async getMember (memberId: string, guildId: string): Promise<Member> {
      const memberNoResolvable = await this.rest.fetch.member(guildId, memberId)

      const resolve = new Resolve(this)
      const member = resolve.resolveMember(memberNoResolvable, guildId)

      return member
    }

    /** Get guild */
    async getGuild (id: string) {
      let guild = this.guilds.get(id)

      if (!guild) {
        const guildNoResolvable = await this.rest.fetch.guild(id)

        const resolve = new Resolve(this)

        guild = resolve.resolveGuild(guildNoResolvable)

        new CacheManager(this).manage('guilds', id, guild)
      }

      return guild
    }

    /** Get channel */
    async getChannel (id: string) {
      let channel: any = this.channels.get(id)

      if (!channel) {
        const channelNoResolvable = await this.rest.fetch.channel(id)

        const resolve = new Resolve(this)

        channel = resolve.resolveChannel(channelNoResolvable)

        new CacheManager(this).manage('channels', id, channel)
      }

      return channel
    }

    async requestHandler (method: string, endpoint: string, data?: any) {
      return await RequestHandler(this, headers, method, endpoint, data)
    }

    on (event: string | symbol, listener: (...args: any[]) => void) {
      super.on(event, listener)
      return this
    }

    once (event: string | symbol, listener: (...args: any[]) => void) {
      super.once(event, listener)
      return this
    }
}

export default Bot
