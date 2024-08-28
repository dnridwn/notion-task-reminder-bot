const moment = require('moment');
const cron = require('node-cron');
const reminderHistory = require('./models/reminder-history');
const authorizedChat = require('./models/authorized-chat');
const { bot } = require('./bot');
const notion = require('./notion');

// run every minute
cron.schedule('* * * * *', async () => {
    try {
        const now = moment().format('YYYY-MM-DD');

        const todoTasks = (await notion.getTodoTasks()).results;
        const inProgressTasks = (await notion.getInProgressTasks()).results;
        const doneTasks = (await notion.getDoneTasks()).results;
        const overdueTasks = (await notion.getOverdueTasks()).results;
        const dueTodayTasks = (await notion.getDueTodayTasks()).results;
        const dueTomorrowTasks = (await notion.getDueTomorrowTasks()).results;

        const stringableTasks = function(tasks) {
            return tasks.map(task => {
                return `- <a href="${task.url}">${task.properties.Name.title[0].plain_text}</a>`;
            }).join('\n');
        };

        const message = `Task Summary (${now})\n\nTodo:\n${stringableTasks(todoTasks)}\n\nIn Progress:\n${stringableTasks(inProgressTasks)}\n\nDone:\n${stringableTasks(doneTasks)}\n\nOverdue:\n${stringableTasks(overdueTasks)}\n\nDue Today:\n${stringableTasks(dueTodayTasks)}\n\nDue Tomorrow:\n${stringableTasks(dueTomorrowTasks)}\n\n`;

        const chats = await authorizedChat.get();
        chats.forEach(async (chat) => {
            const history = await reminderHistory.findByChatIdTaskIdAndSendDate(chat.chat_id, now);
            if (!history) {
                await reminderHistory.create(chat.chat_id, now);
                bot.telegram.sendMessage(chat.chat_id, message, { parse_mode: 'html' });
            }
        });
    } catch (err) {
        console.error(err);
    }
});
