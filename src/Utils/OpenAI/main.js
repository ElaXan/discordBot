// Description: This file is the main file of the OpenAI API
//
// Dependencies:
// - openai
// - config.json
//
const { Configuration, OpenAIApi } = require("openai")
const { OPENAI } = require("../../../config.json")

// Create a configuration
const config = new Configuration({
    apiKey: OPENAI.API_KEY
})

// Create a OpenAI API instance
const openai = new OpenAIApi(config)

// Create a function to stop the output of the chat
function zstop(getLenght) {
    // if lenght is greeter than 400 lenght return
    return getLenght.lenght > 400
}

// Create a function to chat with the AI
async function chat(question) {
    // Create a completion
    const completion = await openai.createCompletion({
        model: OPENAI.Model,
        prompt: question.replace(/(\r\n|\n|\r)/gm, " "),
        temperature: OPENAI.temperature,
        max_tokens: OPENAI.Max_Tokens_Public.Max_Tokens,
        top_p: 1,
        stop: zstop,
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