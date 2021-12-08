export interface RedisClient {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<string | null>;
    del: (key: string) => Promise<number>;
    expire: (key: string, ttl: number) => Promise<boolean>;
    flushAll: () => void;
    keys: (pattern: string) => Promise<string[] | null>;
}