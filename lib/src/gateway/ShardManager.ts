import Bot from '../Bot'
import Collection from '../collection/Collection'
import Shard from './Shard'
import { Events } from '../constants/Events'

class ShardManager extends Collection<string, Shard> {
  constructor (private bot: Bot) {
    super()
  }

  spawn (id: string) {
    let shard: any = this.get(id)

    if (!shard) {
      try {
        shard = new Shard(id, this.bot)
        this.set(id, shard)
        shard.connect(this.bot.token)
      } catch (err) {
        throw new Error(err)
      }

      shard?.on('ready', () => {
        this.bot.emit(Events.SHARD_READY, shard?.id)
      })
    }
  }
}

export default ShardManager
