const fs = require('node:fs');

const { TOKEN, RPC, MONGO, Prefix } = require('./config.json');
const { log } = require('./src/log/log');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit()
});

const { Client, Partials, GatewayIntentBits, Collection, Events, ActivityType, PermissionsBitField, EmbedBuilder } = require('discord.js');

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
const commandFolders = fs.readdirSync('./src/Commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/Commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./src/Commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}


// when ready
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (RPC.Type === "Playing" || RPC.Type === "PLAYING" || RPC.Type === "playing") {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Playing });
    } else if (RPC.Type === "Listening" || RPC.Type === "LISTENING" || RPC.Type === "listening") {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Listening });
    } else if (RPC.Type === "Watching" || RPC.Type === "WATCHING" || RPC.Type === "watching") {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Watching });
    } else if (RPC.Type === "Streaming" || RPC.Type === "STREAMING" || RPC.Type === "streaming") {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Streaming });
    } else if (RPC.Type === "Competing" || RPC.Type === "COMPETING" || RPC.Type === "competing") {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Competing });
    } else {
        client.user.setActivity(`${RPC.Details}`, { type: ActivityType.Playing });
    }
    client.user.setStatus(RPC.Status);
})


// client events interactionCreate
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            log("Error", error, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
    } else {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        const code = client.commands.get(interaction.commandName);
        if (!code) return;
        try {
            await code.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            log("Error", error, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
    }
});

// client events messageCreate
client.on(Events.MessageCreate, async message => {
    if (!message.content.startsWith(Prefix)) return;
    if (!message.member.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
    const messageCreateFiles = fs.readdirSync('./src/messageCreate').filter(file => file.endsWith('.js'));
    for (const file of messageCreateFiles) {
        const code = require(`./src/messageCreate/${file}`);
        if (!code) return;
        try {
            await code.execute(message);
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            log("Error", error, message.author.tag, message.author.id, message.channel.id, message.guild.id)
        }
    }
}); 

client.on("threadCreate", async thread => {
    const channel = thread.guild.channels.cache.get(thread.id)
    const embed = new EmbedBuilder()
        .setTitle("New Post Support")
        .setDescription(`You create new post in forum, Link post [here](${thread.url})\n\nDon't forget to close your post if you already solve your problem!`)
        .addFields({
            name: "Post Title",
            value: thread.name,
        })
        .setTimestamp()
        .setColor("Green")
    await channel.send({ embeds: [embed] });
});

client.login(TOKEN);