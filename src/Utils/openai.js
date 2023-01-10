// Description: This file is the main file of the OpenAI API
//
// Dependencies:
// - openai
// - config.json
//
const { Configuration, OpenAIApi } = require("openai")
const { OPENAI } = require("../../config.json")
const fs = require("fs")

// Create a configuration
const config = new Configuration({
    apiKey: OPENAI.API_KEY
})

// Create a OpenAI API instance
const openai = new OpenAIApi(config)



// Create a function to chat with the AI
async function chat(question, user) {
    // read the file if exist
    let previousResponses = "";
    if (fs.existsSync("./src/cache/" + user)) {
        previousResponses = fs.readFileSync("./src/cache/" + user, "utf8");
    }
    // Create a completion
    const completion = await openai.createCompletion({
        model: OPENAI.Model,
        prompt: `${previousResponses}\n${user}: ${question}\nTakina: `,
        temperature: OPENAI.temperature || 0.5,
        max_tokens: OPENAI.Max_Tokens || 100,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        stop: ["Takina: ", `${user}: `],
    })

    let resultPrompt = `\n${user}: ${question}\nTakina: ${completion.data.choices[0].text.trim()}`;

    // save to file as cache
    // if not exist, create a file
    if (!fs.existsSync("./src/cache")) {
        fs.mkdirSync("./src/cache");
    }
    // check if the conversation already 5 times with "Takina: "

    let count = (previousResponses.match(/Takina: /g) || []).length;
    if (count > 5) {
        // delete the file
        fs.unlinkSync("./src/cache/" + user);
    }

    // write to file not json
    fs.writeFileSync("./src/cache/" + user, resultPrompt, { flag: "a+" });

    // Return the answer
    return {
        answer: completion.data.choices[0].text,
        usage: completion.data.usage,
        id: completion.data.id
    }
}

// Create a function to draw with the AI
async function draw(inspiration) {
    // Create a completion
    const completion = await openai.createImage({
        prompt: inspiration,
        n: 1,
        size: "256x256"
    })
    // Return the answer
    return completion.data.data[0].url;
}
// export the functions
module.exports = { chat, draw }