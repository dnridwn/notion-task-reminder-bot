const { prepareConnection } = require('../database');
const table = 'reminder_histories';

exports.findByChatIdTaskIdAndSendDate = function(chatID, sendDate) {
    return new Promise((res, rej) => {
        prepareConnection(conn => {
            conn.query(`SELECT * FROM ${table} WHERE chat_id = "${chatID}" AND send_date = "${sendDate}" ORDER BY id DESC LIMIT 1`, (err, result) => {
                err ? rej(err) : res(result.length > 0 ? result[0] : null);
            });
        });
    });
}

exports.create = function(chatID, sendDate) {
    return new Promise((res, rej) => {
        prepareConnection(conn => {
            conn.query(`INSERT INTO ${table} (chat_id, send_date) VALUES ("${chatID}", "${sendDate}")`, (err, result) => {
                err ? rej(err) : res(result);
            });
        });
    });
}
