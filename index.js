// Description: Main file of the bot
//
// Dependencies:
// - discord.js
// - config.json
// - log.js
// - node:fs
//

// Require the modules
const fs = require("node:fs")
const { TOKEN, RPC, Prefix } = require('./config.json')
const { log } = require('./src/log/log')

// Unhandled promise rejection
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit()
});

// Uncaught exception
const { Client, Partials, GatewayIntentBits, Collection, Events, ActivityType, PermissionsBitField, EmbedBuilder} = require('discord.js')

// Client options and intents
const intents = [
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
];

// Partials
const partials = [
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.Channel,
    Partials.GuildScheduledEvent
];

// Client
const client = new Client({ intents, partials });

// get commands from folder and subfolders
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
    // login message in console
    console.log(`Logged in as ${client.user.tag}!`);

    // set activity and status from config.json
    const activityTypeMap = {
        playing: ActivityType.Playing,
        listening: ActivityType.Listening,
        watching: ActivityType.Watching,
        streaming: ActivityType.Streaming,
        competing: ActivityType.Competing,
    }

    // set activity and status from config.json
    const activityType = activityTypeMap[RPC.Type.toLowerCase()] || ActivityType.Playing;
    client.user.setActivity(RPC.Details, { type: activityType });
    // Status can be: online, idle, dnd, invisible
    client.user.setStatus(RPC.Status);
});

// client events interactionCreate
client.on(Events.InteractionCreate, async interaction => {
    // if interaction is a autocomplete
    if (interaction.isAutocomplete()) {
        // get command
        const command = client.commands.get(interaction.commandName);
        // if command is not found then return
        if (!command) {
            return;
        }

        try {
            // execute autocomplete
            await command.autocomplete(interaction);
        } catch (error) {
            // if error then log it
            console.error(error);
            // respond with error message
            interaction.respond([{
                name: "Error while searching ID",
                value: "There was an error while searching the ID"
            }])
            // log error to webhook
            log({
                interaction: interaction.commandName,
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: `${error}`
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
            });
        }
    } else {
        // If bot doesnt have permission to send messages then return
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return;
        }

        // If interaction is not a command then return
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return;
        }

        try {
            // Execute command
            await command.execute(interaction);
        } catch (error) {
            // If error then log it
            console.error(error);
            // if error is a type error then send ephemeral message
            if (error instanceof TypeError) {
                interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                })
            } else {
                interaction.editReply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                })
            }
            // log error to webhook
            log({
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: `${error}`
                    },
                    {
                        name: "Command used",
                        value: `/${interaction.commandName}`
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
                    },
                ]
            });
        }
    }
});

// client events messageCreate
client.on(Events.MessageCreate, async message => {
    // If bot doesnt have permission to send messages then return
    if (!message.content.startsWith(Prefix) || !message.member.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
        return;
    }
    // get command .js files from folder messageCreate
    const messageCreateFiles = fs.readdirSync('./src/messageCreate')
        .filter(file => file.endsWith('.js'));
    // loop through files
    for (const file of messageCreateFiles) {
        // get code from file
        const code = require(`./src/messageCreate/${file}`);
        // if code is not found then return
        if (!code) {
            return;
        }
        try {
            // execute code
            await code.execute(message);
        } catch (error) {
            // if error then log it
            console.error(error);
            // respond with error message
            await message.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
            // log error to webhook
            log({
                interaction: message.content,
                color: "Red",
                description: "Error while executing command",
                fields: [
                    {
                        name: "Error output",
                        value: `${error}`
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

client.on("threadUpdate", async (_oldThread, newThread) => {
    // 1048877201296207882 - Tags id Solved in Yuuki Server
    // Replace 1048877201296207882 with your tags id
    if (newThread.archived === true && newThread.appliedTags.includes("1048877201296207882") === true && newThread.locked === false) {
        // Get user from id
        const user = await client.users.fetch(newThread.ownerId)
        // Create embed
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
        // Send message to user
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
            // If cant send message to user then log it to webhook
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
    } else if (newThread.archived === true && newThread.appliedTags.includes("1048877201296207882") === false && newThread.locked === true) {
        // Get user from id
        const user = await client.users.fetch(newThread.ownerId)
        // Create embed
        const embed = new EmbedBuilder()
            .setTitle("Thread Closed")
            .setDescription("Your thread has been closed as problem solved. and your thread is locked\n\nIf you still need help then create a new thread again.")
            .addFields({
                name: "Thread Name",
                value: newThread.name,
            })
            .addFields({
                name: "Link to Thread",
                value: `[Click Here](${newThread.url})`,
            })
            .setColor("Red")
            .setTimestamp()
        // Send message to user
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
            // If cant send message to user then log it to webhook
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
    } else if (newThread.archived === true && !newThread.appliedTags.includes("1048877201296207882") === false && newThread.locked === true) {
        // Get user from id
        const user = await client.users.fetch(newThread.ownerId)
        // Create embed
        const embed = new EmbedBuilder()
            .setTitle("Thread Closed")
            .setDescription("Your thread has been closed and problem is not solved and your Thread is locked.\n\nIf you still need help then create a new thread again.")
            .addFields({
                name: "Thread Name",
                value: newThread.name,
            })
            .addFields({
                name: "Link to Thread",
                value: `[Click Here](${newThread.url})`,
            })
            .setColor("Red")
            .setTimestamp()
        // Send message to user
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
            // If cant send message to user then log it to webhook
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

// Login to discord with token
client.login(TOKEN);