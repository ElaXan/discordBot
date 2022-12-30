const { Configuration, OpenAIApi } = require("openai")
const { OPENAI } = require("../../../config.json")

const config = new Configuration({
    apiKey: OPENAI.API_KEY
})

const openai = new OpenAIApi(config)

async function chat(question) {
    const completion = await openai.createCompletion({
        model: OPENAI.Model,
        prompt: question,
        temperature: OPENAI.temperature,
        max_tokens: OPENAI.Max_Tokens_Public.Max_Tokens,
        top_p: 1
    })
    return {
        answer: completion.data.choices[0].text,
        usage: completion.data.usage,
        id: completion.data.id
    }
}

async function draw(inspiration) {
    const completion = await openai.createImage({
        prompt: inspiration,
        n: 1,
        size: "256x256"
    })
    return completion.data.data[0].url;
}

module.exports = { chat, draw }