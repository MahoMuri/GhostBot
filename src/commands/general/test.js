module.exports = {
    name: "test",
    aliases: [],
    category: "",
    description: "",
    usage: ["`$`"],
    async run(bot, message, args) {
        if (!args) {
            message.channel.send("I am working!");
        } else {
            message.channel.send(
                `Arguments are working! Recieved Arguments: ${args}`
            );
        }
    },
};
