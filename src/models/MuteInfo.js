const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MuteTimers = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    channelID: {
        type: String,
        required: true,
        unique: true,
    },
    isMuted: {
        type: Boolean,
        required: true,
    },
    timeMuted: {
        type: Date,
        required: true,
    },
    timeUnmuted: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    timer: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Timers", MuteTimers);
