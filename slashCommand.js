const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, GUILD_ID, TOKEN } = require('./config.json');
const path = require('node:path');

const commands = [];
const commandPath = path.join(__dirname, 'src/Commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

// get all files in src/Commands and subfolders
const commandFolders = fs.readdirSync('./src/Commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/Commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./src/Commands/${folder}/${file}`);
        commands.push(command.data);
    }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            {
                body: commands,
            })
        .then(() => console.log(`Successfully reloaded ${commands.length} application (/) commands.`))
        .catch(console.error);
    } catch (error) {
        console.error(error);
    }
})();