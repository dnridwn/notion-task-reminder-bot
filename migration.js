const { prepareConnection } = require('./database');

prepareConnection(conn => {
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
            \`send_date\` DATE NOT NULL
        ) ENGINE=InnoDB;`,
        (err) => {
            if (err) throw err;
        }
    );
});

