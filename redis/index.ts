import * as redis from "redis";
import { Options, Props, RedisClient, SocketProps } from "../types/redis";
import { PubSubListener } from "@node-redis/client/dist/lib/client/commands-queue";

class Redis implements RedisClient {
	private client;
	private sub;
	private options: Options = {}
	constructor(props: Props = {}, socketProps: SocketProps = {}, options?: Options) {
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
		if (options) {
			this.options = options;
		}
		if (options?.enablePubSub) {
			this.sub = this.client.duplicate()
			this.sub.connect().then(() => {
				console.log("PubSub client ready. Use 'client.subscribe(key)' to listen to events")
			}).catch((err) => {
				console.error("Unable to connect pubsub client", err)
			})
		}
	}
	private async connectClient() {
		try {
			await this.client.connect();
			if (this.options?.configSet) {
				this.client.configSet(this.options.configSet.parameter, this.options.configSet.key)
			}
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
	public setEx(key: string, value: string, ttl = 60) {
		return this.client.setEx(key, ttl, value)
	}
	/**
	 * Select specific DB.
	 * redis has 16 dbs, indexed from 0 - 15.
	 * Accepted options must be from 0 - 15.
	 * 
	 * CAUTION: If you change the selected db, all commands will start
	 * setting values on the specified db.
	 */
	public selectDb(db: number) {
		return this.client.select(db)
	}
	/**
	 * Subscribe to key expiry events.
	 * This method only works if 'enablePubSub' option is passed.
	 */
	public subscribe(key: string, listener: PubSubListener) {
		if (!this.sub) {
			throw new Error("PubSub has not been enabled. To enable PubSub you must set 'enablePubSub' option.")
		}
		this.sub.subscribe(key, listener)
	}
}

export default Redis;
