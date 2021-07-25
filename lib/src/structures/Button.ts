import type { ButtonOptions, Partial_Emoji } from '../types/Interfaces'
import parseEmoji from '../util/ParseEmoji'
import { resolveParseEmoji } from '../util/Resolve'
import Emoji from './Emoji'

type style = 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link'
type styleNumber = 1 | 2 | 3 | 4 | 5

class Button {
  type: number = 2
  style: number = 1
  label?: string
  emoji?: string | Partial_Emoji
  url?: string
  custom_id?: string
  disabled: boolean = false
  constructor (private options?: ButtonOptions) {
    this.buildButton
  }

  setLabel (label: string) {
    this.label = label
    return this
  }

  setEmoji (emoji: string | Emoji | Partial_Emoji) {
    if (typeof emoji === 'string') {
      emoji = <Partial_Emoji>resolveParseEmoji(emoji)
    }

    if (emoji instanceof Emoji) {
      emoji = <Partial_Emoji>parseEmoji(emoji)
    }

    this.emoji = emoji
    return this
  }

  setCustomId (customId: string) {
    if (this.style === 5) throw new Error('Link buttons do not use custom id')
    this.custom_id = customId
    return this
  }

  setURL (url: string) {
    this.url = url
    return this
  }

  setDisabled (disabled: boolean) {
    this.disabled = disabled
    return this
  }

  setStyle (style: style | styleNumber) {
    if (typeof style === 'string') {
      this.style = this.resolveStyle(style)
    } else {
      this.style = style
    }
    return this
  }

  resolveStyle (style: style): number {
    switch (style) {
      case 'Primary':
        return 1
      case 'Secondary':
        return 2
      case 'Success':
        return 3
      case 'Danger':
        return 4
      case 'Link':
        return 5
    }
  }

  private get buildButton () {
    this.style = this.options?.syle ?? 1
    this.disabled = this.options?.disabled ?? false
    return this
  }

  toString () {
    return '[DarkCord<Button>]'
  }
}

export default Button
