import Bot from '../../Bot'
import { CommandOptions } from '../../types/Interfaces'
import Message from '../Message'
import CommandContext from './CommandContext'

class Command {
  options: CommandOptions
  static createContext: (obj: { message: Message; bot?: Bot | undefined }) => CommandContext
  constructor (CommandOptions: CommandOptions) {
    /** Command Options */
    this.options = {
      name: CommandOptions.name,
      description: CommandOptions?.description,
      category: CommandOptions?.category,
      guildOnly: CommandOptions?.guildOnly ?? true,
      dmOnly: CommandOptions?.dmOnly ?? false,
      ignoreBots: CommandOptions?.ignoreBots ?? true,
      ignoreUsers: CommandOptions?.ignoreUsers ?? [],
      ignoreGuilds: CommandOptions?.ignoreGuilds ?? [],
      ownerOnly: CommandOptions?.ownerOnly ?? false,
      examples: CommandOptions?.examples
    }
  }

  execute (ctx: CommandContext, args?: string[]) {
    ctx.bot?.emit('command', this.options)
  }
}

Command.createContext = (obj: {
  message: Message,
  bot?: Bot,
}) => {
  return new CommandContext(obj.message, obj.bot)
}

export default Command
