const moment = require('moment');
const cron = require('node-cron');
const reminderHistory = require('./models/reminder-history');
const authorizedChat = require('./models/authorized-chat');
const { bot } = require('./bot');
const notion = require('./notion');

// run every minute
cron.schedule('* * * * * *', async () => {
    const now = moment().format('YYYY-MM-DD');
    try {
        const date = moment().add(1, 'days').format('YYYY-MM-DD');

        const { results } = await notion.getUnfinishedTaskOnOrBeforeDueDate(date);
        results.forEach(async (task) => {
            const chats = await authorizedChat.get();
            chats.forEach(async (chat) => {
                const history = await reminderHistory.findByChatIdTaskIdAndSendDate(chat.chat_id, task.id, now);
                if (!history) {
                    await reminderHistory.create(chat.chat_id, task.id, now);
                    bot.telegram.sendMessage(chat.chat_id, `You have a task due ${task.properties['Due Date'].date.start}: ${task.properties.Name.title[0].plain_text} (${task.url})`);
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
});
