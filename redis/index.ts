import * as redis from "redis";
import { RedisClient } from "../types/redis";

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = process.env;

class Redis implements RedisClient {
	private client;
	constructor() {
		this.client = redis.createClient();
		this.connectClient();
	}
	private async connectClient() {
		await this.client.connect();
	}
	public get(key: string) {
		return this.client.get(key);
	}
	public set(key: string, value: string) {
		return this.client.set(key, value);
	}
	public del(key: string) {
		return this.client.del(key);
	}
	public expire(key: string, ttl: number) {
		return this.client.expire(key, ttl);
	}
	public flushAll() {
		this.client.flushAll();
	}
	public keys(pattern: string = "*") {
		return this.client.keys(pattern);
	}
}

export default new Redis();
