import Redis from ".";

const client = new Redis({
    password: process.env.REDIS_PASSWORD
})

async function boot() {
    try {
        await client.get("test")
        console.log("Redis connected successfully..")
    } catch (err) {
        console.log("Redis connection failed: ", err)
    }
}
boot()