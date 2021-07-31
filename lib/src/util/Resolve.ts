import type Bot from '../Bot'
import type { API_Member, API_Role, API_User, Partial_Emoji } from '../types/Interfaces'
import User from '../structures/User'
import Member from '../structures/Member'
import Role from '../structures/Role'
import Guild from '../structures/Guild'
import BaseChannel from '../structures/channels/BaseChannel'
import { ChannelType, ChannelTypeDef, EventNoResolvable, InteractionCallTypeDef } from '../types/Types'
import Message from '../structures/Message'
import TextChannel from '../structures/channels/TextChannel'
import { Events } from '../constants/Events'
import CacheManager from '../managers/CacheManager'
import Emoji from '../structures/Emoji'
import Reaction from '../structures/Reaction'
import ThreadChannel from '../structures/channels/ThreadChannel'
import Interaction from '../structures/Interaction'
import CategoryChannel from '../structures/channels/CategoryChannel'
import parseEmoji from './ParseEmoji'
import Invite from '../structures/Invite'
import VoiceChannel from '../structures/channels/VoiceChannel'
import VoiceState from '../structures/VoiceState'

class Resolve {
  private cache: CacheManager;
  constructor (
        private bot: Bot
  ) {
    this.cache = new CacheManager(this.bot)
    return this
  }

  resolveUser (user: API_User) {
    return new User(
      user?.id,
      user?.username,
      user?.discriminator,
      user?.avatar,
      user?.bot,
      user?.system,
      user?.mfa_enabled,
      user?.locale,
      user?.verified,
      user?.flags,
      user?.premium_type,
      user?.public_flags
    )
  }

  resolveEmoji (emoji: any) {
    const {
      id,
      name,
      roles,
      user,
      require_colons,
      managed,
      animated,
      avaible
    } = emoji

    return new Emoji(
      id,
      name,
      roles,
      user,
      require_colons,
      managed,
      animated,
      avaible
    )
  }

  resolveMember (member: API_Member, guildId: string) {
    const user = this.resolveUser(member.user)

    const {
      nick,
      joined_at,
      premium_since,
      avatar,
      muted,
      deaf,
      roles
    } = member

    const rmember = new Member(
      user.id,
      this.bot,
      user,
      nick,
      joined_at,
      premium_since,
      deaf,
      muted,
      avatar,
      guildId,
      roles
    )

    /* if (roles && roles !== []) {
      for (const role of roles) {
        const guild = rmember.guild
        const rroles = guild?.roles.filter((r) => r.id === role)

        if (rroles) {
          for (const rrole of rroles) {
            rmember.roles.set(rrole.id, rrole)
          }
        }
      }
    } */

    return rmember
  }

  resolveInvite (invite: any) {
    const guild = this.resolveGuild(invite.guild)

    return new Invite(
      this.bot,
      invite.code,
      guild,
      invite.channel,
      invite.inviter,
      invite.approximate_presence_count,
      invite.approximate_member_count
    )
  }

  resolveRole (role: API_Role) {
    return new Role(
      role.id,
      role.name,
      role.color,
      role.hoist,
      role.position,
      role.permissions,
      role.managed,
      role.mentionable,
      role.permissions_new
    )
  }

  resolveGuild (guild: any) {
    const {
      id,
      name,
      icon,
      description,
      splash,
      discovery_splash,
      features,
      approximate_member_count,
      approximate_presence_count,
      emojis,
      stickers,
      banner,
      owner_id,
      application_id,
      region,
      afk_channel_id,
      afk_timeout,
      system_channel_id,
      widget_enabled,
      widget_channel_id,
      verification_level,
      roles,
      embed_channel_id,
      system_channel_flags,
      max_presences,
      mfa_level,
      max_video_channel_users,
      vanity_url_code,
      embed_enabled,
      default_message_notifications,
      rules_channel_id,
      premium_subscription_count,
      max_members,
      premium_tier,
      public_updates_channel_id,
      preferred_locale,
      explicit_content_filter,
      nsfw_level,
      members
    } = guild

    const guildResolvable = new Guild(
      id,
      this.bot,
      name,
      icon,
      description,
      splash,
      discovery_splash,
      features,
      banner,
      owner_id,
      region,
      application_id,
      afk_channel_id,
      afk_timeout,
      system_channel_id,
      widget_enabled,
      widget_channel_id,
      verification_level,
      default_message_notifications,
      mfa_level,
      explicit_content_filter,
      max_presences,
      max_members,
      max_video_channel_users,
      vanity_url_code,
      premium_tier,
      premium_subscription_count,
      system_channel_flags,
      preferred_locale,
      rules_channel_id,
      public_updates_channel_id,
      embed_enabled,
      embed_channel_id,
      stickers,
      nsfw_level,
      approximate_member_count,
      approximate_presence_count
    )

    if (roles) {
      for (const role of roles) {
        const rrole = this.resolveRole(role)
        guildResolvable.roles.set(rrole.id, rrole)
      }
    }

    if (emojis) {
      for (const emoji of emojis) {
        const remoji = this.resolveEmoji(emoji)
        guildResolvable.emojis.set(remoji.id, remoji)
      }
    }

    if (members) {
      for (const member of members) {
        const rmember = this.resolveMember(member, id)
        guildResolvable.members.set(rmember.user.id, rmember)
      }
    }

    return guildResolvable
  }

  async resolveTextChannel (channel: any) {
    const bot = this.bot
    const {
      id,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild_id,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    } = channel

    let guild: Guild | any = bot.guilds.get(guild_id)

    if (!guild) {
      guild = await bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild.id, guild)
    }

    return new TextChannel(
      id,
      bot,
      type,
      last_message_id,
      last_pin_timestamp,
      name,
      position,
      parent_id,
      topic,
      guild,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    )
  }

  async resolveThreadChannel (channel: any) {
    const {
      id,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild_id,
      permission_overwrites,
      nsfw,
      rate_limit_per_user,
      thread_metadata
    } = channel

    let guild: Guild | any = this.bot.guilds.get(guild_id)

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild.id, guild)
    }

    return new ThreadChannel(
      id,
      this.bot,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild,
      permission_overwrites,
      nsfw,
      rate_limit_per_user,
      thread_metadata
    )
  }

  async resolveReaction (reaction: any) {
    const {
      user_id,
      channel_id,
      message_id,
      guild_id
    } = reaction

    let user = this.bot.users.get(user_id)
    let guild = this.bot.guilds.get(guild_id)
    let channel = this.bot.channels.get(channel_id)
    const emoji = this.resolveEmoji(reaction.emoji)

    let member
    if (reaction.member) {
      member = this.resolveMember(reaction.member, guild_id)
    }

    if (!user) {
      user = await this.bot.rest.fetch.user(user_id)
      user = this.resolveUser(<any>user)
      this.cache.manage('users', user_id, user)
    }

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild_id, guild)
    }

    if (!channel) {
      channel = await this.bot.rest.fetch.channel(channel_id)
      channel = await this.resolveTextChannel(channel)
      this.cache.manage('channels', channel_id, channel)
    }

    let message = await this.bot.rest.fetch.message(channel_id, message_id)
    message = this.resolveMessage(message)

    return new Reaction(
      user,
      <TextChannel>
      channel,
      message,
      guild,
      emoji,
      member
    )
  }

  async resolveCategoryChannel (channel: any) {
    const {
      id,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild_id,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    } = channel

    let guild: Guild | any = this.bot.guilds.get(guild_id)

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild.id, guild)
    }

    return new CategoryChannel(
      id,
      this.bot,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    )
  }

  async resolveNewsChannel (channel: any) {
    const {
      id,
      type,
      name,
      last_message_id,
      last_pin_timestamp,
      position,
      parent_id,
      topic,
      guild_id,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    } = channel

    let guild: Guild | any = this.bot.guilds.get(guild_id)

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild.id, guild)
    }

    return new TextChannel(
      id,
      this.bot,
      type,
      last_message_id,
      last_pin_timestamp,
      name,
      position,
      parent_id,
      topic,
      guild,
      permission_overwrites,
      nsfw,
      rate_limit_per_user
    )
  }

  async resolveVoiceChannel (channel: any) {
    let guild: Guild | any = this.bot.guilds.get(channel.guild_id)

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(channel.guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild.id, guild)
    }

    return new VoiceChannel(
      this.bot,
      channel.id,
      channel.name,
      channel.type,
      guild,
      channel.bitrate,
      channel.rtc_region,
      channel.user_limit,
      channel.user_id
    )
  }

  async resolveVoiceState (voiceState: any) {
    const channel = await this.bot.getChannel(voiceState.channel_id)

    const member = this.resolveMember(voiceState.member, channel.guild.id)

    return new VoiceState(
      channel.guild,
      channel,
      voiceState.user_id,
      member,
      voiceState.suppress,
      voiceState.session_id,
      voiceState.self_mute,
      voiceState.self_deaf,
      voiceState.deaf,
      voiceState.mute
    )
  }

  async resolveChannel (channel: any) {
    switch (channel.type) {
      case 0:
        return await this.resolveTextChannel(channel)
      case 1:
        return await this.resolveTextChannel(channel)
      case 2:
        return await this.resolveVoiceChannel(channel)
      case 3:
        return await this.resolveTextChannel(channel)
      case 4:
        return await this.resolveCategoryChannel(channel)
      case 5:
        return await this.resolveNewsChannel(channel)
      default:
        return null
    }
  }

  async resolveInteraction (interaction: any) {
    const { guild_id } = interaction

    let guild = this.bot.guilds.get(guild_id)

    if (!guild) {
      guild = await this.bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
      this.cache.manage('guilds', guild_id, guild)
    }

    const channel = await this.resolveChannel(await this.bot.rest.fetch.channel(interaction.channel_id))

    let member
    if ('member' in interaction) {
      member = await this.resolveMember(interaction.member, guild.id)
    }

    let author
    if ('user' in interaction) {
      author = await this.resolveUser(interaction.user)
    }

    let message
    if ('message' in interaction) {
      message = await this.resolveMessage(interaction.message)
    }

    return new Interaction(
      this.bot,
      interaction.token,
      interaction.version,
      interaction.id,
      interaction.application_id,
      interaction.type,
      guild,
      <any>channel,
      interaction.data,
      <any>member,
      <any>author,
      <any>message
    )
  }

  async resolveMessage (message: any) {
    const bot = this.bot
    const {
      channel_id,
      guild_id,
      author,
      embeds
    } = message

    let channel: BaseChannel | any = bot.channels.get(channel_id)
    let guild: Guild | any = bot.guilds.get(guild_id)
    let user: User | any = bot.users.get(author?.id)
    let member = guild?.members?.get(author?.id)

    if (!channel) {
      channel = await bot.rest.fetch.channel(channel_id)
    }

    const type: ChannelType = getChannelType(channel.type)
    if (type === ChannelType.DM) {
      return null
    }

    const typeDef: ChannelTypeDef = getChannelTypeDef(channel.type)

    if (typeDef === 'text') {
      channel = await this.resolveTextChannel(channel)
    }

    this.cache.manage('channels', channel.id, channel)

    if (!guild) {
      guild = await bot.rest.fetch.guild(guild_id)
      guild = this.resolveGuild(guild)
    }

    this.cache.manage('guilds', guild.id, guild)

    if (!user) {
      user = await bot.rest.fetch.user(author?.id)
      user = this.resolveUser(user)
    }

    this.cache.manage('users', user.id, user)

    if (!member) {
      member = await bot.rest.fetch.member(guild_id, author?.id)
      member = this.resolveMember(member, guild_id)

      guild?.members?.set(member.user.id, member)
    }

    const resolvableMessage: Message = this.resolveMessageInstance(message, bot, channel, guild, user, member)

    resolvableMessage.embeds = embeds
    return resolvableMessage
  }

  resolveMessageInstance (
    message: any,
    bot: Bot,
    channel: TextChannel,
    guild: Guild,
    user: User,
    member: Member | null
  ): Message {
    const { id, content, timestamp, edited_timestamp, tts, mention_everyone, nonce, pinned, type } = message
    return new Message(
      bot,
      id,
      channel,
      guild,
      user,
      member,
      content,
      timestamp,
      edited_timestamp,
      tts,
      mention_everyone,
      nonce,
      pinned,
      type
    )
  }
}

export function getChannelType (type: number): ChannelType {
  switch (type) {
    case 0:
      return ChannelType.TEXT
    case 1:
      return ChannelType.DM
    case 2:
      return ChannelType.VOICE
    case 3:
      return ChannelType.DM
    case 4:
      return ChannelType.CATEGORY
    case 5:
      return ChannelType.NEWS
    case 6:
      return ChannelType.STORE
    default:
      return ChannelType.UNKNOWN
  }
}

export function getChannelTypeDef (type: number) {
  switch (type) {
    case 0:
      return ChannelTypeDef.TEXT
    case 1:
      return ChannelTypeDef.DM
    case 2:
      return ChannelTypeDef.VOICE
    case 3:
      return ChannelTypeDef.DM
    case 4:
      return ChannelTypeDef.CATEGORY
    case 5:
      return ChannelTypeDef.NEWS
    case 6:
      return ChannelTypeDef.STORE
    default:
      return ChannelTypeDef.UNKNOWN
  }
}

export function getInteractionType (type: InteractionCallTypeDef) {
  switch (type) {
    case InteractionCallTypeDef.PONG:
      return 1
    case InteractionCallTypeDef.CHANNEL_MESSAGE_WITH_SOURCE:
      return 4
    case InteractionCallTypeDef.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE:
      return 5
    case InteractionCallTypeDef.DEFERRED_UPDATE_MESSAGE:
      return 6
    case InteractionCallTypeDef.UPDATE_MESSAGE:
      return 7
  }
}

export function resolveParseEmoji (emoji: string | Partial_Emoji) {
  if (typeof emoji === 'string') {
    return (/^\d{17,19}$/).test(emoji) ? { name: null, id: emoji } : parseEmoji(emoji)
  }

  const { name, id, animated } = emoji

  if (!name && !id) return null

  return {
    name,
    id,
    animated
  }
}

export function resolveEvents (event: string): Events {
  const ev = <EventNoResolvable>event
  return Events[ev]
}

export default Resolve
