class Collection<K, V> extends Map<K, V> {
  constructor () {
    super()
  }

  map (func: (value: V) => any): V[] {
    const CollectionMap = []
    for (const value of this.values()) {
      CollectionMap.push(func(value))
    }
    return CollectionMap
  }

  filter (func: (value: V) => any): V[] {
    const CollectionFilter = []
    for (const value of this.values()) {
      if (func(value)) {
        CollectionFilter.push(value)
      }
    }
    return CollectionFilter
  }

  find (func: (value: V) => any): V[] {
    const CollectionFind: V[] = []
    for (const value of this.values()) {
      CollectionFind.push(func(value))
    }
    return CollectionFind
  }

  random (): V[] {
    const index = Math.round(Math.random() * this.size)
    const values = this.values()

    for (let i = 0; i < index; ++i) {
      values.next()
    }
    return values.next().value
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
    let name: any = null
    this.forEach((a: any) => {
      if (!name) name = a.name
    })
    return `[Collection<${name}>]`
  }
}

export default Collection
