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

module.exports = {
    /**
     * 
     * @param {String} search - Search for the name of the item/monster/avatar/quest
     * @param {String} categoryId - Category of the search (OPTIONAL)
     * @returns 
     */
    searchGM: async (search, categoryId, forceMatch) => {
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
                // get the category starting with "//"
                if (line.startsWith("//")) {
                    category = line.replace("//", "");
                }
                // Check if the line contains the search
                let regex = new RegExp(`${search.replace(/[\(\)\[\]\{\}]/g, '\\$&')}`, 'i');
                // If the line contains the search
                let result = line.match(regex);
                // If result found
                if (result) {
                    // Check if the search is forced to match
                    if (forceMatch) {
                        // Check if the search is not the same as the result
                        if (result.input.split(":")[1].trim() !== result[0]) {
                            continue;
                        }
                    }
                    // Get the id and name
                    const id = result.input.split(":")[0].trim()
                    const name = result.input.split(":")[1].trim()
                    return {
                        id,
                        name,
                        category
                    };
                }
            }

            // If not found
            return {
                id: "Not Found",
                name: "Not Found",
                category: "Not Found",
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
     * @param {String} type - Type of the command (GC or GIO)
     * @returns 
     */
    commandsName: (category, id, type) => {
        // Check the category
        switch (category) {
            // if Avatars
            case " Avatars":
                return type === "GC" ? `/give ${id} lv<level> c<constellation>` : `avatar add ${id}`;
            // if Quests
            case " Quests":
                return type === "GC" ? `/q add ${id}\n/q remove ${id}` : `quest add ${id}\nquest finish ${id}`;
            // if Items
            case " Items":
                return type === "GC" ? `/give ${id} x<amount>` : `item add ${id} <amount>`;
            // if Monsters
            case " Monsters":
                return type === "GC" ? `/spawn ${id} x<amount> lv<level> hp<health>` : `monster ${id} <amount> <level>`;
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
        // Split name into parts
        const parts = name.split("-");
        // Get desired name part depending on the category
        if (category === "Monsters") {
            name = parts[1].trim();
        } else if (category === "Quests") {
            name = parts[0].trim();
        }
        // Get the image from the wiki of Genshin Impact
        const url = `https://genshin-impact.fandom.com/wiki/${name}?file=Item_${name.replace(" ", "_")}.png`;
        try {
            // Fetch the image
            const response = await fetch(url);
            // Get the body
            const body = await response.text();
            // Load the body
            const $ = cheerio.load(body);
            // Get the image of the item/monster/avatar/quest with the class pi-image-thumbnail
            const image = $(".pi-image-thumbnail").attr("src");
            // Return either the requested image of the default "not found" image
            return image || "https://static.thenounproject.com/png/1400397-200.png";
        } catch (err) {
            // Return the default "not found" image if an error was thrown
            return "https://static.thenounproject.com/png/1400397-200.png";
        }
    }
}