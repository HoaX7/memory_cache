import redisClient from "./redis/index";
export default redisClient;

const boot = async () => {
    const cl = new redisClient()
    // await cl.get("")
}
boot()