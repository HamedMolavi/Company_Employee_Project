const Redis  = require('ioredis');
const { v4: uuidv4 } = require('uuid')
const { dbQueryPromise } = require('../database/queryPromises');
const redis = new Redis();


function tokenChecker(database) {
    return async function (req, res, next) {
        const token = req.header('autorization');
        if (!token) return res.status(401).json({ success: false });
        const targetSession = await redis.get(token);
        if (!targetSession) return res.status(401).json({ success: false });
        searchQuery = ['SELECT * FROM `admins` where `id` =?', [targetSession]]//' + targetSession.model + '
        await dbQueryPromise(database, searchQuery).then((result) => {
            if (result.success) {
                res.locals.user = result.results[0];
                return next();
            };
            res.status(401).send();
        }).catch(err => {
            console.log(`Error in Authentication:\n`, err);
            res.status(500).json({ success: false, message: 'Something went wrong.' });//render error
        });
    }
}

async function tokenGenerator(id){
    const token = uuidv4();
    await redis.set(token, id);
    await redis.expire(token, 30 * 60);
    return token;
}

module.exports = {
    tokenChecker,
    tokenGenerator,

}