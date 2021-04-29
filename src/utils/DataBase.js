const SQLite = require("better-sqlite3");

class Database {
    constructor(bot, db = "") {
        this.bot = bot;
        this.sqlClient = SQLite(db);
    }

    /**
     * Initializer, ideally put in the constructor but may contain async method.
     */
    init() {
        // Initialize database with 1 table: guildSettings if not already.

        this.sqlClient
            .prepare(
                // Stringified JSON object stored as a TEXT object
                "CREATE TABLE IF NOT EXISTS guildSettings(guildID TEXT NOT NULL UNIQUE, configuration TEXT);"
            )
            .run();

        this.sqlClient
            .prepare(
                "CREATE TABLE IF NOT EXISTS muteTimers(guildID TEXT NOT NULL UNIQUE, properties TEXT);"
            )
            .run();
        // @MahoMuri: Remove these two pragma lines when implementing IPC-based sharding
        // this.sqlClient.pragma("journal_mode = WAL");
        // this.sqlClient.pragma("locking_mode = EXCLUSIVE");
    }

    getGuildSettings(guildID) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        const guildSettings = this.sqlClient
            .prepare(
                "SELECT configuration FROM guildSettings WHERE guildID = ?"
            )
            .get(guildID);

        return guildSettings
            ? JSON.parse(guildSettings.configuration)
            : undefined;
    }

    setGuildSettings(guildID, settings) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        if (!this.getGuildSettings(guildID)) {
            this.sqlClient
                .prepare("INSERT INTO guildSettings VALUES (?, ?)")
                .run(guildID, "{}");
        }

        this.sqlClient
            .prepare(
                "UPDATE guildSettings SET configuration = ? WHERE guildID = ?"
            )
            .run(JSON.stringify(settings), guildID);
    }

    getMuteTimers(guildID) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        const guildSettings = this.sqlClient
            .prepare("SELECT properties FROM muteTimers WHERE guildID = ?")
            .get(guildID);

        return guildSettings ? JSON.parse(guildSettings.properties) : undefined;
    }

    setMuteTimer(guildID, settings) {
        if (typeof guildID !== "string")
            throw new TypeError("Provided guildID is not a string");

        if (!this.getMuteTimers(guildID)) {
            this.sqlClient
                .prepare("INSERT INTO muteTimers VALUES (?, ?)")
                .run(guildID, "[{}]");
        }

        this.sqlClient
            .prepare("UPDATE muteTimers SET properties = ? WHERE guildID = ?")
            .run(JSON.stringify(settings), guildID);
    }
}

module.exports = Database;
