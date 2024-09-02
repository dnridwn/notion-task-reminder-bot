const mysql = require('mysql2');

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

function createConnection() {
    const connection = mysql.createConnection(config);
    connection.connect();
    return connection;
}

exports.prepareConnection = async function(callback) {
    const connection = createConnection();
    await callback(connection);
    connection.end();
}
