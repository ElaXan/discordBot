const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Path_GM_Handhook } = require('../../../config.json');
const log = require('../../log/log');

searchGM = async (search, categoryId) => {
    const fs = require('fs');
    const readline = require('readline');
    if (categoryId === "avatars") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Avatars}`);
    } else if (categoryId === "quest") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Quest}`);
    } else if (categoryId === "items") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Items}`);
    } else if (categoryId === "monsters") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Monsters}`);
    } else if (categoryId === "scenes") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Scenes}`);
    } else if (categoryId === "gadgets") {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Gadgets}`);
    } else {
        fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
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
},

/**
* @param {String} category - The category of the ID for search command name
* @param {String} id - The ID of the item
*/
commandsName = async (category, id) => {
    if (category === " Avatars") {
        return `/give ${id} lv<level> c<constellation>`;
    } else if (category === " Quests") {
        return `/q add ${id}\n/q remove ${id}`;
    } else if (category === " Items") {
        return `/give ${id} x<amount>`;
    } else if (category === " Monsters") {
        return `/spawn ${id} x<amount> lv<level> hp<health>`;
    } else {
        return `Not yet applied to category${category}`
    }
}

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
        const search = focusedValue.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/( Or | The | A | Of )/g, letter => letter.toLowerCase());
        //const search = focusedValue.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        const choices = [];
        const fs = require('fs');
        const readline = require('readline');
        const fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        if (search.length === 0) {
            choices.push({
                name: "Please type something",
                value: "Please type something",
            });
        } else {
            for await (const line of rl) {
                if (line.startsWith("//")) {
                    category = line.replace("//", "").replace(" ", "");
                }
                if (line.includes(search)) {
                    if (line.length < 1) {
                        choices.push({
                            name: "Not Found",
                            value: "Not Found",
                        })
                    } else {
                        choices.push({
                            name: line.split(":")[1].trim().substring(0, 85) + ` | (${category})`,
                            value: line.split(':')[1].trim().substring(0, 85)
                        });
                    }
                }
            }
        }
        interaction.respond(choices.slice(0, 25));
    },
    async execute(interaction) {
        const search = interaction.options.getString('search');
        const category = interaction.options.getString('category');
        const searchUpperCase = search.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/( Or | The | A | Of )/g, letter => letter.toLowerCase());
        const searchResult = await searchGM(searchUpperCase, category);
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
            await interaction.reply({ embeds: [embed] });
            log.log("GM", `Not found ID for ${searchUpperCase}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription(`Found for ${searchResult.name}!`)
                .setColor('Green')
                .setTimestamp(new Date())
                .addFields({
                    name: '🆔 ID',
                    value: searchResult.id,
                    inline: true
                })
                .addFields({
                    name: '🔖 Name',
                    value: searchResult.name,
                })
                .addFields({
                    name: '🗃️ Category',
                    value: searchResult.category,
                })
                .addFields({
                    name: '📝 Commands',
                    value: `${commands}`
                })
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Show ID Only')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('show_id')
                );
            await interaction.reply({ embeds: [embed], components: [button] });
            log.log("GM", `Found ID for ${searchUpperCase}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)

            const filter = (i) => i.customId === 'show_id' && i.user.id === interaction.user.id;
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
            });
            collector.on("end", async () => {
                await interaction.editReply({ components: [] });
            });
        };
    }
}