import Client from '../Client'
import Collection from '../collection/Collection'
import Shard from './Shard'
import { Events } from '../constants/Events'

class ShardManager extends Collection<string, Shard> {
  constructor (private client: Client) {
    super()
  }

  spawn (id: string) {
    let shard: any = this.get(id)

    if (!shard) {
      try {
        shard = new Shard(id, this.client)
        this.set(id, shard)
        shard.connect(this.client.token)
      } catch (err) {
        throw new Error(err)
      }

      shard?.on('ready', () => {
        this.client.emit(Events.SHARD_READY, shard?.id)
      })
    }
  }
}

export default ShardManager
