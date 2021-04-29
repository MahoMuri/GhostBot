const { stripIndents } = require("common-tags");
const mongoose = require("mongoose");
const MuteTimers = require("../models/MuteInfo");
const { resumeTimer } = require("../utils/Utillites");

module.exports = (bot) => {
    bot.on("ready", async () => {
        await mongoose
            .connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            })
            .then((connection) => {
                if (connection.connections[0].readyState === 1) {
                    console.log(
                        `✅ Successfully connected to ${connection.connections[0].name} DataBase!`
                    );
                }
            })
            .catch((err) => console.log("Error on staffsheet\n", err));

        console.log(
            `${bot.user.username} is online on ${bot.guilds.cache.size} server${
                bot.guilds.cache.size === 1 ? "" : "s"
            }!`
        );

        // setTimeout checker
        const date = new Date();
        const cursor = await MuteTimers.find({ isMuted: true }).cursor();
        // let temporaryArray = [];
        for (
            let doc = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            // console.log(doc); // Prints documents one at a time
            const channelID = doc.channelID;
            const guild = bot.guilds.cache.get(doc.guildID);
            const member = guild.member(doc.userID);
            const muted = guild.roles.cache.find(
                (role) => role.name === "🔇Muted"
            );
            const channel = guild.channels.cache.find(
                (channel) => channel.id === channelID
            );
            // temporaryArray.push(doc);
            if (doc.time === null) {
                console.log("null");
            } else if (doc.time.getTime() <= date.getTime()) {
                console.log("true");
                console.log(doc);
                member.roles.remove(muted).then((member) => {
                    member.send(
                        stripIndents`**${member}**, 🔊 You have been unmuted!`
                    );
                });
                channel.send(`🔊 Unmuted \`${member.user.tag}\``);
            } else if (doc.time.getTime() >= date.getTime()) {
                console.log("false");
                console.log(doc);
                const timer = doc.time.getTime() - date.getTime();
                resumeTimer(member, channel, muted, timer);
            }
        }
    });
};
