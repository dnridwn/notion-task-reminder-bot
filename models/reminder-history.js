const { conn } = require('../database');
const table = 'reminder_histories';

exports.findByChatIdTaskIdAndSendDate = function(chatID, taskID, sendDate) {
    return new Promise((res, rej) => {
        conn.query(`SELECT * FROM ${table} WHERE chat_id = "${chatID}" AND task_id = "${taskID}" AND send_date = "${sendDate}" ORDER BY id DESC LIMIT 1`, (err, result) => {
            err ? rej(err) : res(result.length > 0 ? result[0] : null);
        });
    });
}

exports.create = function(chatID, taskID, sendDate) {
    return new Promise((res, rej) => {
        conn.query(`INSERT INTO ${table} (chat_id, task_id, send_date) VALUES ("${chatID}", "${taskID}", "${sendDate}")`, (err, result) => {
            err ? rej(err) : res(result);
        });
    });
}
