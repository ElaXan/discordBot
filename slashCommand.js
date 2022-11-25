const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, GUILD_ID, TOKEN } = require('./config.json');
const path = require('node:path');

const commands = [];
const commandPath = path.join(__dirname, 'Code/Commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const paths = path.join(__dirname, 'Code/Commands', file);
    const command = require(paths);
    commands.push(command.data);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Remove all commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            {
                body: commands,
            })
        .then(() => console.log('Successfully reloaded application (/) commands.'))
        .catch(console.error);
    } catch (error) {
        console.error(error);
    }
})();