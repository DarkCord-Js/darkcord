import type GuildChannel from '../structures/channels/GuildChannel'
import type TextChannel from '../structures/channels/TextChannel'
import CommandContext from '../structures/command/CommandContext'
import type Guild from '../structures/Guild'
import type Message from '../structures/Message'

export interface Plugin {
    name: string;
    description: string;
    type: 'bot' | 'common';
    startOnReady: boolean;
    exec: (...args: any[]) => void;
}

export interface BotOptions {
    token?: string;
    apiVersion?: number;
    intents?: string[] | number[];
    shardCount?: number;
    timeCount?: boolean;
    plugins?: {
        limit?: number;
        plugins: Plugin[];
    }
    cache?: {
        guilds: boolean;
        users: boolean;
        channels: boolean;
        roles: boolean;
        overwrites: boolean;
        presences: boolean;
        emojis: boolean;
    }
}

export interface BotOptions2 {
    prefix?: string; // Only works in Command Bot
    token?: string;
    apiVersion?: number;
    intents: number;
    shardCount?: number;
    plugins: {
        limit?: number;
        plugins: Plugin[];
    }
    cache: {
        guilds: boolean;
        users: boolean;
        channels: boolean;
        roles: boolean;
        overwrites: boolean;
        presences: boolean;
        emojis: boolean
    }
}

export interface CommandBotOptions extends BotOptions {
    prefix?: string;
}

export interface BotEvents {
    channelCreate: (channel: GuildChannel) => void;
    channelUpdate: (oldChannel: GuildChannel, newChannel: GuildChannel) => void;
    channelDelete: (channel: GuildChannel) => void;
    channelPinsUpdate: (channel: TextChannel, time: Date) => void;
    debug: (...args: any) => void;
    guildCreate: (guild: Guild) => void;
    guildUpdate: (oldGuild: Guild, newGuild: Guild) => void;
    guildDelete: (guild: Guild) => void;
    ready: () => void;
    resumed: () => void;
    message: (message: Message) => void;
}

export interface API_User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot: boolean;
    system: boolean;
    mfa_enabled: boolean;
    locale: boolean;
    verified: boolean;
    flags: number;
    premium_type: number;
    public_flags: number
}

export interface API_Member {
    nick: string;
    joined_at: Date;
    premium_since: Date;
    deaf: boolean;
    muted: boolean;
    user: API_User;
    avatar: string;
    roles: any[]
}

export interface API_Role {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    permissions_new: string | null;
}

export interface Partial_Emoji {
    id: string;
    name?: string;
    roles?: API_Role[];
    user?: API_User;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    avaible?: boolean;
}

export interface ButtonOptions {
    type: number;
    syle: number;
    label?: string;
    emoji?: string | Partial_Emoji;
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}

export interface IOverwrite {
    id: string;
    type: number;
    allow: string;
    deny: string
}

export interface API_Channel {
    name: string;
    type: number;
    bitrate?: number;
    nsfw: boolean;
    parent_id?: string;
    permission_overwrites?: IOverwrite[];
    rate_limit_per_user?: number;
    topic?: string;
    position?: number;
    user_limit?: number
}

export interface API_ChannelCreate {
    name: string;
    type: number;
    topic?: string;
    bitrate?: number;
    user_limit?: number
    parent_id?: string;
    permission_overwrites?: IOverwrite[];
    rate_limit_per_user?: number;
    position?: number;
    reason: string;
    nsfw: boolean
}

export interface API_EmojiCreate {
    name: string;
    image: any;
    roles: string[]
}

export interface MessageOptions {
    content?: string;
    embeds?: any[];
    tts?: boolean;
    components?: any[];
    file?: any
    messageReference?: {
        channelId: string;
        messageId: string;
        guildId?: string;
    },
    allowedMentions?: {
        roles?: boolean;
        users?: boolean;
        repliedUser?: boolean;
    }
}

export interface LavaLinkOptions {
    plugis?: any[],
    autoPlay?: boolean,
    identifier?: string,
    retryDelay?: number,
    clientName?: string,
    clientId?: string,
    requestTimeout?: number,
    retryAmount?: number,
    secure?: boolean
}

export interface CreateInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
}

export interface TextBasedChannel {
    sendMessage (content: string | MessageOptions): any
}

export interface CommandOptions {
    name: string;
    description?: string | any;
    category?: string | any;
    guildOnly?: boolean;
    ownerOnly?: boolean;
    dmOnly?: boolean;
    onlyUsers?: string[];
    ignoreBots?: boolean;
    ignoreUsers?: string[];
    onlyGuilds?: string[];
    ignoreGuilds?: string[];
    examples?: string[]
}

export interface CommandExecute {
    ctx: CommandContext;
    args?: string[]
}
export interface field {
    name: string;
    value: string;
    inline?: boolean
}

export interface EmbedOptions {
    type?: string;
    title?: string;
    description?: string;
    url?: string;
    fields?: field[];
    color?: string;
    timestamp?: number;
    provider?: {
        name: string;
        url?: string
    };
    image?: {
        url: string;
        proxyURL?: string;
        height?: number;
        width?: number
    };
    thumbnail?: {
        url: string;
        proxyURL?: string;
        height?: number;
        width?: number
    };
    video?: {
        url: string;
        proxyURL?: string;
        height?: number;
        width?: number
    };
    footer?: {
        text: string;
        icon?: string
    };
    author?: {
        name: string;
        iconURL?: string;
        url?: string;
        proxyIconURL?: string
    }
}

export interface SelectMenuOptions {
    label: string;
    value: string;
    description?: string;
    emoji?: Partial_Emoji;
    default?: boolean;
}

export interface SlashCommandChoice {
    name: string;
    value: string;
}
export interface SlashCommandOptions {
    type?: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: SlashCommandChoice[];
    options?: SlashCommandOptions[]
}
