const { Configuration, OpenAIApi } = require('openai');
const { OPENAI, OWNER_ID } = require("../../../config.json")
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
            apiKey: OPENAI.API_KEY
        });
        const openai = new OpenAIApi(config);
        await interaction.reply(OPENAI.Process_Text)
        if (interaction.user.id === OWNER_ID) {
            maxToken = OPENAI.Max_Tokens_Owners
        } else {
            maxToken = OPENAI.Max_Tokens_Public.Max_Tokens
        }
        const completion = await openai.createCompletion(
            {
                model: OPENAI.Model,
                prompt: prompt,
                temperature: OPENAI.temperature,
                max_tokens: maxToken,
                top_p: 1
            }
        );
        // Output the completion
        output = completion.data.choices[0].text
        usage = completion.data.usage
        id = completion.data.id
        // Embed
        const embed = new EmbedBuilder()
            .setTitle(OPENAI.Title.Name)
            .setDescription(OPENAI.Description)
            .setColor(`${OPENAI.Color}`)
            .setTimestamp()
            .addFields({
                name: "Answer",
                value: output.slice(0, 700)
            })
            .addFields({
                name: "Suggestions",
                value: OPENAI.Suggestions
            })
            .addFields({
                name: "Note",
                value: OPENAI.Note
            })
            .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
            .setFooter({
                text: OPENAI.Footer
            })
            .setURL(OPENAI.Title.URL)
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
                    name: "ID of Completion",
                    value: id  
                },
                {
                    name: "Usage",
                    value: `prompt: ${usage.prompt_tokens}\ncompletion: ${usage.completion_tokens}\nTotal: ${usage.total_tokens}`
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