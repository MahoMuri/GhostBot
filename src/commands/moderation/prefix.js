const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "prefix",
    aliases: [],
    category: "general",
    description:
        "Displays the prefix of this server or changes the prefix of this server",
    usage: [`\`q!<command | alias> <desired prefix>\``],
    run: async (bot, message, args) => {
        const mode = args[0];
        // checks if mode is true
        if (mode) {
            mode.toLowerCase();
            // checks if mode is equal to set
            if (mode === "set") {
                if (!message.member.hasPermission("MANAGE_GUILD")) {
                    message.reply("You don't have the permission to do this!");
                    return;
                }
                // checks for prefix to be given
                if (!args[1]) {
                    message.channel.send("You must provide a prefix!");
                    return;
                }

                const newPrefix = args[1];
                const guildID = message.guild.id;
                const guildSettings = bot.dbClient.getGuildSettings(guildID);

                if (guildSettings.prefix === newPrefix) {
                    const embed = new MessageEmbed()
                        .setColor(colors.Red)
                        .setDescription("❌ **Prefixes are the same!**");
                    message.channel.send(embed);
                    return;
                }

                guildSettings.prefix = newPrefix;

                bot.dbClient.setGuildSettings(guildID, guildSettings);

                const sEmbed = new MessageEmbed()
                    .setColor(colors.Green_Sheen)
                    .setTitle("Prefix Set!")
                    .setDescription(
                        `Server's prefix is set to \`${newPrefix}\``
                    );

                message.channel.send(sEmbed);
            } else {
                message.channel.send(
                    `**I don't know the command** \`${mode}\``
                );
            }
        } else {
            const guildID = message.guild.id;
            const guildSettings = bot.dbClient.getGuildSettings(guildID);

            const pEmbed = new MessageEmbed()
                .setColor(colors.Dark_Pastel_Blue)
                .setTitle("Server's Prefix")
                .setDescription(`**Prefix is \`${guildSettings.prefix}\`**
                Type \`${guildSettings.prefix}prefix set <prefix here>\` to change this server's prefix!`);
            message.channel.send(pEmbed);
        }
    },
};
