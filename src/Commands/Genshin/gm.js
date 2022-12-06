const { EmbedBuilder } = require('discord.js');
const { Path_GM_Handhook } = require('../../../config.json');
const log = require('../../log/log');

// No leak gobloggers tolol

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
                ],
            },
        ],
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
		const choices = [];
        const fs = require('fs');
        const readline = require('readline');
        const fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            if (line.startsWith("//")) {
                category = line.replace("//", "");
            }
            if (line.includes(focusedValue)) {
                const name = line.trim();
                choices.push({
                    name: name,
                    value: name,
                });
            }
        }
        interaction.respond(choices.slice(0, 25));
    },
    async execute(interaction) {
        const search = interaction.options.getString('search');
        const category = interaction.options.getString('category');
        const searchUpperCase = search.replace(/\b\w/g, l => l.toUpperCase());
        //const searchUpperCase = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
        const searchResult = await searchGM(searchUpperCase, category);
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
            log.log('info', `Search Result: Not Found for ${searchUpperCase}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Search Result')
                .setDescription(`ID: ${searchResult.id}\nName: ${searchResult.name}\nCategory:${searchResult.category}`)
                .setColor('Green')
                .setTimestamp(new Date())
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
            log.log('info', `Search Result: ID: ${searchResult.id} Name: ${searchResult.name} Category:${searchResult.category}`, `${interaction.user.tag}`, `${interaction.user.id}`, `${interaction.channel.id}`, `${interaction.guild.id}`);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        };
    }
}