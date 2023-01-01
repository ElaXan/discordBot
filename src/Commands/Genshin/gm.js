const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../log/log');
const { searchGM, getImage, commandsName } = require("../../Utils/Genshin/gmHandbook")
const { Path_GM_Handhook } = require("../../../config.json")
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
        ],
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        const stringsToReplace = [
            ' Or ',
            ' Of ',
            ' A ',
            ' An ',
            ' And ',
            ' The ',
            ' In ',
            ' On ',
            ' To ',
            ' For ',
            ' From ',
            ' With ',
            ' At ',
            ' By ',
            ' Into ',
            ' Near ',
            ' Off ',
            ' Up '
        ];
        let search = focusedValue.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        stringsToReplace.forEach(str => {
            search = search.replace(str, letter => letter.toLowerCase());
        });
        const choices = [];
        const fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        if (search.length < 1) {
            return interaction.respond([{
                name: "Please enter a Name or ID",
                value: "Please enter a Name or ID"
            }])
        } else {
            for await (const line of rl) {
                if (line.startsWith("//")) {
                    category = line.replace("//", "").replace(" ", "");
                }
                if (line.includes(search)) {
                    if (line.length < 1) {
                        choices.push({
                            name: "No results found",
                            value: "No results found"
                        })
                    } else {
                        if (line.split(":")[1] === undefined) {
                            choices.push({
                                name: "??????",
                                value: "No buddy, this is not the results. just dont click and try again :D"
                            })
                        } else {
                            choices.push({
                                name: line.split(":")[1].trim().substring(0, 85) + ` | (${category})`,
                                value: line.split(":")[1].trim().substring(0, 85),
                            })
                        }
                    }
                }
            }
        }
        interaction.respond(choices.slice(0, 25));
    },
    async execute(interaction) {
        const search = interaction.options.getString('search');
        const category = interaction.options.getString('category');
        const stringsToReplace = [
            ' Or ',
            ' Of ',
            ' A ',
            ' An ',
            ' And ',
            ' The ',
            ' In ',
            ' On ',
            ' To ',
            ' For ',
            ' From ',
            ' With ',
            ' At ',
            ' By ',
            ' Into ',
            ' Near ',
            ' Off ',
            ' Up '
        ];
        let searchUpperCase = search.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        for (const str of stringsToReplace) {
            searchUpperCase = searchUpperCase.replace(str, letter => letter.toLowerCase());
        }
        await interaction.deferReply();
        const searchResult = await searchGM(searchUpperCase, category);
        const image = await getImage(searchUpperCase);
        const commands = await commandsName(searchResult.category, searchResult.id);
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
            await interaction.editReply({ embeds: [embed] });
            log.log({
                color: "Red",
                interaction: "GM",
                description: "Not found ID for " + searchUpperCase,
                fields: [
                    {
                        name: "User",
                        value: interaction.user.username
                    },
                    {
                        name: "User ID",
                        value: interaction.user.id
                    },
                    {
                        name: "Guild",
                        value: interaction.guild.name
                    },
                    {
                        name: "Channel",
                        value: interaction.channel.name
                    },
                    {
                        name: "Message Link",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`
                    },
                    {
                        name: "Message ID",
                        value: interaction.id
                    }
                ]
            })
        } else if (searchResult.id === "Error" && searchResult.name === "Error" && searchResult.category === "Error") {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription('Error for find ID ' + searchUpperCase)
                .setColor('Red')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            await interaction.editReply({ embeds: [embed] });
            log.log({
                color: "Red",
                interaction: "GM",
                description: "Error for " + searchUpperCase,
                fields: [
                    {
                        name: "User",
                        value: interaction.user.username
                    },
                    {
                        name: "User ID",
                        value: interaction.user.id
                    },
                    {
                        name: "Guild",
                        value: interaction.guild.name
                    },
                    {
                        name: "Channel",
                        value: interaction.channel.name
                    },
                    {
                        name: "Message Link",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`
                    },
                    {
                        name: "Message ID",
                        value: interaction.id
                    }
                ]
            })
        } else {
            const embed = new EmbedBuilder();
            embed.setTitle('Search Result')
            embed.setDescription(`Found for ${searchResult.name}!`)
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
                name: '📝 Commands',
                value: `${commands}`
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
            log.log({
                color: "Green",
                interaction: "GM",
                description: "Found ID for " + searchUpperCase,
                fields: [
                    {
                        name: "User",
                        value: interaction.user.username
                    },
                    {
                        name: "User ID",
                        value: interaction.user.id
                    },
                    {
                        name: "Guild",
                        value: interaction.guild.name
                    },
                    {
                        name: "Channel",
                        value: interaction.channel.name
                    },
                    {
                        name: "Message Link",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`
                    },
                    {
                        name: "Message ID",
                        value: interaction.id
                    }
                ]
            })

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