const development = require("../json/development.json");
const production = require("../json/production.json");

const { NODE_ENV: mode } = process.env;

const config = {
    development,
    production,
};

module.exports = { ...config[mode], mode };
