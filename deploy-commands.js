/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

// Logger Settings
const logger = require("node-color-log");
logger.setLevel("info");
logger.setDate(() => (new Date()).toLocaleString());

// Setting Configutation
const dotenv = require("dotenv");
dotenv.config();

// Module Import
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

// initialize empty container
const commands = [];

// Read files
const commandFolders = fs.readdirSync("./commands");
logger.debug("⏳ Collecting command files ...");
for (const folder of commandFolders) {
	logger.debug(`⏳ Reading folder ${folder}'s command files...`);
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		logger.debug(`⏳ Reading file ${file} for command...`);
		const command = require(`./commands/${folder}/${file}`);
		logger.debug(`✔️ ${folder}.${file} read!`);
		commands.push(command.data.toJSON());
	}
}
logger.debug("✔️ Command files collected!");

// Deploy
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
(async () => {
	try {
		logger.debug("Started refreshing application (/) commands.");
		await rest.put(
			Routes.applicationCommands(process.env.ClientId),
			{ body: commands },
		);
		logger.debug("Successfully reloaded application (/) commands.");
	}
	catch (error) {
		logger.error(error);
	}
})();
