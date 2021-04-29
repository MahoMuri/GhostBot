const { stripIndents } = require("common-tags");
const { getMember } = require("../../utils/Utillites");

module.exports = {
    name: "giverole",
    aliases: ["grole"],
    category: "moderation",
    description: "Gives a role to a certain user",
    usage: [`\`$giverole <Usertag|Mention> <RoleID: Plain text>\``],
    run: async (bot, message, args) => {
        // Can user manage roles?
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            message.reply("You don't have access to this command!");
            return;
        }

        // Does message have a user-mention?
        if (!message.mentions.members.first()) {
            message.reply("Please provide a member to give the role to.");
            return;
        }

        // Does message have any role to give?
        if (!args) {
            message.reply("Please provide role to give!");
            return;
        }

        const member = getMember(message, args.join(" "));
        // Try setting via role-mention
        let role = message.mentions.roles.first();
        // If no role-mention, proceed
        if (!role) {
            // Check for role
            const toGive = args.slice(1).join(" ");
            role = message.guild.roles.cache.find(
                (role) => role.name === toGive
            );
            // If not valid name, proceed to check via role-id
            if (!role) {
                // Check for role-id
                role = message.guild.roles.cache.find(
                    (role) => role.id === toGive
                );
                if (!role) {
                    // Unknown role, consider as FAILURE
                    message.channel.send("Cannot give an unknown role");
                    return;
                }
            }
        }

        // Sanity check: can user give this role?
        if (member.roles.highest.comparePositionTo(role) <= 0) {
            message.reply(
                "Cannot give role that is same or higher than your own."
            );
            return;
        }

        try {
            if (member.roles.cache.has(role.id)) {
                message.channel.send(
                    `\`${member.user.tag}\` already has the ${role.name} role!`
                );
                return;
            }
            await member.roles.add(role);
            message.channel.send(
                `${role.name} has been successfully given to \`${member.user.tag}!\``
            );
        } catch (error) {
            message.channel.send(stripIndents`Couldn't give the role here's why:
            \`${error.message}\``);
        }
    },
};
