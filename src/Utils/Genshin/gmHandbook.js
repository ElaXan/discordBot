const fs = require('fs');
const readline = require('readline');
const { Path_GM_Handhook } = require("../../../config.json")
const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = {
    /**
     * 
     * @param {String} search - Search for the name of the item/monster/avatar/quest
     * @param {String} categoryId - Category of the search (OPTIONAL)
     * @returns 
     */
    searchGM: async (search, categoryId) => {
        switch (categoryId) {
            case "avatars":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Avatars}`);
                break;
            case "quest":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Quest}`);
                break;
            case "items":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Items}`);
                break;
            case "monsters":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Monsters}`);
                break;
            case "scenes":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Scenes}`);
                break;
            case "gadgets":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Gadgets}`);
                break;
            default:
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
                break;
        }
        try {
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
            };
        } catch (error) {
            console.error(error);
            return {
                id: "Error",
                name: "Error",
                category: "Error"
            };
        }
    },
    /**
     * 
     * @param {String} category - Category of the ID
     * @param {String} id - ID of name items/monsters/avatars/quests
     * @returns 
     */
    commandsName: (category, id) => {
        switch (category) {
            case " Avatars":
                return `/give ${id} lv<level> c<constellation>`;
            case " Quests":
                return `/q add ${id}\n/q remove ${id}`;
            case " Items":
                return `/give ${id} x<amount>`;
            case " Monsters":
                return `/spawn ${id} x<amount> lv<level> hp<health>`;
            default:
                return `Not yet applied to category ${category}`;
        }
    },
    /**
     * 
     * @param {String} name - Name of the item/monster/avatar/quest to get the image
     * @returns 
     */
    getImage: async (name) => {
        const url = `https://genshin-impact.fandom.com/wiki/${name}?file=Item_${name.replace(" ", "_")}.png`;

        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const image = $(".pi-image-thumbnail").attr("src");
        if (image === undefined) {
            return "https://static.thenounproject.com/png/1400397-200.png";
        } else {
            return image;
        }
    },
    autocomplete: async (search) => {
        const choices = [];
        const fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            if (line.startsWith("//")) {
                category = line.replace("//", "").replace(" ", "");
            }
            if (line.includes(search)) {
                if (line.length < 1) {
                    return [
                        {
                            name: "Not Found",
                            value: "Not Found"
                        }
                    ]
                } else {
                    choices.push({
                        name: line.split(":")[1].trim().substring(0, 85) + ` | (${category})`,
                        value: line.split(":")[1].trim().substring(0, 85),
                    })
                    return choices;
                }
            }

        }
    }
}