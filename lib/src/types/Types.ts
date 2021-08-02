import { Events } from '../constants/Events'
import type Embed from '../structures/Embed'
import Intents from '../util/Intents'
import type { MessageOptions } from './Interfaces'

export type bit = string | number | bigint | object | any[];
export type image = { url: string; proxyURL?: string; height?: number; width?: number } | null;
export type thumbnail = { url: string; proxyURL?: string; height?: number; width?: number } | null;
export type video = { url: string; proxyURL?: string; height?: number; width?: number } | null;
export type author = { name: string; iconURL?: string; url?: string, proxyURL?: string } | null;
export type provider = { name: string; url?: string } | null;
export type footer = { text: string; iconURL?: string } | null;
export type EventNoResolvable = keyof (typeof Events);
export type EventResolvable = 'ready' | 'message' | 'reaction' | 'reactionRemove' | 'hello' | 'interaction' | 'guildCreate' | 'guildDelete' | 'guildBan' | 'messageUpdate' | 'guildBanRemove';
export type IntentsType = keyof (typeof Intents)
export type ImageFormat = 'png' | 'jpeg' | 'jpg' | 'webp' | 'gif';
export type CacheTypes = 'channels' | 'users' | 'guilds' | 'emojis';
export type MessageContent = string | MessageOptions | Embed;
export type StyleTimestamp = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';
export type snowflake = `${number}` | string
export type requestTypes = 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'GET' | 'HEAD'
export enum ChannelType {
    TEXT = 0,
    DM = 1,
    VOICE = 2,
    GROUP = 3,
    CATEGORY = 4,
    NEWS = 5,
    STORE = 6,
    NEWS_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    STAGE_VOICE = 13,
    UNKNOWN = -1,
}

export enum ChannelTypeDef {
    TEXT = 'text',
    DM = 'dm',
    VOICE = 'voice',
    GROUP = 'group',
    CATEGORY = 'category',
    NEWS = 'news',
    STORE = 'store',
    NEWS_THREAD = 'newsThread',
    PUBLIC_THREAD = 'publicThread',
    PRIVATE_THREAD = 'privateThread',
    STAGE_VOICE = 'stageVoice',
    UNKNOWN = 'unknown',
}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3
}

export enum InteractionCallType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7
}

export enum InteractionCallTypeDef {
    PONG = 'pong',
    CHANNEL_MESSAGE_WITH_SOURCE = 'channelMessageWithSource',
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 'deferredChannelMessageWithSource',
    DEFERRED_UPDATE_MESSAGE = 'deferredUpdateMessage',
    UPDATE_MESSAGE = 'updateMessage'
}
