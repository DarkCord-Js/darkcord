import { Partial_Emoji, SelectMenuOptions } from '../types/Interfaces'
import parseEmoji from '../util/ParseEmoji'
import { resolveParseEmoji } from '../util/Resolve'
import Emoji from './Emoji'

class SelectMenu {
    type?: number = 3
    custom_id?: string
    placeholder?: string
    min_values?: number
    max_values?: number
    options: SelectMenuOptions[] = []
    contructor () {
      return this.createMenu
    }

    setCustomId (customId: string) {
      this.custom_id = customId
      return this
    }

    setPlaceholder (placeholder: string) {
      this.placeholder = placeholder
      return this
    }

    setMinValues (minValues: number) {
      this.min_values = minValues
      return this
    }

    setMaxValues (maxValues: number) {
      this.max_values = maxValues
      return this
    }

    addOption (label: string, value: string, description?: string, emoji?: string | Emoji | Partial_Emoji, _default: boolean = false) {
      if (typeof emoji === 'string') {
        emoji = <Partial_Emoji>resolveParseEmoji(emoji)
      }

      if (emoji instanceof Emoji) {
        emoji = <Partial_Emoji>parseEmoji(emoji)
      }

      if (emoji) {
        if (!emoji?.name) {
          throw new Error('The emoji needs a name.')
        }
      }

      this.options.push({
        label,
        value,
        description,
        emoji,
        default: _default
      })

      return this
    }

    addOptions (...options: SelectMenuOptions[]) {
      for (const option of options) {
        this.options.push(option)
      }
      return this
    }

    private get createMenu () {
      this.type = 3
      return this
    }

    toString () {
      return '[DarkCord<SelectMenu>]'
    }
}

export default SelectMenu
