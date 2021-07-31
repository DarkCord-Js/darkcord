import EventEmitter from 'events'
import Bot from '../Bot'
import ShardManager from '../gateway/ShardManager'

/** DarkCord WebSocket Manager */
class WsManager extends EventEmitter {
    private shards: ShardManager;
    constructor (private bot: Bot) {
      super()

      this.shards = new ShardManager(this.bot)
    }

    /** Spawn Shards */
    async connect (shards: number) {
      try {
        for (let shard = 0; shard <= shards; ++shard) {
          this.shards.spawn(shard.toString())
        }
      } catch (err) {
        throw new Error(err)
      }
    }
}

export default WsManager
