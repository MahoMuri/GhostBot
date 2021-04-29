const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: [],
    category: "Says something",
    description: "Says your input via the bot",
    usage: ["`$say [embed] <message> `"],
    async run(bot, message, args) {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(
                "You don't have the required permissions to use this command."
            );
        }

        if (args.length === 0) {
            return message.reply("Nothing to say?");
        }

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(colors.Green_Sheen);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    },
};
