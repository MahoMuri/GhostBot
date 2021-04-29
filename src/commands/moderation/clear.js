module.exports = {
    name: "clear",
    aliases: ["purge", "nuke", "clean"],
    category: "moderation",
    description: "Clears the chat",
    usage: [`\`$clean <number>\``],
    run: async (bot, message, args) => {
        await message.delete();

        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message
                .reply("You can't delete messages....")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done" })
                );
        }

        // Check if args[0] is a number
        if (Number.isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message
                .reply(
                    "Yeah.... That's not a number... I also can't delete 0 messages by the way."
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done" })
                );
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message
                .reply("Opps... I can't delete messages.")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done" })
                );
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel
            .bulkDelete(deleteAmount, true)
            .then((deleted) =>
                message.channel.send(`I deleted \`${deleted.size}\` messages.`)
            )
            .catch((err) => message.reply(`Something went wrong... ${err}`))
            .then((m) =>
                m.delete({ timeout: 5000, reason: "It had to be done" })
            );
    },
};
