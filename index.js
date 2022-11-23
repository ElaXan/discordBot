const { REST, Routes, EmbedBuilder, ActivityType, MessageButtonBuilder } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID, OWNER_ID, GM_Handbook_Files } = require("./config.json")
const { exec } = require('child_process');
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'ban',
        description: 'Bans the user',
        options: [
            {
                name: 'user',
                description: 'The user to ban',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for the ban',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'kick',
        description: 'Kicks the user',
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for the kick',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'userinfo',
        description: 'Gets info about a user',
        options: [
            {
                name: 'user',
                description: 'The user to get info about',
                type: 6,
                required: false,
            },
        ],
    },
    {
        name: 'unban',
        description: 'Unbans a user',
        options: [
            {
                name: 'user',
                description: 'The user to unban',
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: 'restart',
        description: 'Restarts the bot',
    },
    {
        name: 'stop',
        description: 'Stops the bot',
    },
    {
        name: 'gm',
        description: 'Get ID from GM Handbook',
        options: [
            {
                name: 'search',
                description: 'Search for a specific ID',
                type: 3,
                required: true
            },
        ],
    },
    {
        name: 'eval',
        description: 'Evaluates a code',
        options: [
            {
                name: 'code',
                description: 'The code to evaluate',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'shell',
        description: 'Executes a shell command',
        options: [
            {
                name: 'command',
                description: 'The command to execute',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'purge',
        description: 'Purges messages',
        options: [
            {
                name: 'amount',
                description: 'The amount of messages to purge',
                type: 4,
                required: true,
            },
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

if (process.getuid && process.getuid() === 0) {
    console.log("You can't run this bot with root permission!");
    process.exit(1);
}
if (process.platform === "win32") {
    console.log("You can't run this bot in Windows!");
    process.exit(1);
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const { Client, GatewayIntentBits } = require('discord.js');

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
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'REACTION',
        'USER',
    ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Fix my Skill Issue Pwease', { type: ActivityType.PLAYING });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        if (Date.now() - interaction.createdTimestamp < 200) {
            color = "Red"
        } else if (Date.now() - interaction.createdTimestamp < 120) {
            color = "Yellow"
        } else if (Date.now() - interaction.createdTimestamp < 80) {
            color = "Green"
        }
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription('Latency is ' + `${Date.now() - interaction.createdTimestamp}` + 'ms\nAPI Latency is ' + `${Math.round(client.ws.ping)}` + 'ms')
            .setColor(color)
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [embed] });
        logSend(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`, interaction.user.username, interaction.commandName)
    }
    if (interaction.commandName === 'ban') {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        if (interaction.user.id !== OWNER_ID) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You are not the owner of the bot!')
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Error: You are not the owner of the bot!`, interaction.user.username, interaction.commandName)
        }
        if (interaction.user.id === OWNER_ID) {
            const embed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Banned ${user.username}`)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Banned ${user.username} for ${reason}`, interaction.user.username, interaction.commandName)
            const embed2 = new EmbedBuilder()
                .setTitle('You got banned!')
                .setDescription(`You got banned from ${interaction.guild.name} for ${reason}`)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            await user.send({ embeds: [embed2] });
            await interaction.guild.members.ban(user.id, { reason: reason });
        }
    }
    if (interaction.commandName === 'kick') {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        try {
            if (user.bot) return interaction.reply({
                content: "You can't kick a bot!",
                ephemeral: true
            });
            if (user.id === interaction.user.id) return interaction.reply({ content: "You can't kick yourself!", ephemeral: true });
            if (!interaction.member.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: "You don't have permission to kick members!", ephemeral: true });

            await interaction.guild.members.kick(
                user,
                {
                    reason: reason
                });
            await interaction.reply({
                content: `Successfully kicked ${user.tag}!`,
                ephemeral: true
            });
            logSend(`Successfully kicked ${user.tag}!`, interaction.user.tag, interaction.commandName)
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: "An error occured!", ephemeral: true });
        }
    }
    if (interaction.commandName === 'userinfo') {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const roles = member.roles.cache.map(role => role.toString()).join(' ');
        const joinAt = new Date(member.joinedTimestamp).toDateString();
        const createdAt = new Date(user.createdTimestamp).toDateString();
        const isBot = user.bot ? 'Yes' : 'No';
        const Roles = roles.replace('@everyone', '');
        const OwnerBot = user.id === OWNER_ID ? 'Yes' : 'No';
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s info`)
            .setDescription(`Username: ${user.tag}\nID: ${user.id}\nAvatar: [Link](${user.displayAvatarURL()})\nRoles: ${Roles}\nBot: ${isBot}\nOwner Bot: ${OwnerBot}\n:Since Join Server: ${joinAt}\nSince Create Account: ${createdAt}`)
            .setColor('Green')
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(new Date())
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

        await interaction.reply({ embeds: [embed] });
        logSend(`User Info:\nUsername: ${user.tag}\nID: ${user.id}\nRoles:\n${Roles}\nBot: ${isBot}\nSince Join Server: ${joinAt}\nSince Create Account: ${user.createdAt.toDateString()}`, interaction.user.username, interaction.commandName)
    }
    if (interaction.commandName === 'unban') {
        if (interaction.user.id !== OWNER_ID) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You are not the owner of the bot!')
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconUrl: interaction.user.avatarURL,
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Error: You are not the owner of the bot!`, interaction.user.username, interaction.commandName)
        }
        if (interaction.user.id === OWNER_ID) {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            await interaction.guild.members.unban(user.id, { reason: reason });
            const embed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Unbanned ${user.username}`)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconUrl: interaction.user.avatarURL,
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Unbanned ${user.username} for ${reason}`, interaction.user.username, interaction.commandName)
        }
    }
    if (interaction.commandName === 'restart') {
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "You are not the bot owner!", ephemeral: true });
        interaction.reply('TODO: restart bot with systemctl');
        logSend('TODO: restart bot with systemctl', interaction.member.user.tag, interaction.commandName);
    }
    if (interaction.commandName === 'stop') {
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "You are not the bot owner!", ephemeral: true });
        interaction.reply({
            content: 'Stopping bot...',
            ephemeral: true
        });
        logSend('Stopping bot...', interaction.member.user.tag, interaction.commandName);
        process.exit(0);
    }

    if (interaction.commandName === 'eval') {
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "You are not the bot owner!", ephemeral: true });
        const code = interaction.options.getString('code');
        try {
            const evaled = await eval(code);
            const embed = new EmbedBuilder()
                .setTitle('Eval')
                .setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Eval:\n${evaled}`, interaction.user.username, interaction.commandName)
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('Eval')
                .setDescription(`\`\`\`js\n${error}\n\`\`\``)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Eval:\n${error}`, interaction.user.username, interaction.commandName)
        }
    }

    if (interaction.commandName === 'shell') {
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "You are not the bot owner!", ephemeral: true });
        const code = interaction.options.getString('code');
        try {
            const { stderr, stdout } = await exec(code);
            // TypeError [ERR_INVALID_ARG_TYPE]: The "file" argument must be of type string. Received null
            // how to fix this? 

            const embed = new EmbedBuilder()
                .setTitle('Shell')
                .setDescription(`\`\`\`js\n${stdout}\n\`\`\``)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Shell:\n${evaled}`, interaction.user.username, interaction.commandName)
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('Shell')
                .setDescription(`\`\`\`js\n${error}\n\`\`\``)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Shell:\n${error}`, interaction.user.username, interaction.commandName)
        }
    }


    if (interaction.commandName === "gm") {
        const search = interaction.options.getString('search');

        const searchUpperCase = search.charAt(0).toUpperCase() + search.slice(1);

        searchGM = async (search) => {
            const fs = require('fs');
            const readline = require('readline');
            const fileStream = fs.createReadStream(GM_Handbook_Files);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            const results = [];

            for await (const line of rl) {
                if (line.startsWith("//")) {
                    category = line.replace("//", "");
                }
                if (line.includes(search)) {
                    const id = line.split(":")[0].trim();
                    const name = line.split(":")[1].trim();
                    return {
                        id: id,
                        name: name,
                        category: category
                    };
                }
            }

            return {
                id: "Not Found",
                name: "Not Found",
                category: "Not Found"
            }
        }
        
        const searchResult = await searchGM(searchUpperCase);
        const embed = new EmbedBuilder()
            .setTitle('Search Result')
            .setDescription(`ID: ${searchResult.id}\nName: ${searchResult.name}\nCategory: ${searchResult.category}`)
            .setColor('Green')
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [embed]});
        logSend(`Search Result:\nID: ${searchResult.id}\nName: ${searchResult.name}\nCategory: ${searchResult.category}`, interaction.user.username, interaction.commandName)
    }

    if (interaction.commandName === "purge") {
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "You are not the bot owner!", ephemeral: true });
        const amount = interaction.options.getInteger('amount');
        if (amount > 100) return interaction.reply({ content: "You can only delete up to 100 messages at a time!", ephemeral: true });
        if (amount < 1) return interaction.reply({ content: "You must delete at least 1 message!", ephemeral: true });
        await interaction.channel.bulkDelete(amount + 1);
        interaction.reply({ content: `Deleted ${amount} messages!`, ephemeral: true });
        logSend(`Deleted ${amount} messages!`, interaction.user.username, interaction.commandName)
    }
});

function logSend(message, request_by, command_used) {
    console.log(`Sent message: ${message}`);
    console.log('--------------------------------');
    console.log('Request by : ' + request_by);
    console.log('--------------------------------');
    console.log('Command used : ' + command_used)
    console.log('--------------------------------');
}


client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;
    console.log(message.content)
    const prefix = "!";
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === "melon") {
            message.react('🍈');
        }
        if (command === "4214") {
            message.reply('4214 is the best number!');
        }
    }
});
client.login(TOKEN);