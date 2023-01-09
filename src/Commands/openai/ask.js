const { OPENAI } = require("../../../config.json")
const { EmbedBuilder } = require("discord.js");
const { log } = require('../../log/log');
const { chat } = require("../../Utils/openai")
const { author } = require("../../../package.json")
const fs = require("fs");
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
        const userId = interaction.user.id;
        const blockedUserJson = JSON.parse(fs.readFileSync("./src/blockedUser.json", "utf8"));
        const block = blockedUserJson[`<@${userId}>`];
        if (block !== undefined && block.includes(this.data.name) === true) {
            return interaction.reply({ content: "You are blocked from using this command" });
        }
        await interaction.deferReply();
        const results = await chat(prompt);
        if (results.answer == "") {
            const embed = new EmbedBuilder()
                .setTitle(OPENAI.Title.Name)
                .setDescription("I couldn't find an answer to your question.")
                .setColor("Red")
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
            return log({ interaction: "/ask", color: "Red", description: "Asked a question to OpenAI", fields: [ { name: "Question", value: prompt.slice(0, 200) + "... (truncated)" }, { name: "ID of Completion", value: results.id }, { name: "Usage", value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}` }, { name: "User", value: `${interaction.user.tag} (${interaction.user.id})` }, { name: "Channel", value: `<#${interaction.channel.id}> (${interaction.channel.id})` }, { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})` } ] })
        }
        // if the answer is too long
        if (results.answer.length > 300) {
            // send as a file
            await interaction.editReply({
                content: "The answer is too long to be sent as a message, so I sent it as a file.",
                files: [ { name: "answer.txt", attachment: Buffer.from(`${author.name} (${author.email})\n${author.url}\n\nAnswer:\n${line}\n${results.answer}\n${line}`) } ]
            });
            promptCropped = prompt.slice(0, 200) + "... (truncated)";
            return log({ interaction: "/ask", color: "Green", description: "Asked a question to OpenAI", fields: [ { name: "Question", value: promptCropped }, { name: "ID of Completion", value: results.id }, { name: "Usage", value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}` }, { name: "User", value: `${interaction.user.tag} (${interaction.user.id})` }, { name: "Channel", value: `<#${interaction.channel.id}> (${interaction.channel.id})` }, { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})` } ] })
        }
        // create the embed
        const embed = new EmbedBuilder()
            .setTitle(OPENAI.Title.Name)
            .setDescription(OPENAI.Description)
            .setColor(`${OPENAI.Color}`)
            .setTimestamp()
            .addFields({
                name: "Answer",
                value: results.answer
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
        if (prompt.length > 200) {
            promptCropped = prompt.slice(0, 200) + "... (truncated)";
        }
        log({ interaction: "/ask", color: "Green", description: "Asked a question to OpenAI", fields: [ { name: "Question", value: prompt }, { name: "ID of Completion", value: results.id }, { name: "Usage", value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}` }, { name: "User", value: `${interaction.user.tag} (${interaction.user.id})` }, { name: "Channel", value: `<#${interaction.channel.id}> (${interaction.channel.id})` }, { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})` } ] })
    }
}