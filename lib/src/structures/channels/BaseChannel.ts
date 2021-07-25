import Bot from '../../Bot'
import { ChannelTypeDef } from '../../types/Types'

class BaseChannel {
  constructor (
        protected _client: Bot,
        private _id: string,
        private _name: string,
        private _type: ChannelTypeDef
  ) {
    return this
  }

  public get name (): string {
    return this._name
  }

  public get client (): Bot {
    return this._client
  }

  public get type (): ChannelTypeDef {
    return this._type
  }

  public get id (): string {
    return this._id
  }
}

export default BaseChannel
