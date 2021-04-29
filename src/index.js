/**
 * @file main(): basically where everything is initialized
 */

// Imports
const Ascii = require("ascii-table");
const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const Database = require("./utils/DataBase");
const environment = require("./utils/Environment");
global.colors = require("./json/colors.json");
global._ = require("lodash");

// Declare bot
const bot = new Client({
    disableMentions: "everyone",
});

bot.categories = fs.readdirSync(`${__dirname}/commands/`);
bot.aliases = new Collection();
bot.commands = new Collection();
bot.dbClient = new Database(bot, `./${environment.db}`);
bot.selectedCategory = null;

// Delcare token based on NODE_ENV
const TOKEN = environment.token;

// Initialize the Database, you dumbass
bot.dbClient.init();

// Setup config file
config({
    path: `${__dirname}/../.env`,
});

// Events
const lstTable = new Ascii("listeners");
lstTable.setHeading("Listener", "Load Status");
const listeners = fs
    .readdirSync(`${__dirname}/events`)
    .filter((file) => file.endsWith(".js"));

listeners.forEach((f) => {
    try {
        require(`./events/${f}`)(bot);
        lstTable.addRow(f, "Loaded");
    } catch (error) {
        lstTable.addRow(f, "Error -> not loaded");
    }
});
console.log(lstTable.toString());

// Setup commands
const cmdTable = new Ascii("commands");
cmdTable.setHeading("Command", "Load Status");
bot.categories.forEach((dir) => {
    const commands = fs
        .readdirSync(`${__dirname}/commands/${dir}`)
        .filter((f) => f.endsWith(".js"));
    commands.forEach((file) => {
        const pull = require(`${__dirname}/commands/${dir}/${file}`);
        if (pull.name) {
            bot.commands.set(pull.name, pull);
            cmdTable.addRow(file, "Loaded");
            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach((alias) =>
                    bot.aliases.set(alias, pull.name)
                );
            }
        } else {
            cmdTable.addRow(file, "Error -> No name defined");
        }
    });
});
console.log(cmdTable.toString());

bot.login(process.env[TOKEN]);
