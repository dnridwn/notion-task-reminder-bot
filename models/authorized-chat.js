const { conn } = require('../database');

const table = 'authorized_chats';

exports.get = function() {
    return new Promise((res, rej) => {
        conn.query(`SELECT * FROM ${table}`, (err, result) => {
            err ? rej(err) : res(result);
        });
    });
}

exports.findByChatID = function(chatID) {
    return new Promise((res, rej) => {
        conn.query(`SELECT * FROM ${table} WHERE chat_id = "${chatID}" ORDER BY id DESC LIMIT 1`, (err, result) => {
            err ? rej(err) : res(result.length > 0 ? result[0] : null);
        });
    });
}

exports.create = function (chatID) {
    return new Promise((res, rej) => {
        conn.query(`INSERT INTO ${table} (chat_id) VALUES ("${chatID}")`, (err, result) => {
            err ? rej(err) : res(result);
        });
    });
}
