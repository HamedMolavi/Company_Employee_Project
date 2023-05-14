const RedisStore = require("connect-redis").default;
const { createClient } = require("ioredis");
const dlog = require("./log").dlog(__filename);
const errlog = require('./log').errlog(__filename);

function redisStoreConnect() {
    try {
        let redisClient = createClient(process.env.REDIS_PORT ?? 6379, process.env.REDIS_HOST ?? "127.0.0.1");
        // Initialize store.
        let redisStore = new RedisStore({
            client: redisClient,
            prefix: "company_employee:",
            ttl: 86400,
            disableTouch: true,
        });
        dlog('Session on Redis.')
        return redisStore;
    } catch (err) {
        dlog('Session on Memory.')
        errlog('Error', err);
        return 'MemoryStore';
    };

}



module.exports = {
    redisStoreConnect
}