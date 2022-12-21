const fs = require('node:fs');

const { TOKEN, RPC, Prefix } = require('./config.json');
const { log } = require('./src/log/log');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit()
});

const { Client, Partials, GatewayIntentBits, Collection, Events, ActivityType, PermissionsBitField, ThreadManager, ThreadChannel, GuildForumThreadManager, ForumChannel, ThreadMemberManager, ThreadMember, EmbedBuilder } = require('discord.js');

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
            log({
                interaction: interaction.commandName,
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: error
                    },
                    {
                        name: "User",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Channel",
                        value: `<#${interaction.channel.id}> (${interaction.channel.id})`
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name} (${interaction.guild.id})`
                    }
                ]
            })
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
            log({
                interaction: interaction.commandName,
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: error
                    },
                    {
                        name: "User",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Channel",
                        value: `<#${interaction.channel.id}> (${interaction.channel.id})`
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name} (${interaction.guild.id})`
                    }
                ]
            })
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
            log({
                interaction: message.content,
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: error
                    },
                    {
                        name: "User",
                        value: `${message.author.tag} (${message.author.id})`
                    },
                    {
                        name: "Channel",
                        value: `<#${message.channel.id}> (${message.channel.id})`
                    },
                    {
                        name: "Guild",
                        value: `${message.guild.name} (${message.guild.id})`
                    }
                ]
            })
        }
    }
});

client.on("threadUpdate", async (oldThread, newThread) => {
    // 1048877201296207882 - Tags id Solved in Yuuki Server
    // Replace 1048877201296207882 with your tags id
    if (newThread.archived === true && newThread.appliedTags.includes("1048877201296207882") === true) {
        const user = await client.users.fetch(newThread.ownerId)
        const embed = new EmbedBuilder()
            .setTitle("Thread Closed")
            .setDescription("Your thread has been closed as problem has been solved.")
            .addFields({
                name: "Thread Name",
                value: newThread.name,
            })
            .addFields({
                name: "Link to Thread",
                value: `[Click Here](${newThread.url})`,
            })
            .setColor("Green")
            .setTimestamp()
        user.send({ embeds: [embed] }).then(() => {
            log({
                interaction: "Thread Closed",
                color: "Green",
                description: "Closed thread and sent message to user",
                fields: [
                    {
                        name: "User",
                        value: `${user.tag} (${user.id})`
                    },
                    {
                        name: "Thread",
                        value: `${newThread.name} (${newThread.id})`
                    },
                    {
                        name: "Guild",
                        value: `${newThread.guild.name} (${newThread.guild.id})`
                    }
                ]
            })
        }).catch((error) => {
            log({
                interaction: "Thread Closed",
                color: "Red",
                description: "Closed thread but couldn't send message to user",
                fields: [
                    {
                        name: "Error output",
                        value: error
                    },
                    {
                        name: "User",
                        value: `${user.tag} (${user.id})`
                    },
                    {
                        name: "Thread",
                        value: `${newThread.name} (${newThread.id})`
                    },
                    {
                        name: "Guild",
                        value: `${newThread.guild.name} (${newThread.guild.id})`
                    }
                ]
            })
        })
    }
})

client.login(TOKEN);