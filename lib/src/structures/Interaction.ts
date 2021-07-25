import Bot from '../Bot'
import { EndPoints } from '../constants/Constants'
import { InteractionCallType, InteractionCallTypeDef, InteractionType } from '../types/Types'
import { getInteractionType } from '../util/Resolve'
import GuildChannel from './channels/GuildChannel'
import TextChannel from './channels/TextChannel'
import Embed from './Embed'
import Guild from './Guild'
import Member from './Member'
import Message from './Message'
import User from './User'

class Interaction {
  constructor (
        private client: Bot,
        public token: string,
        public version: number,
        private _id: string,
        private _application_id: string,
        private _type: InteractionType,
        private _guild: Guild,
        private _channel: GuildChannel | TextChannel,
        private _data: any | null,
        private _member: Member | null,
        private _user: User | null,
        private _message: Message | null
  ) {}

  public get guild () {
    return this._guild
  }

  public get id () {
    return this._id
  }

  public get message () {
    return this._message
  }

  public get member () {
    return this._member
  }

  public get author () {
    return this._user
  }

  public get type () {
    return this._type
  }

  public get data () {
    const dat: {
      id: string,
      name: string,
      resolved?: {
        users?: any[],
        members?: any[],
        roles?: any[],
        channels?: any[]
      },
      options?: [{
        name: string,
        type: number,
        value?: number,
        options?: any[]
      }],
      customId: string,
      componentType: number,
      values: string[],
    } = {
      id: this._data.id,
      name: this._data.name,
      resolved: this._data.resolved,
      options: this._data.options,
      customId: this._data.custom_id,
      componentType: this._data.component_type,
      values: this._data.values
    }

    return dat
  }

  public get channel () {
    return this._channel
  }

  public get applicationId () {
    return this._application_id
  }

  public get componentType () {
    return this.data.componentType
  }

  public isCommand () {
    return this.type === InteractionType.APPLICATION_COMMAND
  }

  public isComponent () {
    return this.type === InteractionType.MESSAGE_COMPONENT
  }

  public isButton () {
    return this.componentType === 2
  }

  public isSelectMenu () {
    return this.componentType === 3
  }

  reply (data: string | Embed | any, type: InteractionCallType | InteractionCallTypeDef = 4) {
    if (!data) throw new Error('Reply require data.')

    if (typeof type === 'string') {
      getInteractionType(type)
    }

    if (typeof data === 'string') {
      data = {
        content: data
      }
    }

    if (data instanceof Embed) {
      data = {
        embeds: [data]
      }
    }

    this.client.requestHandler('POST', `${EndPoints.interactions}/${this.id}/${this.token}/${EndPoints.callback}`, {
      type,
      data
    })
  }
}

export default Interaction
