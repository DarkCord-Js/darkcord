import { snowflake } from '../types/Types'
import Permissions from '../util/Permissions'

class Role {
  constructor (
        private _id: snowflake,
        private _name: string,
        private _color: number = 0,
        private _hoist: boolean = false,
        private _position: number = 0,
        private _permissions: string,
        private _managed: boolean = false,
        private _mentionable: boolean = false,
        private _permissions_new: string | null
  ) {
    return this
  }

  public get id (): string {
    return this._id
  }

  public get name (): string {
    return this._name
  }

  public get color (): number {
    return this._color
  }

  public get hoist (): boolean {
    return this._hoist
  }

  public get position (): number {
    return this._position
  }

  public get permissions () {
    return new Permissions(this._permissions_new || this._permissions)
  }

  public get managed (): boolean {
    return this._managed
  }

  public get mentionable (): boolean {
    return this._mentionable
  }
}

export default Role
