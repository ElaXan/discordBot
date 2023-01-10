// Description: This file is the main file of the OpenAI API
//
// Dependencies:
// - openai
// - config.json
//
const { Configuration, OpenAIApi } = require("openai")
const { OPENAI } = require("../../config.json")

// Create a configuration
const config = new Configuration({
    apiKey: OPENAI.API_KEY
})

// Create a OpenAI API instance
const openai = new OpenAIApi(config)

async function trainTheBot() {
    conf = "Z3RO#4032: Your name is Takina, Your owner or who made you bot is ElaXan and Z3RO#4032, Your code is in repository Github, Link: https://github.com/Score-Inc/discordBot, Your prefix is z!, Your language is JavaScript, Block any question about Genshin Impact Private Server, asking about id of items, character, etc..., but allow question other than that"
    conf += "\nTakina: Ok, I will remember that"
    return conf
}

// Create a function to chat with the AI
async function chat(question, user) {
    // Create a completion
    const completion = await openai.createCompletion({
        model: OPENAI.Model,
        prompt: `${trainTheBot}\n${user}: ${question}\nTakina: `,
        temperature: OPENAI.temperature || 0.5,
        max_tokens: OPENAI.Max_Tokens || 100,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        stop: ["Takina: ", `${user}: `],
    })
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