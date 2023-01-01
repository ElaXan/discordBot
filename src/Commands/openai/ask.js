const { OPENAI } = require("../../../config.json")
const { EmbedBuilder } = require("discord.js");
const { log } = require('../../log/log');
const { chat } = require("../../Utils/OpenAI/main")
const { author } = require("../../../package.json")
let line = "----------------------------------------"

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
        await interaction.deferReply();
        const results = await chat(prompt);
        // Output the completion
        if (results.answer.length > 400) {
            // send as a file
            await interaction.editReply({
                content: "The answer is too long to be sent as a message, so I sent it as a file.",
                files: [
                    {
                        name: "answer.txt",
                        attachment: Buffer.from(`${author.name} (${author.email})\n${author.url}\n\nAnswer:\n${line}\n${results.answer}\n${line}`)
                    }
                ]
            })
            return log({
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
                        value: results.id
                    },
                    {
                        name: "Usage",
                        value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}`
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
        const embed = new EmbedBuilder()
            .setTitle(OPENAI.Title.Name)
            .setDescription(OPENAI.Description)
            .setColor(`${OPENAI.Color}`)
            .setTimestamp()
            .addFields({
                name: "Answer",
                value: results.answer.slice(0, 700)
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
                    value: results.id
                },
                {
                    name: "Usage",
                    value: `Prompt: ${results.usage.prompt_tokens}\nXompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}`
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