import Bot from '../../Bot'
import { ChannelTypeDef } from '../../types/Types'

class BaseChannel {
  constructor (
        protected _bot: Bot,
        private _id: string,
        private _name: string,
        private _type: ChannelTypeDef
  ) {
    return this
  }

  public get name (): string {
    return this._name
  }

  public get bot (): Bot {
    return this._bot
  }

  public get type (): ChannelTypeDef {
    return this._type
  }

  public get id (): string {
    return this._id
  }
}

export default BaseChannel
