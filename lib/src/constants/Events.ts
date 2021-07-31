export enum Events {
    DEBUG = 'debug',
    READY = 'ready',
    MESSAGE_CREATE = 'message',
    MESSAGE_UPDATE = 'messageUpdate',
    MESSAGE_REACTION_ADD = 'reaction',
    MESSAGE_REACTION_REMOVE = 'reactionRemove',
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    SHARD_READY = 'shardReady',
    GUILD_CREATE = 'guildCreate',
    GUILD_DELETE = 'guildDelete',
    GUILD_UPDATE = 'guildUpdate',
    GUILD_BAN_ADD = 'guildBan',
    GUILD_BAN_REMOVE = 'guildBanRemove',
    HELLO = 'hello',
    INTERACTION_CREATE = 'interaction',
    VOICE_STATE_UPDATE = 'voiceStateUpdate',
    GUILD_MEMBER_UPDATE = 'memberUpdate',
    GUILD_MEMBER_ADD = 'memberAdd',
    GUILD_MEMBER_REMOVE = 'memberRemove',
    GUILD_ROLE_CREATE = 'roleCreate',
    GUILD_ROLE_UPDATE = 'roleUpdate',
    GUILD_ROLE_DELETE = 'roleDelete',
    MESSAGE_DELETE = 'messageDelete',
    MESSAGE_DELETE_BULK = 'messageBulkDelete',
    MESSAGE_REACTION_REMOVE_ALL = 'reactionRemoveAll',
    MESSAGE_REACTION_REMOVE_EMOJI = 'reactionRemoveEmoji',
    TYPING_START = 'typing'
}
