import type Bot from '../Bot'
import { CacheTypes } from '../types/Types'

class CacheManager {
  constructor (public client: Bot) {}

  manage (type: CacheTypes, key: string, value: any) {
    if (this.client.options.cache[type]) {
      this.client[type].set(key, value)
      return true
    } else {
      return false
    }
  }
}

export default CacheManager
