import type { EmbedOptions } from '../types/Interfaces'
import type { video, image, thumbnail, author, provider, footer } from '../types/Types'

class Embed {
    public fields: any[] = [];
    public title: string = '';
    public type: string = '';
    public thumbnail: thumbnail = null;
    public image: image = null;
    public video: video = null;
    public author: author = null;
    public provider: provider = null;
    public footer: footer = null;
    public description: string = '';
    public url: string = '';
    public timestamp: number | string = 0;
    constructor (private options?: EmbedOptions) {
      return this.buildEmbed
    }

    addField (name: string, value: string, inline: boolean = false): Embed {
      return this.addFields({ name, value, inline })
    }

    addFields (...fields: any) {
      this.fields.push(...fields)
      return this
    }

    setAuthor (name: string, iconURL?: string, url?: string): Embed {
      this.author = { name, iconURL, url }
      return this
    }

    setFooter (text: string, iconURL?: string) {
      this.footer = { text, iconURL }
      return this
    }

    setImage (url: string) {
      this.image = { url }
      return this
    }

    setDescription (content: string): Embed {
      this.description = content
      return this
    }

    setTitle (content: string): Embed {
      this.title = content
      return this
    }

    setThumbnail (url: string): Embed {
      this.thumbnail = { url }
      return this
    }

    setTimestamp (timestamp: Date | number = Date.now()): Embed {
      if (timestamp instanceof Date) timestamp = timestamp.getTime()
      this.timestamp = timestamp
      return this
    }

    setURL (url: string): Embed {
      this.url = url
      return this
    }

    get buildEmbed (): Embed {
      this.type = this.options?.type ?? 'rich'
      this.title = this.options?.title ?? ''
      this.description = this.options?.description ?? ''
      this.url = this.options?.url ?? ''
      this.timestamp = this.options?.timestamp ?? ''
      this.fields = this.options?.fields ?? []
      this.thumbnail = this.options?.thumbnail ?? null
      this.image = this.options?.image ?? null
      this.video = this.options?.video ?? null
      this.author = this.options?.author ?? null
      this.provider = this.options?.provider ?? null
      this.footer = this.options?.footer ?? null
      return this
    }
}

export default Embed
