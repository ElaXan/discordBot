const fs = require('node:fs');

const { TOKEN, RPC } = require('./config.json');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit()
});

const { Client, Partials, GatewayIntentBits, Collection , Events, ActivityType } = require('discord.js');

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

// Load other .js files in directory Code/Commands
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

client.login(TOKEN);