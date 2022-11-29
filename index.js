const fs = require('node:fs');

const { TOKEN, RPC } = require('./config.json');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit()
});

const { Client, Partials, GatewayIntentBits, Collection , Events, ActivityType } = require('discord.js');
const { argv } = require('node:process');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.Channel,
        Partials.GuildScheduledEvent
    ],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./Code/Commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./Code/Commands/${file}`);
    client.commands.set(command.data.name, command);
}

// when ready
client.on("ready" , () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Watching });
})


// client events
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const code = client.commands.get(interaction.commandName);
    if (!code) return;
    try {
        await code.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.content.startsWith("z!")) {
        if (message.content === "z!shell") {
            const { exec } = require('node:child_process');
            const { OWNER_ID } = require('./config.json')
            const command = message.content;
            if (message.author.id !== OWNER_ID) {
                return message.reply({ content: 'You are not the owner!', ephemeral: true });
            }
            message.reply("Please enter the command you want to run");
            const filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    exec(collected.first().content, (err, stdout, stderr) => {
                        if (err) {
                            return message.reply({ content: `error: ${err.message}`, ephemeral: true });
                        }
                        if (stderr) {
                            return message.reply({ content: `stderr: ${stderr}`, ephemeral: true });
                        }
                        message.reply({ content: `\`\`\`sh\n${stdout}\n\`\`\``, ephemeral: true });
                    });
                }
                )
                .catch(collected => {
                    message.reply('You didn\'t provide a command in time!');
                }
                );

        }
    }
});
client.login(TOKEN);