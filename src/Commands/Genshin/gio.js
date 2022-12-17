const { EmbedBuilder } = require('discord.js');

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
        name: 'gio',
        description: 'Commands generator for GIO Server',
        options: [
            {
                name: 'uid',
                description: 'UID of the user',
                type: 3,
                required: true,
            },
            {
                name: 'items',
                description: 'Name/ID of the item',
                type: 3,
                required: true,
                autocomplete: true,
            },
            {
                name: 'amount',
                description: 'Amount of items',
                type: 4,
                required: false,
            }
        ],
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
		const choices = ["Character EXP", "Adventure EXP", "Stardust", "Starglitter", "Companionship EXP", "Original Resin", "Story Key", "[CHS] - (test)å¤©ä½æ¨æ¼", "Fading Star's Might", "Fading Star's Essence", "Glimmering Essence", "Warm Essence", "Miraculous Essence", "Iron Coin", "Peace Talisman", "Festive Fever", "Veneficus Sigil", "Festive Tour Ticket", "Peculiar Collab Coupon", "Heart of the Spring", "Trust", "Fractured Fruit Data", "Windtrace Coins", "Shiny Flotsam", 'Mini "Harpastum"', "Enigma Gear", "Thunder Pellet", "Thunder Crystal", "Mechanicus Mastery EXP", "Wondrous Talisman", "Moonchase Festival Festive Fever", "Battered Shikifuda", "Damaged Replica", "Aged Token", "Snowstrider Seal", "Vanquisher's Emblem", "Affluence Talisman", "Immaculate Talisman", "Conquest Talisman", "Moonlit Cragstone", "Iridescent Flotsam", "Stratagem Shard", "Creative Note", "Whimsical Draft", "Ancient Iron Coin", "Festive Fever", "Business Earnings", "Usable Funds", "Strategic Inspiration", "Mushroom Currency", "Fungus Medal", "Shattered Phenocryst", "Primogem", "Mora", "Genesis Crystal", "Realm Currency", "Original Essence (Invalidated)", "Original Resin (Invalidated)", "Masterless Starglitter", "Masterless Stardust", "Intertwined Fate", "Acquaint Fate", "Pyro Sigil", "Hydro Sigil", "Dendro Sigil", "Electro Sigil", "Anemo Sigil", "Cryo Sigil", "Geo Sigil", "Inazuma Reputation EXP", "Mondstadt Reputation EXP", "Sumeru Reputation EXP", "Liyue Reputation EXP", "Memory of Eternal Flames", "Memory of Running Stream", "Memory of Flourishing Green", "Memory of Violet Flash", "Memory of Roving Gales", "Memory of Piercing Frost", "Memory of Immovable Crystals"];
		
        const limitedChoices = choices.filter(choice => choice.startsWith(focusedValue));
        const finalChoices = limitedChoices.length === 0 ? limitedChoices.slice(0, 25) : limitedChoices.length > 25 ? limitedChoices.slice(0, 25) : limitedChoices.slice(0, 25) ? limitedChoices.slice(0,25) : "Not Found";
        const limitedChoices2 = finalChoices.map((choice) =>
            choice.startsWith(focusedValue) ? choice : "not found"
        );
        interaction.respond(
            limitedChoices2.map((choice) => ({
                name: choice,
                value: choice,
            }))
        )
    },
    async execute(interaction) {
        const uid = interaction.options.getString('uid');
        const items = interaction.options.getString('items');
        const amount = interaction.options.getInteger('amount');
        const log = require("../../log/log")
        const search = await searchGM(items, 'items');
        if (search.id === "Not Found" && search.name === "Not Found" && search.category === "Not Found") {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Item not found')
                .setColor('Red')
                .setTimestamp()
            interaction.reply({ embeds: [embed], ephemeral: true });
            return log.log("GIO", `Item not found: ${items}`, interaction.user.discriminator, interaction.user.id, interaction.channel.id, interaction.guild.id);
        } else {
            if (amount === null) {
                interaction.reply({ content: `/mail uid:${uid} command:gitem-${search.id}-<amount>`, ephemeral: true });
                return log.log("GIO", `/mail uid:${uid} command:gitem-${search.id}-<amount>`, interaction.user.discriminator, interaction.user.id, interaction.channel.id, interaction.guild.id);
            }
            interaction.reply({ content: `/mail uid:${uid} command:gitem-${search.id}-${amount}`, ephemeral: true });
            return log.log("GIO", `/mail uid:${uid} command:gitem-${search.id}-${amount}`, interaction.user.discriminator, interaction.user.id, interaction.channel.id, interaction.guild.id);
        }
    }
}