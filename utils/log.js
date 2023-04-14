process.env.DEBUG = 'CompanyEmployee:*,express-session:*'
const debug = require('debug');

const log = debug('CompanyEmployee');
log.log = console.log.bind(console);

const dlog = function (filename) {
    filename = filename.split('\\');
    filename = filename[filename.length - 1]
    return function (text) {log.extend(filename)(text)}
}

const err = debug('CompanyEmployee:error');
const errlog = function (filename) {
    filename = filename.split('\\');
    filename = filename[filename.length - 1]
    return function (text) {err.extend(filename)(text)}
}

module.exports = {
    dlog,
    errlog
}