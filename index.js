const { REST, Routes, EmbedBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events2 } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID, OWNER_ID } = require("./config.json")
const { exec } = require('child_process');
const wait = require("node:timers/promises")
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
            {
                name: 'category',
                description: 'Search for a specific category',
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'Avatars',
                        value: 'avatars'
                    },
                    {
                        name: 'Items',
                        value: 'items'
                    },
                    {
                        name: 'Monsters',
                        value: 'monsters'
                    },
                    {
                        name: 'Quest',
                        value: 'quest'
                    },
                    {
                        name: 'Scenes',
                        value: 'scenes'
                    }
                ]
            }
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
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'blacklist',
        description: 'Blacklists a word',
        options: [
            {
                name: 'word',
                description: 'The word to blacklist',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'unblacklist',
        description: 'Unblacklists a word',
        options: [
            {
                name: 'word',
                description: 'The word to unblacklist',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'button',
        description: 'Sends a button',
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
                .setDescription(`\`\`\`js\n${exec(code)}\n\`\`\``)
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
            exec(code, (error, stdout, stderr) => {
                if (error) {
                    const embed = new EmbedBuilder()
                        .setTitle('Shell')
                        .setDescription(`\`\`\`js\n${error}\n\`\`\``)
                        .setColor('Red')
                        .setTimestamp(new Date())
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        });
                    interaction.reply({ embeds: [embed] });
                    logSend(`Shell:\n${error}`, interaction.user.username, interaction.commandName)
                }
                if (stderr) {
                    const embed = new EmbedBuilder()
                        .setTitle('Shell')
                        .setDescription(`\`\`\`js\n${stderr}\n\`\`\``)
                        .setColor('Red')
                        .setTimestamp(new Date())
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        });
                    interaction.reply({ embeds: [embed] });
                    logSend(`Shell:\n${stderr}`, interaction.user.username, interaction.commandName)
                }
                const embed = new EmbedBuilder()
                    .setTitle('Shell')
                    .setDescription(`\`\`\`js\n${stdout}\n\`\`\``)
                    .setColor('Green')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                interaction.reply({ embeds: [embed] });
                logSend(`Shell:\n${stdout}`, interaction.user.username, interaction.commandName)
            });
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
            interaction.reply({ embeds: [embed] });
            logSend(`Shell:\n${error}`, interaction.user.username, interaction.commandName)
        }

    }


    if (interaction.commandName === "gm") {
        const search = interaction.options.getString('search');
        const categories = interaction.options.getString('category');
        const searchUpperCase = search.charAt(0).toUpperCase() + search.slice(1);

        searchGM = async (search, categoryId) => {
            const fs = require('fs');
            const readline = require('readline');
            if (categoryId === "avatars") {
                fileStream = fs.createReadStream('./gm/avatars.txt');
            } else if (categoryId === "quest") {
                fileStream = fs.createReadStream('./gm/quests.txt');
            } else if (categoryId === "items") {
                fileStream = fs.createReadStream('./gm/items.txt');
            } else if (categoryId === "monsters") {
                fileStream = fs.createReadStream('./gm/monsters.txt');
            } else if (categoryId === "scenes") {
                fileStream = fs.createReadStream('./gm/scenes.txt');
            } else {
                fileStream = fs.createReadStream('./gm/gm.txt');
            }
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

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

        const searchResult = await searchGM(searchUpperCase, categories);
        if (searchResult.id === "Not Found" && searchResult.name === "Not Found" && searchResult.category === "Not Found") {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription('Not Found for ' + searchUpperCase)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription(`ID: ${searchResult.id}\nName: ${searchResult.name}\nCategory: ${searchResult.category}`)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            await interaction.reply({ embeds: [embed] });
            logSend(`Search Result:\nID: ${searchResult.id}\nName: ${searchResult.name}\nCategory: ${searchResult.category}`, interaction.user.username, interaction.commandName)


            const button = new MessageButton()
                .setStyle('PRIMARY')
                .setLabel('Copy ID')
                .setCustomId('copyId')
                .setEmoji('📋');
            await interaction.editReply({ components: [button] });

        }
    }

    if (interaction.commandName === "blacklist") {
        const word = interaction.options.getString('word');
        const fs = require('fs');
        const readline = require('readline');
        fileStream = fs.createReadStream('./blacklist.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (line.includes(word)) {
                const embed = new EmbedBuilder()
                    .setTitle('Blacklist')
                    .setDescription('Word is already blacklisted')
                    .setColor('Red')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                await interaction.reply({ embeds: [embed] });
                return;
            }
        }

        fs.appendFile('./blacklist.txt', word + "\n", function (err) {
            if (err) throw err;
            console.log('Saved!');
        }
        );
        const embed = new EmbedBuilder()
            .setTitle('Blacklist')
            .setDescription('Word has been blacklisted')
            .setColor('Green')
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        await interaction.reply({ embeds: [embed] });
        logSend(`Blacklist:\nWord has been blacklisted`, interaction.user.username, interaction.commandName)
    }

    if (interaction.commandName === "unblacklist") {
        const word = interaction.options.getString('word');
        const fs = require('fs');
        const readline = require('readline');
        fileStream = fs.createReadStream('./blacklist.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (line.includes(word)) {
                const data = fs.readFileSync('./blacklist.txt', 'utf8');
                const newValue = data.replace(word + "\n", '');
                fs.writeFileSync('./blacklist.txt', newValue, 'utf8');
                const embed = new EmbedBuilder()
                    .setTitle('Unblacklist')
                    .setDescription('Word has been unblacklisted')
                    .setColor('Green')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                await interaction.reply({ embeds: [embed] });
                logSend(`Unblacklist:\nWord has been unblacklisted`, interaction.user.username, interaction.commandName)
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Unblacklist')
                    .setDescription('Word is not blacklisted')
                    .setColor('Red')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                await interaction.reply({ embeds: [embed] });
            }
        }
    }

    if (interaction.commandName === "button") {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Click me!')
                    .setCustomId('clickButton')
                    // copy to clipboard
                    .setEmoji('📋')
            )
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Close')
                    .setCustomId('closeButton')
                    .setEmoji('❌')
            );
        await interaction.reply({ content: 'Click the button!', components: [row] });
        // if button with customId: clickButton is clicked, them do this
        // update the message
        // please dont use interaction.on('clickButton') in this code. it will not work
        const filter = (i) => i.customId === 'clickButton' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(interaction.client, interaction, filter, { time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'clickButton') {
                await i.update({ content: 'Clicked!', components: [] });
            }
            // if i.customId === 'closeButton' then do delete the message button
            if (i.customId === 'closeButton') {
                await interaction.deleteReply();
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const embed = new EmbedBuilder()
                    .setTitle('Button')
                    .setDescription('Button has not been clicked')
                    .setColor('Red')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                await interaction.editReply({ embeds: [embed] });
                logSend(`Button:\nButton has not been clicked`, interaction.user.username, interaction.commandName)
            }
        });
    }
    if (interaction.commandName === "speedtest") {
        const speedTest = require('speedtest-net');
        const test = speedTest({ maxTime: 5000 });
        test.on('data', data => {
            const embed = new EmbedBuilder()
                .setTitle('Speedtest')
                .setDescription('Speedtest has been completed')
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .addField('Download', data.speeds.download + ' Mbps')
                .addField('Upload', data.speeds.upload + ' Mbps')
                .addField('Ping', data.server.ping + ' ms');
            interaction.reply({ embeds: [embed] });
            logSend(`Speedtest:\nDownload: ${data.speeds.download} Mbps\nUpload: ${data.speeds.upload} Mbps\nPing: ${data.server.ping} ms`, interaction.user.username, interaction.commandName)
        });
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
    const prefix = "!";
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === "melon") {
            // if bot doesn't have permission to react message user
            // TypeError: Cannot read properties of undefined (reading 'permissions')
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                return message.reply({ content: "You do not have permission to delete messages", ephemeral: true });
            }
            if (!message.guild.me.permissions.has("ADD_REACTIONS")) {
                return message.reply("I don't have permission to react message");
            }
            message.react('🍈');
        }
        if (command === "4214") {
            message.reply('4214 is the best number!');
        }
    }

    try {
        const fs = require('fs');
        const readline = require('readline');
        fileStream = fs.createReadStream('./blacklist.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (message.content.includes(line)) {
                message.delete();
                return;
            }
        }
    } catch (err) {
        console.error(err);
    }


});
client.login(TOKEN);