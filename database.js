const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

conn.query(
    `CREATE TABLE IF NOT EXISTS \`authorized_chats\` (
        \`id\` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        \`chat_id\` VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB;`,
    (err) => {
        if (err) throw err;
    }
);

conn.query(
    `CREATE TABLE IF NOT EXISTS \`reminder_histories\` (
        \`id\` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        \`chat_id\` VARCHAR(100) NOT NULL,
        \`task_id\` VARCHAR(100) NOT NULL,
        \`send_date\` DATE NOT NULL
    ) ENGINE=InnoDB;`,
    (err) => {
        if (err) throw err;
    }
);

exports.conn = conn;
