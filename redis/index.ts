import * as redis from "redis";
import { Props, RedisClient } from "../types/redis";

class Redis implements RedisClient {
	private client;
	constructor(props: Props = {}) {
		this.client = redis.createClient(props);
		this.connectClient().catch((e) => console.error("Unable to connect to redis: ", e));
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

export default Redis;
