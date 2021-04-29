const { stripIndents } = require("common-tags");
const { getMember } = require("../../utils/Utillites");

module.exports = {
    name: "takerole",
    aliases: ["trole"],
    category: "moderation",
    description: "Takes a role to a certain user",
    usage: [`\`$takerole <Usertag|Mention> <RoleID: Plain text>\``],
    run: async (bot, message, args) => {
        // Can user manage roles?
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            message.reply("You don't have access to this command!");
            return;
        }

        // Does message have a user-mention?
        if (!message.mentions.members.first()) {
            message.reply("Please provide a member to take a role from.");
            return;
        }

        // Does message have any role to take?
        if (!args) {
            message.reply("Please provide role to take!");
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
                    message.channel.send("Cannot take an unknown role");
                    return;
                }
            }
        }

        // Sanity check: can user take this role?
        if (member.roles.highest.comparePositionTo(role) <= 0) {
            message.reply(
                "Cannot take role that is same or higher than your own."
            );
            return;
        }
        try {
            if (!member.roles.cache.has(role.id)) {
                message.channel.send(
                    `\`${member.user.tag}\` does not have the ${role.name} role!`
                );
                return;
            }
            await member.roles.remove(role);
            message.channel.send(
                `${role.name} has been successfully removed from \`${member.user.tag}!\`!`
            );
        } catch (error) {
            message.channel.send(stripIndents`Couldn't take the role here's why:
            \`${error.message}\``);
        }
    },
};
