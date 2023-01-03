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
                let regex = new RegExp(`${focusedValue}`, 'i');
                let result = line.match(regex);
                if (result) {
                    try {
                        choices.push({
                            name: result.input.split(":")[1].trim() + " | (" + category + ")" || "Not Found",
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
            embed.addFields({
                name: '📝 Commands GC',
                value: `${commands}`
            })
            embed.addFields({
                name: '📝 Commands GIO',
                value: `${commandsGIO}`
            })
            embed.setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            });
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Show ID Only')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('show_id')
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Image Bigger')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('image_bigger')
                );
            await interaction.editReply({ embeds: [embed], components: [button] });
            log.log({ color: "Green", interaction: "GM", description: "Found ID for " + search, fields: [{ name: "User", value: interaction.user.username }, { name: "User ID", value: interaction.user.id }, { name: "Guild", value: interaction.guild.name }, { name: "Channel", value: interaction.channel.name }, { name: "Message Link", value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}` }, { name: "Message ID", value: interaction.id }] })

            const filter = (i) => i.customId === 'show_id' || i.customId === "image_bigger" && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'show_id') {
                    await i.deferUpdate();
                    await interaction.editReply({
                        content: `${searchResult.id}`,
                        ephemeral: true,
                        embeds: [],
                        components: []
                    });
                }
                // Show Image
                if (i.customId === 'image_bigger') {
                    embed.setThumbnail(null);
                    embed.setImage(image);
                    const buttonShowImage = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Back')
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId('back')
                        );
                    await i.deferUpdate();
                    await interaction.editReply({
                        content: null,
                        embeds: [embed],
                        components: [buttonShowImage]
                    });
                    const filterShowImage = (i) => i.customId === 'back' && i.user.id === interaction.user.id;
                    const collectorShowImage = interaction.channel.createMessageComponentCollector({ filterShowImage, time: 15000 });
                    collectorShowImage.on('collect', async (i) => {
                        if (i.customId === 'back') {
                            embed.setImage(null);
                            embed.setThumbnail(image);
                            await i.deferUpdate();
                            await interaction.editReply({
                                content: null,
                                embeds: [embed],
                                components: []
                            });
                        }
                    });
                    collectorShowImage.on("end", async () => {
                        embed.setImage(null);
                        embed.setThumbnail(image);
                        await interaction.editReply({ embeds: [embed], components: [] });
                    });
                }
            });
            collector.on("end", async () => {
                await interaction.editReply({ components: [] });
            });
        };
    }
}