const { stripIndents } = require("common-tags");
const MuteTimers = require("../../models/MuteInfo");

module.exports = {
    name: "unmute",
    aliases: [],
    category: "moderation",
    description: "Unmutes the member",
    usage: [`\`$unmute <user>\``],
    run: async (bot, message, args) => {
        // No args
        if (!args[0]) {
            return message
                .reply("Please provide a person to unmute.")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }

        // No author permissions
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            return message
                .reply(
                    "❌ You do not have permissions to mute members. Please contact a staff member"
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            return message
                .reply(
                    "❌ I do not have permissions to mute members. Please contact a staff member"
                )
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }

        const toMute =
            message.mentions.members.first() ||
            message.guild.members.get(args[0]);

        // No member found
        if (!toMute) {
            return message
                .reply("Couldn't find that member, try again")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }

        // Can't unmute urself
        if (toMute.id === message.author.id) {
            return message
                .reply("You can't unmute yourself...")
                .then((m) =>
                    m.delete({ timeout: 5000, reason: "It had to be done." })
                );
        }

        const mutedRole = message.guild.roles.cache.find(
            (role) => role.name === "🔇Muted"
        );
        if (!toMute.roles.cache.has(mutedRole.id)) {
            return message.channel.send(
                `\`${toMute.user.tag}\` is currently unmuted, are you sure that's the right one?`
            );
        }

        await toMute.roles.remove(mutedRole).then((member) => {
            let reason;

            // If no reason provided
            if (!args[1]) {
                reason = "None Specified.";
            } else {
                // If there is
                reason = args.splice(1).join(" ");
            }
            member.send(stripIndents`**${member}**, 🔊 You have been unmuted!
            **Reason:** ${_.capitalize(reason)}`);
        });
        message.channel.send(`🔊  Unuted \`${toMute.user.tag}\`!`);

        const query = { userID: toMute.id };
        const mongoOptions = { new: true };
        const document = await MuteTimers.findOneAndUpdate(
            query,
            {
                isMuted: false,
                timeUnmuted: Date(),
                timer: null,
            },
            mongoOptions
        );

        console.log(document);
    },
};
