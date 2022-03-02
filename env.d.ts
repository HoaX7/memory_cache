declare global {
    namespace NodeJS {
        interface ProcessENV {
            REDIS_PORT: string;
            REDIS_HOST: string;
            REDIS_PASSWORD: string;
            REDIS_USER: string;
        }
    }
}