import Bot from './src/Bot'
import type { BotOptions, EmbedOptions } from './src/types/Interfaces'
import * as Constants from './src/constants/Constants'
import Intents from './src/util/Intents'
import Collection from './src/collection/Collection'
import BitField from './src/util/BitField'
import Role from './src/structures/Role'
import Member from './src/structures/Member'
import User from './src/structures/User'
import Resolve from './src/util/Resolve'
import Embed from './src/structures/Embed'
import Message from './src/structures/Message'
import Guild from './src/structures/Guild'
import TextChannel from './src/structures/channels/TextChannel'
import Emoji from './src/structures/Emoji'
import BaseChannel from './src/structures/channels/BaseChannel'
import GuildChannel from './src/structures/channels/GuildChannel'
import Shard from './src/gateway/Shard'
import ShardManager from './src/gateway/ShardManager'
import DMChannel from './src/structures/channels/DMChannel'
import CacheManager from './src/managers/CacheManager'
import WebSocket from './src/ws/WebSocket'
import Rest from './src/rest/RestAPI'
import Reaction from './src/structures/Reaction'
import Command from './src/structures/command/Command'
import CommandContext from './src/structures/command/CommandContext'
import BotUser from './src/BotUser'
import Format from './src/util/DFormats'
import Button from './src/structures/Button'
import Components from './src/structures/Components'
import SelectMenu from './src/structures/SelectMenu'

export default {
  Bot,
  WebSocket,
  Constants,
  Intents,
  Collection,
  BitField,
  Role,
  Member,
  User,
  Resolve,
  Embed,
  Message,
  Guild,
  TextChannel,
  BaseChannel,
  GuildChannel,
  DMChannel,
  Emoji,
  Shard,
  ShardManager,
  CacheManager,
  Rest: Rest,
  Reaction,
  Command,
  CommandContext,
  BotUser,
  Format,
  Button,
  Components,
  SelectMenu
}
