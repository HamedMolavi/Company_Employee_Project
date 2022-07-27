const fs = require('fs');
const path = require('path');


function readTicket(ticket) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../tickets/', ticket), (err, data) => {
            err ? reject(err) : resolve(JSON.parse(data));
        });
    });
};


function writeTicket(data, ticket) {
    return new Promise((resolve, reject) => {
        if (!ticket) ticket = ticketGen();
        fs.writeFile(path.join(__dirname, '../tickets/', ticket), data, (err) => {
            err ? reject(err) : resolve(ticket);
            // terminateTicket(ticket);
        });
    });
};

function ticketGen() {
    return (Date.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
};

function terminateTicket(ticket) {
    setTimeout(() => {
        fs.unlink(path.join(__dirname, 'tickets/', ticket), (err) => {
            console.log('error unlink ticket ->', ticket);
            console.log(err);
        });
    }, 60 * 60 * 1000);
};

module.exports = {
    readTicket,
    writeTicket
}