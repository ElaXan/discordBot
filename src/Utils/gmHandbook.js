// Description: This file is used to search for the name of the item/monster/avatar/quest and get the image of the item/monster/avatar/quest
// Author: ElaXan
// Dependencies:
// - config.json
// - node-fetch
// - cheerio
// - fs
// - readline
//

// Get the config
const fs = require('fs');
const readline = require('readline');
const { Path_GM_Handhook } = require("../../config.json")
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
    /**
     * 
     * @param {String} search - Search for the name of the item/monster/avatar/quest
     * @param {String} categoryId - Category of the search (OPTIONAL)
     * @returns 
     */
    searchGM: async (search, categoryId) => {
        // Check if the categoryId is null
        switch (categoryId) {
            // if Avatars
            case "avatars":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Avatars}`);
                break;
            // if Quests
            case "quest":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Quest}`);
                break;
            // if Items
            case "items":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Items}`);
                break;
            // if Monsters
            case "monsters":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Monsters}`);
                break;
            // if Scenes
            case "scenes":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Scenes}`);
                break;
            // if Gadgets
            case "gadgets":
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.Gadgets}`);
                break;
            // if null
            default:
                fileStream = fs.createReadStream(`${Path_GM_Handhook.Path}/${Path_GM_Handhook.If_Choices_is_Null}`);
                break;
        }
        try {
            // Read the file
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            // Search for the name
            for await (const line of rl) {
                // Get the category
                if (line.startsWith("//")) {
                    category = line.replace("//", "");
                }
                // Get the name
                if (line.includes(search)) {
                    // Check if the line is undefined
                    if (line === undefined) {
                        return {
                            id: "Not Found",
                            name: "Not Found",
                            category: "Not Found"
                        };
                    }
                    // Get the id and name
                    const id = line.split(":")[0].trim();
                    const name = line.split(":")[1].trim();
                    // return the id, name and category
                    return {
                        id: id,
                        name: name,
                        category: category
                    };
                }
            }

            // If not found
            return {
                id: "Not Found",
                name: "Not Found",
                category: "Not Found"
            };
        } catch (error) {
            // If error
            console.error(error);
            // return the error
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
    commandsNameGC: (category, id) => {
        // Check the category
        switch (category) {
            // if Avatars
            case " Avatars":
                return `/give ${id} lv<level> c<constellation>`;
            // if Quests
            case " Quests":
                return `/q add ${id}\n/q remove ${id}`;
            // if Items
            case " Items":
                return `/give ${id} x<amount>`;
            // if Monsters
            case " Monsters":
                return `/spawn ${id} x<amount> lv<level> hp<health>`;
            // Default (if not found)
            default:
                return `Not yet applied to category ${category}`;
        }
    },
    /**
     * 
     * @param {String} category - Category of the ID
     * @param {String} id - ID of name items/monsters/avatars/quests
     * @returns 
     */
    commandsNameGIO: (category, id) => {
        // Check the category
        switch (category) {
            // if Avatars
            case " Avatars":
                return `avatar add ${id}`;
            // if Quests
            case " Quests":
                return `quest add ${id}\nquest finish ${id}`;
            // if Items
            case " Items":
                return `item add ${id} <amount>`;
            // if Monsters
            case " Monsters":
                return `monster ${id} <amount> <level>`;
            // Default (if not found)
            default:
                return `Not yet applied to category ${category}`;
        }
    },
    /**
     * 
     * @param {String} name - Name of the item/monster/avatar/quest to get the image
     * @param {String} category - Category of the name
     * @returns 
     */
    getImage: async (name, category) => {
        if (category === " Monsters") {
            // split the name by "-" and get the second index
            name = name.split("-")[1].trim();
        }
        // Get the image from the wiki of Genshin Impact
        const url = `https://genshin-impact.fandom.com/wiki/${name}?file=Item_${name.replace(" ", "_")}.png`;

        // Fetch the image
        const response = await fetch(url);
        // Get the body
        const body = await response.text();
        // Load the body
        const $ = cheerio.load(body);
        // Get the image of the item/monster/avatar/quest with the class pi-image-thumbnail
        const image = $(".pi-image-thumbnail").attr("src");
        if (image === undefined) {
            // If the image is undefined, return the image
            return "https://static.thenounproject.com/png/1400397-200.png";
        } else {
            // If the image is not undefined, return the image
            return image;
        }
    }
}