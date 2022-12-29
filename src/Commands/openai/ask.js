const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = require("../../../config.json")

module.exports = {
    data: {
        name: "ask",
        description: "Ask a question to OpenAI",
        options: [
            {
                name: "question",
                description: "The question you want to ask",
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const prompt = interaction.options.getString("question");
        const config = new Configuration({
            apiKey: OPENAI_API_KEY
        });
        const openai = new OpenAIApi(config);
        interaction.reply("Processing... Please wait.")
        const completion = await openai.createCompletion(
            {
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.9,
                max_tokens: 1000,
                top_p: 1
            }
        );
        // Output the completion
        output = completion.data.choices[0].text
        // edit the message
        interaction.editReply({
            content: output
        })
    }
}