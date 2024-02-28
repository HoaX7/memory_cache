export interface RedisClient {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<string | null>;
    del: (key: string) => Promise<number>;
    incr: (key: string) => Promise<number>;
    decr: (key: string) => Promise<number>;
    ttl: (key: string) => Promise<number>;
    expire: (key: string, ttl: number) => Promise<boolean>;
    flushAll?: () => void;
    keys?: (pattern: string) => Promise<string[] | null>;
}
export type Props = {
    password?: string;
    username?: string;
    url?: string;
}
export type SocketProps = {
    host?: string;
    port?: number;
}
export type Options = {
    configSet?: {
        parameter: string;
        key: string;
    };
    enablePubSub?: boolean;
}