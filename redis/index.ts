import * as redis from "redis";
import { Props, RedisClient, SocketProps } from "../types/redis";

class Redis implements RedisClient {
	private client;
	constructor(props: Props = {}, socketProps: SocketProps = {}) {
		this.client = redis.createClient({
			...props,
			socket: {
				reconnectStrategy: (retries) => {
					if (retries === 3) {
						return new Error("Unable to connect to redis: Connection Timedout")
					}
					console.log("Redis failed to connect, retrying after 5 seconds...")
					return 5000;
				},
				connectTimeout: 60000,
				...socketProps
			},
		});
		this.connectClient();
	}
	private async connectClient() {
		try {
			await this.client.connect();
			console.log("Redis client connected and ready to use")
		} catch (err) {
			console.error("Unable to connect redis client", err)
		}
		return
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
	public incr(key: string) {
		return this.client.incr(key)
	}
	public decr(key: string) {
		return this.client.decr(key)
	}
	public ttl(key: string) {
		return this.client.ttl(key)
	}
}

export default Redis;
