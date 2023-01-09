const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../log/log');
const { searchGM, getImage, commandsName } = require("../../Utils/gmHandbook")
const { Path_GM_Handhook, OWNER_ID } = require("../../../config.json")
const fs = require('fs');
const readline = require('readline');

module.exports = {
    data: {
        name: 'gm',
        description: 'Search for a ID in the GM Handhook',
        options: [
            {
                name: 'search',
                description: 'Search for a ID in the GM Handhook',
                type: 3,
                required: true,
                autocomplete: true
            },
            {
                name: 'category',
                description: 'The category of the ID',
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'Avatars',
                        value: 'avatars',
                    },
                    {
                        name: 'Quest',
                        value: 'quest',
                    },
                    {
                        name: 'Items',
                        value: 'items',
                    },
                    {
                        name: 'Monsters',
                        value: 'monsters',
                    },
                    {
                        name: 'Scenes',
                        value: 'scenes',
                    },
                    {
                        name: 'Gadgets',
                        value: 'gadgets',
                    }
                ],
            },
            {
                name: 'match',
                description: 'Force match the search',
                type: 5,
                required: false,
            }
        ],
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [];
        const fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        if (focusedValue.length < 1) {
            return interaction.respond([{
                name: "Please enter a Name or ID",
                value: "Please enter a Name or ID"
            }])
        } else {
            for await (const line of rl) {
                if (line.startsWith("//")) {
                    category = line.replace("//", "").replace(" ", "");
                }
                let regex = new RegExp(`${focusedValue.replace(/[\(\)\[\]\{\}]/g, '\\$&')}`, 'i');
                let result = line.match(regex);
                if (result) {
                    try {
                        choices.push({
                            name: result.input.split(":")[1].trim().slice(0,80) + " | (" + category + ")" || "Not Found",
                            value: result.input.split(":")[1].trim() || "Not Found"
                        })
                    } catch (error) {
                        choices.push({
                            name: "Not Found",
                            value: "Not Found"
                        })
                    }
                }
            }
        }
        interaction.respond(choices.slice(0, 25));
    },
    async execute(interaction) {
        // getting the given string from interaction.options 
        const search = interaction.options.getString('search');
        const category = interaction.options.getString('category');
        // getting the given boolean value from interaction.options 
        const match = interaction.options.getBoolean('match');
        // Check if user is blocked from using the command
        const userId = interaction.user.id;
        const blockedUserJson = JSON.parse(fs.readFileSync("./src/blockedUser.json", "utf8"));
        const block = blockedUserJson[`<@${userId}>`];
        if (block !== undefined && block.includes(this.data.name) === true) {
            return interaction.reply({ content: "You are blocked from using this command" });
        }
        // deferring the reply ensuring the reply fetched
        await interaction.deferReply({ fetchReply: true })
        // getting the search result using the given search string, category and match
        const searchResult = await searchGM(search, category, match);
        // get the image using the result of search
        const image = await getImage(searchResult.name, searchResult.category);
        // get the commands with GC
        const commands = commandsName(searchResult.category, searchResult.id, "GC");
        // get the commands with GIO
        const commandsGIO = commandsName(searchResult.category, searchResult.id, "GIO");
        // check whether the search result is not found
        if (searchResult.id === "Not Found" && searchResult.name === "Not Found" && searchResult.category === "Not Found") {
            // creating the new embed builder
            const embed = new EmbedBuilder()
                // set title for the embed
                .setTitle('Search Result')
                // set description for the embed
                .setDescription('Not Found for ' + search)
                // set color for the embed
                .setColor('Red')
                // set timestamp for the embed
                .setTimestamp(new Date())
                // set the footer of the embed
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            // edit the reply with the embed
            await interaction.editReply({ embeds: [embed] });
            // logging the failed search result with given values
            log.log({ color: "Red", interaction: "GM", description: "Not found ID for " + search, fields: [{ name: "User", value: interaction.user.username }, { name: "User ID", value: interaction.user.id }, { name: "Guild", value: interaction.guild.name }, { name: "Channel", value: interaction.channel.name }, { name: "Message Link", value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}` }, { name: "Message ID", value: interaction.id }] })
        } else if (searchResult.id === "Error" && searchResult.name === "Error" && searchResult.category === "Error") {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription('Error for find ID ' + search)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.editReply({ embeds: [embed] });
            log.log({ color: "Red", interaction: "GM", description: "Error for " + search, fields: [{ name: "User", value: interaction.user.username }, { name: "User ID", value: interaction.user.id }, { name: "Guild", value: interaction.guild.name }, { name: "Channel", value: interaction.channel.name }, { name: "Message Link", value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}` }, { name: "Message ID", value: interaction.id }] })
        } else {
            const embed = new EmbedBuilder();
            embed.setTitle('Search Result')
            embed.setDescription(`This is still on development, if you have any suggestion please contact <@${OWNER_ID}>`)
            embed.setColor('Green')
            embed.setThumbnail(image)
            embed.setTimestamp(new Date())
            embed.addFields({
                name: '🆔 ID',
                value: searchResult.id,
                inline: true
            })
            embed.addFields({
                name: '🔖 Name',
                value: searchResult.name,
            })
            embed.addFields({
                name: '🗃️ Category',
                value: searchResult.category,
            })
            embed.setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            });
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Commands GC')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('commands_gc')
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Commands GIO')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('commands_gio')
                )
            await interaction.editReply({ embeds: [embed], components: [button] });
            log.log({ color: "Green", interaction: "GM", description: "Found ID for " + search, fields: [{ name: "User", value: interaction.user.username }, { name: "User ID", value: interaction.user.id }, { name: "Guild", value: interaction.guild.name }, { name: "Channel", value: interaction.channel.name }, { name: "Message Link", value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}` }, { name: "Message ID", value: interaction.id }] })

            const filter = (i) => i.customId === "commands_gc" || i.customId === "commands_gio" && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'commands_gc') {
                    const embed_gc = new EmbedBuilder();
                    embed_gc.setTitle("Commands GC")
                    embed_gc.setDescription(`List of commands for${searchResult.category} category`)
                    embed_gc.setColor("Green")
                    embed_gc.setThumbnail(image)
                    embed_gc.setTimestamp()
                    embed_gc.setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                    if (searchResult.category === " Avatars") {
                        embed_gc.addFields({
                            name: "Normal",
                            value: commands.commands_1
                        })
                        embed_gc.addFields({
                            name: "With Level",
                            value: commands.commands_2
                        })
                        embed_gc.addFields({
                            name: "With Constellation",
                            value: commands.commands_3
                        })
                        embed_gc.addFields({
                            name: "With Level and Constellation",
                            value: commands.commands_4
                        })
                    } else if (searchResult.category === " Quests") {
                        embed_gc.addFields({
                            name: "Add Quest",
                            value: commands.commands_1
                        })
                        embed_gc.addFields({
                            name: "Remove Quest",
                            value: commands.commands_2
                        })
                    } else if (searchResult.category === " Items") {
                        embed_gc.addFields({
                            name: "Normal",
                            value: commands.commands_1
                        })
                        embed_gc.addFields({
                            name: "With Amount",
                            value: commands.commands_2
                        })
                        embed_gc.addFields({
                            name: "If Artifact",
                            value: commands.commands_3
                        })
                        embed_gc.addFields({
                            name: "If Weapon",
                            value: commands.commands_4
                        })
                    } else if (searchResult.category === " Monsters") {
                        embed_gc.addFields({
                            name: "Normal",
                            value: commands.commands_1
                        })
                        embed_gc.addFields({
                            name: "With amount",
                            value: commands.commands_2
                        })
                        embed_gc.addFields({
                            name: "With amount and level",
                            value: commands.commands_3
                        })
                        embed_gc.addFields({
                            name: "With amount, level and hp",
                            value: commands.commands_4
                        })
                    } else {
                        embed_gc.addFields({
                            name: "Not available",
                            value: "No commands available for this category"
                        })
                    }
                    await i.deferUpdate();
                    await interaction.editReply({
                        content: null,
                        embeds: [embed_gc],
                        components: []
                    });
                }
                if (i.customId === 'commands_gio') {
                    const embed_gio = new EmbedBuilder();
                    embed_gio.setTitle("Commands GIO")
                    embed_gio.setDescription(`List of commands for${searchResult.category} category`)
                    embed_gio.setColor("Green")
                    embed_gio.setThumbnail(image)
                    embed_gio.setTimestamp()
                    embed_gio.setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });
                    if (searchResult.category === " Avatars") {
                        embed_gio.addFields({
                            name: "Normal",
                            value: commandsGIO.commands_1
                        })
                        embed_gio.addFields({
                            name: "With Level",
                            value: commandsGIO.commands_2
                        })
                        embed_gio.addFields({
                            name: "With Constellation",
                            value: commandsGIO.commands_3
                        })
                        embed_gio.addFields({
                            name: "With Level and Constellation",
                            value: commandsGIO.commands_4
                        })
                    } else if (searchResult.category === " Quests") {
                        embed_gio.addFields({
                            name: "Add Quest",
                            value: commandsGIO.commands_1
                        })
                        embed_gio.addFields({
                            name: "Remove Quest",
                            value: commandsGIO.commands_2
                        })
                    } else if (searchResult.category === " Items") {
                        embed_gio.addFields({
                            name: "Normal",
                            value: commandsGIO.commands_1
                        })
                        embed_gio.addFields({
                            name: "With Amount",
                            value: commandsGIO.commands_2
                        })
                        embed_gio.addFields({
                            name: "If Artifact",
                            value: commandsGIO.commands_3
                        })
                        embed_gio.addFields({
                            name: "If Weapon",
                            value: commandsGIO.commands_4
                        })
                    } else if (searchResult.category === " Monsters") {
                        embed_gio.addFields({
                            name: "Normal",
                            value: commandsGIO.commands_1
                        })
                        embed_gio.addFields({
                            name: "With amount",
                            value: commandsGIO.commands_2
                        })
                        embed_gio.addFields({
                            name: "With amount and level",
                            value: commandsGIO.commands_3
                        })
                        embed_gio.addFields({
                            name: "With amount, level and hp",
                            value: commandsGIO.commands_4
                        })
                    } else {
                        embed_gio.addFields({
                            name: "Not available",
                            value: "No commands available for this category"
                        })
                    }
                    await i.deferUpdate();
                    await interaction.editReply({
                        content: null,
                        embeds: [embed_gio],
                        components: []
                    });
                }
            });
            collector.on("end", async () => {
                await interaction.editReply({ components: [] });
            });
        };
    }
}