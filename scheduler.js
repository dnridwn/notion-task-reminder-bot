const moment = require('moment');
const cron = require('node-cron');
const reminderHistory = require('./models/reminder-history');
const authorizedChat = require('./models/authorized-chat');
const { bot } = require('./bot');
const notion = require('./notion');

// run every minute
cron.schedule('* * * * *', () => {
    const now = moment();
    const tomorrow = now.add(1, 'days');

    [now, tomorrow].forEach(async (date) => {
        const formattedDate = date.format('YYYY-MM-DD');
        try {
            const { results } = await notion.getUnfinishedTaskByDueDate(formattedDate);
            results.forEach(async (task) => {
                const chats = await authorizedChat.get();
                chats.forEach(async (chat) => {
                    const history = await reminderHistory.findByChatIdTaskIdAndSendDate(chat.chat_id, task.id, formattedDate);
                    if (history) return;

                    await reminderHistory.create(chat.chat_id, task.id, now.format('YYYY-MM-DD HH:mm:ss'));
                    bot.telegram.sendMessage(chat.chat_id, `You have a task due ${formattedDate}: ${task.properties.Name.title[0].plain_text} (${task.url})`);
                });
            });
        } catch (err) {
            console.error(err);
        }
    });
});
