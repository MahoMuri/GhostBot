/**
 * @file message listener (2/2)
 */
const { DMChannel, MessageEmbed } = require("discord.js");
const environment = require("../utils/Environment");

module.exports = async (bot) => {
    bot.on("message", async (message) => {
        if (message.channel instanceof DMChannel) {
            return;
        }

        const guildID = message.guild.id;
        let guildSettings = bot.dbClient.getGuildSettings(guildID);

        if (!guildSettings) {
            guildSettings = {
                prefix: environment.prefix,
            };

            bot.dbClient.setGuildSettings(guildID, guildSettings);
        }

        const prefix = guildSettings.prefix;

        if (!prefix) {
            guildSettings.prefix = environment.prefix;
            bot.dbClient.setGuildSettings(guildID, guildSettings);
        }

        const lsprfxes = [
            prefix,
            `<@${bot.user.id}>`,
            `<@&${bot.user.id}>`,
            `<@!${bot.user.id}>`,
        ];

        const prefixes = lsprfxes
            .filter((prfx) => message.content.startsWith(prfx))
            .join("");

        if (message.author.bot || !message.guild || prefixes.length <= 0) {
            return;
        }

        // If message.member is uncached, cache it.
        if (!message.member) {
            message.member = await message.guild.fetchMember(message);
        }

        const args = message.content.slice(prefixes.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) {
            if (prefixes !== prefix) {
                const pEmbed = new MessageEmbed()
                    .setColor(colors.Dark_Pastel_Blue)
                    .setTitle("Server's Prefix")
                    .setDescription(`**Prefix is \`${prefix}\`**
                    Type \`${prefix}prefix set <prefix here>\` to change this server's prefix!`);
                message.channel.send(pEmbed);
            } else {
                return;
            }
        }

        // Get the command
        let command = bot.commands.get(cmd);

        // If none is found, try to find it by alias
        if (!command) {
            command = bot.commands.get(bot.aliases.get(cmd));
        }

        // If a command is finally found, run the command
        if (command) {
            command.run(bot, message, args, prefix);
        }
    });
};
