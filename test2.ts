import Redis from ".";

const client = new Redis({
    password: process.env.REDIS_PASSWORD
}, {}, {
    enablePubSub: true,
    configSet: {
        parameter: "notify-keyspace-events",
        key: "Ex"
    }
})

async function boot() {
    try {
        await client.selectDb(1)
        client.subscribe("__keyevent@1__:expired", (key) => {
            console.log("key expired:", key)
        })
        await client.set("test", "hello world")
        await client.expire("test", 10)
        console.log("Redis connected successfully..")
    } catch (err) {
        console.log("Redis connection failed: ", err)
    }
}
boot()