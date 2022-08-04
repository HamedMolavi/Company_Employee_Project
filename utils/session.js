const { v4: uuidv4 } = require('uuid');
const { dbQueryPromise } = require('../database/queryPromises');

function Session(id, model) {
    this.userId = id;
    this.key = uuidv4();
    this.model = model;
};
function tokenChecker(database) {
    return async function (req, res, next) {
        const token = req.header('autorization');//undefined
        if (!token) return res.status(401).json({ success: false });
        targetSession = global.sessionList.find(el => el.key === token);
        if (!targetSession) return res.status(401).json({ success: false });
        searchQuery = ['SELECT * FROM `' + targetSession.model + '` where `id` =?', [targetSession.userId]]
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
global.sessionList = [];

module.exports = {
    Session,
    tokenChecker,

}