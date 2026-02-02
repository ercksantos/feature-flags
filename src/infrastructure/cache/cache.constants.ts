// Constantes de cache
export const CACHE_KEYS = {
    FLAG: (key: string, env: string) => `flag:${env}:${key}`,
    FLAGS_LIST: (env: string) => `flags:${env}:list`,
    FLAG_RULES: (flagId: string) => `flag:${flagId}:rules`,
} as const;

export const CACHE_TTL = {
    FLAG: 300, // 5 minutos
    FLAGS_LIST: 60, // 1 minuto
    FLAG_RULES: 300, // 5 minutos
} as const;
