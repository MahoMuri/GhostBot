const { stripIndents } = require("common-tags");
const MuteTimers = require("../models/MuteInfo");

class Utilities {
    static getMember(message, toFind = "") {
        toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members) {
            target = message.mentions.members.first();
        }

        if (!target && toFind) {
            target = message.guild.members.cache.find(
                (member) =>
                    member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            );
        }

        if (!target) {
            target = message.member;
        }

        return target;
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat("en-US").format(date);
    }

    static async promptMessage(message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the static parameters, react in the good order.
        validReactions.forEach(async (reaction) => {
            await message.react(reaction);
        });

        // Only allow reactions from the author,
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) =>
            validReactions.includes(reaction.emoji.name) &&
            user.id === author.id;

        // And ofcourse, await the reactions
        const reactions = message
            .awaitReactions(filter, { max: 1, time, errors: ["time"] })
            .then(
                (collected) => collected.first() && collected.first().emoji.name
            )
            .catch(async () => {
                await message.delete();
                message.channel.send(
                    "**❌ Session Expired, please try again.**"
                );
            });

        return reactions;
    }

    static async resumeTimer(member, channel, muted, timer) {
        console.log(
            `${member.user.username}'s time left:`,
            ms(timer, { long: true })
        );
        setTimeout(async function () {
            member.roles.remove(muted).then((member) => {
                member.send(
                    stripIndents`**${member}**, 🔊 You have been unmuted!`
                );
            });
            channel.send(`🔊 Unmuted \`${member.user.tag}\``);

            const query = { userID: member.id };
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

            console.log(`Successfully Unmuted ${document}`);
        }, timer);
    }

    static capitalize(sentence) {
        const words = sentence.split("_");
        return words.map((word) => `${_.capitalize(word)}`).join(" ");
    }
}

module.exports = Utilities;
