class Role {
  constructor (
        private _id: string,
        private _name: string,
        private _color: number = 0,
        private _hoist: boolean = false,
        private _position: number = 0,
        private _permissions: number = 0,
        private _managed: boolean = false,
        private _mentionable: boolean = false
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

  public get permissions (): number {
    return this._position
  }

  public get managed (): boolean {
    return this._managed
  }

  public get mentionable (): boolean {
    return this._mentionable
  }
}

export default Role
