import GuildChannel from './GuildChannel'

class CategoryChannel extends GuildChannel {
  get children () {
    return this.guild.channels.filter((channel: any) => channel.parentId === this.id)
  }
}

export default CategoryChannel
