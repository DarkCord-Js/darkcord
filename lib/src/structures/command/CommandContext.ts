import Bot from '../../Bot'
import { MessageContent } from '../../types/Types'
import type Message from '../Message'

class CommandContext {
  constructor (private _message: Message, private _bot?: Bot) {}

  /** DarkCord Bot */
  public get bot () {
    return this._bot
  }

  /** Get command Message */
  public get message () {
    return this._message
  }

  /** Get command Channel */
  public get channel () {
    return this.message.channel
  }

  /** Get command author */
  public get author () {
    return this.message.author
  }

  /** Get command member */
  public get member () {
    return this.message.member
  }

  /** Get command guild */
  public get guild () {
    return this.message.guild
  }

  /** Send message to command channel */
  public send (content: MessageContent) {
    return this.message.channel.sendMessage(content)
  }
}

export default CommandContext
