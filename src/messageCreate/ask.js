const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, Prefix, OWNER_ID } = require("../../config.json")

module.exports = {
    name: 'ask',
    async execute(message) {
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        if (message.author.id !== OWNER_ID) return message.reply("Only owners can ask questions.")
        const prompt = message.content.slice(this.name.length + 2);
        const config = new Configuration({
            apiKey: OPENAI_API_KEY
        });
        const openai = new OpenAIApi(config);
        const completion = await openai.createCompletion(
            {
              model: "text-davinci-003",
              prompt: prompt,
              temperature: 0.9,
              max_tokens: 100,
            },
          );
        message.reply(completion.data.choices[0].text)
    }
}