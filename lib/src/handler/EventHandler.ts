import Bot from '../Bot'
import { payload } from '../constants/PayLoads'
import Resolve from '../util/Resolve'
import { Events } from '../constants/Events'

class EventHandler {
  private resolve: Resolve;
  private readonly payload: any;
  constructor (private client: Bot, payload: payload) {
    this.resolve = new Resolve(client)

    const { d: event_payload } = payload

    this.payload = event_payload
  }

  async message () {
    const message = await this.resolve.resolveMessage(this.payload)
    this.client.emit(Events.MESSAGE_CREATE, message)
  }

  async guildCreate () {
    const guild = await this.resolve.resolveGuild(this.payload)
    this.client.emit(Events.GUILD_CREATE, guild)
  }

  async guildDelete () {
    this.client.emit(Events.GUILD_DELETE, this.payload.id)
  }

  async guildUpdate () {
    const guild = await this.resolve.resolveGuild(this.payload)
    this.client.emit(Events.GUILD_UPDATE, guild)
  }

  guildBan () {
    const guildId = this.payload.guild_id
    const user = this.resolve.resolveUser(this.payload.user)

    this.client.emit(Events.GUILD_BAN_ADD, guildId, user)
  }

  guildBanRemove () {
    const guildId = this.payload.guild_id
    const user = this.resolve.resolveUser(this.payload.user)

    this.client.emit(Events.GUILD_BAN_REMOVE, guildId, user)
  }

  ready () {
    this.client.emit(Events.READY)
  }

  hello () {
    this.client.emit(Events.HELLO, this.payload.heartbeat_interval)
  }

  async interaction () {
    const interaction = await this.resolve.resolveInteraction(this.payload)
    this.client.emit(Events.INTERACTION_CREATE, interaction)
  }

  async reaction () {
    const reaction = await this.resolve.resolveReaction(this.payload)
    this.client.emit(Events.MESSAGE_REACTION_ADD, reaction)
  }

  async reactionRemove () {
    const reaction = await this.resolve.resolveReaction(this.payload)
    this.client.emit(Events.MESSAGE_REACTION_REMOVE, reaction)
  }

  async messageUpdate () {
    const message = await this.resolve.resolveMessage(this.payload)
    this.client.emit(Events.UPDATE_MESSAGE, message)
  }
}

export default EventHandler
