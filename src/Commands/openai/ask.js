const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = require("../../../config.json")
const { EmbedBuilder } = require("discord.js");
const { log } = require('../../log/log');
const { author } = require("../../../package.json")

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
        // Embed
        const embed = new EmbedBuilder()
            .setTitle("OpenAI")
            .setDescription("Here is the answer to your question")
            .setColor("Green")
            .setTimestamp()
            .addFields({
                name: "Answer",
                value: output
            })
            .addFields({
                name: "Suggestions",
                value: "If you think the answer is not correct, please send more details"
            })
            .addFields({
                name: "Note",
                value: "If the answer is cropped, then max_tokens is too low."
            })
            .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
            .setFooter({
                text: `Using API by ${author.name}`
            })
            .setURL("https://openai.com/")
        // edit the message
        await interaction.editReply({
            content: null,
            embeds: [embed]
        })
        log({
            interaction: "/ask",
            color: "Green",
            description: "Asked a question to OpenAI",
            fields: [
                {
                    name: "Question",
                    value: prompt
                },
                {
                    name: "User",
                    value: `${interaction.user.tag} (${interaction.user.id})`
                },
                {
                    name: "Channel",
                    value: `<#${interaction.channel.id}> (${interaction.channel.id})`
                },
                {
                    name: "Guild",
                    value: `${interaction.guild.name} (${interaction.guild.id})`
                }
            ]
        })
    }
}