const RedisStore = require("connect-redis").default;
const { createClient } = require("ioredis");
const dlog = require("./log").dlog(__filename);
const errlog = require('./log').errlog(__filename);

function redisStoreConnect() {
    try {
        let redisClient = createClient()
        // Initialize store.
        let redisStore = new RedisStore({
            client: redisClient,
            prefix: "company_employee:",
            ttl: 1,
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