class Collection<K, V> extends Map<K, V> {
  constructor (
      private baseObject?: object | Function | Record<string, any> | any,
      private limit?: number
  ) {
    super()
  }

  map (func: Function): any[] {
    const CollectionMap = []
    for (const value of this.values()) {
      CollectionMap.push(func(value))
    }
    return CollectionMap
  }

  filter (func: Function): any[] {
    const CollectionFilter = []
    for (const value of this.values()) {
      if (func(value)) {
        CollectionFilter.push(value)
      }
    }
    return CollectionFilter
  }

  find (func: Function): any[] {
    const CollectionFind = []
    for (const value of this.values()) {
      CollectionFind.push(func(value))
    }
    return CollectionFind
  }

  random (): any[] {
    const index = Math.round(Math.random() * this.size)
    const values = this.values()

    for (let i = 0; i < index; ++i) {
      values.next()
    }
    return values.next().value
  }

  add (obj: Record<any, any> | any, extra?: any, replace?: any) {
    const existing = this.get(obj.id)

    // Ifs
    if (this.limit === 0) {
      return (
        obj instanceof this.baseObject || obj?.constructor.name === this.baseObject.name
      )
        ? obj
        : new this.baseObject(extra, replace)
    }

    if (obj.id == null) throw new Error('Missing object id')

    if (existing && !replace) return existing

    if (this.limit && this.size > this.limit) {
      const keys = this.keys()
      while (this.size > this.limit) {
        this.delete(keys.next().value)
      }
    }
    return obj
  }

  update (obj: Record<any, any> | any, extra?: any, replace?: any) {
    const item = this.get(obj.id)

    if (!obj.id && obj.id !== 0) throw new Error('Missing object id')

    if (!item) return this.add(obj, extra, replace)

    // @ts-ignore
    item.update(obj, extra)
    return item
  }

  every (func: Function): boolean {
    for (const value of this.values()) {
      if (func(value)) {
        return false
      }
    }
    return true
  }

  some (func: Function): boolean {
    for (const value of this.values()) {
      if (func(value)) {
        return true
      }
    }
    return false
  }

  remove (obj: Record<any, any>): V | null {
    const objItem = this.get(obj.id)
    if (!objItem) {
      return null
    }
    this.delete(obj)
    return objItem
  }

  toJSON () {
    const json: Record<string, any> = {}
    for (const value of this.values()) {
      // @ts-ignore
      json[value.id] = value
    }
    return json
  }

  toString () {
    return `[Collection<${this.baseObject?.name}>]`
  }
}

export default Collection
