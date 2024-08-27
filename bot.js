const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const authorizedChat = require('./models/authorized-chat');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        const result = await authorizedChat.findByChatID(ctx.chat.id);
        if (result && result.id) return ctx.reply('You are already authorized!');
        ctx.reply('Welcome! Input secret code with following format to register. Format: secret!{PuYourSecretCode}');
    } catch (err) {
        console.error(err);
        ctx.reply('Error');
    }
});

bot.on(message('text'), async (ctx) => {
    if (ctx.message.text.startsWith('secret!')) {
        const secretCode = ctx.message.text.split('secret!')[1].trim();
        if (secretCode != process.env.SECRET_CODE) return ctx.reply('Invalid secret code');

        try {
            const result = await authorizedChat.findByChatID(ctx.chat.id);
            if (result && result.id) return ctx.reply('You are already authorized');
            await authorizedChat.create(ctx.chat.id);
            return ctx.reply('Successfully registered');

        } catch (error) {
            console.error(error);
            return ctx.reply('Error');
        }
    }

    const result = await authorizedChat.findByChatID(ctx.chat.id);
    if (!result || !result.id) return ctx.reply('You are not authorized');
});

bot.launch();

exports.bot = bot;
