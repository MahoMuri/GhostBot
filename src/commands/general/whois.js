const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../utils/Utillites");

module.exports = {
    name: "whois",
    aliases: ["me", "about"],
    category: "general",
    description: "Displays the information about you or a member",
    usage: "-<command | alias> [@user]",
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles =
            member.roles.cache
                .filter((r) => r.id !== message.guild.id)
                .map((r) => r)
                .join(", ") || "none";

        const active = member.user.presence.activities.length;
        const activity = member.user.presence.activities[0];
        const status = member.user.presence.status;

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setTitle(`${member.displayName}'s Info`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(colors.Dark_Pastel_Blue)

            .addField(
                "Member information:",
                stripIndents`**Display name:** ${member.displayName}
            **Joined at:** ${joined}
            **Roles:** ${roles}`,
                true
            )

            .addField(
                "User information:",
                stripIndents`**ID:** ${member.user.id}
            **Username**: ${member.user.username}
            **Tag**: ${member.user.tag}
            **Created at**: ${created}`,
                true
            )

            .addField(
                "Current Status",
                stripIndents`**Status:** ${_.capitalize(status)}`
            )
            .setTimestamp();

        if (active) {
            if (activity.type === "CUSTOM_STATUS") {
                embed.addField("Currently has a ", `**${activity}**`, true);
            } else {
                const presence = member.user.presence.activities[0].type;
                embed.addField(
                    `Currently ${_.capitalize(presence)}`,
                    stripIndents`**${_.capitalize(presence)}**: ${activity}`
                );
            }
        }

        message.channel.send(embed);
    },
};
