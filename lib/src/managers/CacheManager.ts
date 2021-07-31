import type Bot from '../Bot'
import { CacheTypes } from '../types/Types'

class CacheManager {
  constructor (public bot: Bot) {}

  manage (type: CacheTypes, key: string, value: any) {
    if (this.bot.options.cache[type]) {
      this.bot[type].set(key, value)
      return true
    } else {
      return false
    }
  }
}

export default CacheManager
