/* eslint-disable no-multi-spaces */
type FLAGSTYPE =
'CREATE_INSTANT_INVITE'    |
'KICK_MEMBERS'             |
'BAN_MEMBERS'              |
'ADMINISTRATOR'            |
'MANAGE_CHANNELS'          |
'MANAGE_GUILD'             |
'ADD_REACTIONS'            |
'VIEW_AUDIT_LOG'           |
'PRIORITY_SPEAKER'         |
'STREAM'                   |
'VIEW_CHANNEL'             |
'SEND_MESSAGES'            |
'SEND_TTS_MESSAGES'        |
'MANAGE_MESSAGES'          |
'ATTACH_FILES'             |
'READ_MESSAGE_HISTORY'     |
'MENTION_EVERYONE'         |
'USE_EXTERNAL_EMOJIS'      |
'VIEW_GUILD_INSIGHTS'      |
'CONNECT'                  |
'MUTE_MEMBERS'             |
'DEAFEN_MEMBERS'           |
'MOVE_MEMBERS'             |
'USE_VAD'                  |
'CHANGE_NICKNAME'          |
'MANAGE_NICKNAMES'         |
'MANAGE_ROLES'             |
'MANAGE_WEBHOOKS'          |
'MANAGE_EMOJIS'            |
'USE_APPLICATION_COMMANDS' |
'REQUEST_TO_SPEAK'         |
'MANAGE_THREADS'           |
'USE_PUBLIC_THREADS'       |
'USE_PRIVATE_THREADS'      |
'ALL'

const FLAGS = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_EMOJIS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_THREADS: 1n << 34n,
  USE_PUBLIC_THREADS: 1n << 35n,
  USE_PRIVATE_THREADS: 1n << 36n,
  ALL: 0n
}

FLAGS.ALL = Object.values(FLAGS).reduce((a, p) => a | p, 0n)

class Permissions {
  allow: bigint
  deny: bigint
  constructor (
    allow: string | number | bigint,
    deny: string | number | bigint = '0'
  ) {
    this.allow = typeof allow !== 'bigint' ? BigInt(allow) : allow
    this.deny = typeof deny !== 'bigint' ? BigInt(deny) : deny
  }

  has (permission: FLAGSTYPE | bigint, checkAdm?: boolean) {
    if (typeof permission === 'string') {
      return (checkAdm && this.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) || this.hasPermission(Permissions.FLAGS[permission])
    } else {
      return (checkAdm && this.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) || this.hasPermission(permission)
    }
  }

  private hasPermission (permission: bigint) {
    return !!(this.allow & permission)
  }

  toString () {
    return `[DarkCord<Permissions +${this.allow} -${this.deny}>]`
  }

  static FLAGS = FLAGS
}

export default Permissions
