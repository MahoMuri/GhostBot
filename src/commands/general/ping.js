module.exports = {
    name: "ping",
    aliases: [],
    category: "general",
    description: "ping!",
    usage: ["`c.ping`"],
    async run(bot, message) {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong!
        Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms
        API Latency is ${Math.round(bot.ws.ping)}ms`);
    },
};
