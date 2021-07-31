import Bot from './Bot'
import Command from './structures/command/Command'
import Message from './structures/Message'
import { CommandBotOptions, CommandOptions } from './types/Interfaces'

import {
  CommandLoader,
  EventLoader
} from './structures/Loader'
import CommandContext from './structures/command/CommandContext'
import Collection from './collection/Collection'

interface CommandConfig extends CommandOptions {
    exec: (ctx: CommandContext, args?: string[]) => void
}

class CommandBot extends Bot {
  public commands: Collection<string, Command>;
  constructor (options: CommandBotOptions) {
    super(options)

    this.commands = new Collection()
    this.options.prefix = options.prefix

    this.on('message', (message: Message) => {
      if (message.content.startsWith(`${this.options.prefix}`)) {
        const args = message.content.slice(this.options.prefix?.length).trim().split(/ +/)
        const commandName = args.shift()

        const ctx = Command.createContext({
          message,
          bot: this
        })

        this.commands.get(`${commandName}`)?.execute(ctx, args)
      }
    })
  }

  /** Load commands */
  async commandLoader (path?: string) {
    return await CommandLoader(this, path)
  }

  /** Load Events */
  async eventLoader (path?: string) {
    return await EventLoader(this, path)
  }

  registerCommand (config: CommandConfig) {
    class CommandClass extends Command {
      constructor () {
        super(config)
      }

      execute (ctx: CommandContext, args?: string[]) {
        return config.exec(ctx, args)
      }
    }

    const command = new CommandClass()
    this.commands.set(
      command.options.name,
      command
    )
  }
}

export default CommandBot
