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
        const results = await chat(prompt, interaction.user.tag);
        if (results.answer.trim() == "") {
            const embed = new EmbedBuilder()
                .setTitle(OPENAI.Title.Name)
                .setDescription("I couldn't find an answer to your question.")
                .setColor("Red")
                .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
                .setFooter({
                    text: results.id
                })
                .setURL(OPENAI.Title.URL)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                })
            // edit the message
            await interaction.editReply({
                content: null,
                embeds: [embed]
            })
            return log({ interaction: "/ask", color: "Red", description: "Asked a question to OpenAI", fields: [ { name: "Question", value: prompt.slice(0, 200) + "... (truncated)" }, { name: "ID of Completion", value: results.id }, { name: "Usage", value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}` }, { name: "User", value: `${interaction.user.tag} (${interaction.user.id})` }, { name: "Channel", value: `<#${interaction.channel.id}> (${interaction.channel.id})` }, { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})` } ] })
        }
        // if the answer is too long
        if (results.answer.length > 300) {

            const randomWord = [
                "The answer is too long to be sent as a message, so I sent it as a file.",
                "Hey there! The answer is too long to be sent as a message, so I sent it as a file.",
                "I can't send the answer as a message, so I sent it as a file.",
                "I send the answer as a file because it's too long to be sent as a message.",
                "Sorry, I can't send the answer as a message, so I sent it as a file.",
                "Apologies, I can't send the answer as a message, so I sent it as a file.",
                "console.log('The answer is too long to be sent as a message, so I sent it as a file.') :)",
                "console.log('Hey there! The answer is too long to be sent as a message, so I sent it as a file.') :)",
                "console.log('I can't send the answer as a message, so I sent it as a file.') :)",
                "console.log('I send the answer as a file because it's too long to be sent as a message.') :)",
                "console.log('Sorry, I can't send the answer as a message, so I sent it as a file.') :)",
                "console.log('Apologies, I can't send the answer as a message, so I sent it as a file.') :)"
            ]

            // Get random word from "randomWord" array
            const randomWordIndex = Math.floor(Math.random() * randomWord.length);
            const randomWordResult = randomWord[randomWordIndex];

            const embed = new EmbedBuilder()
                .setTitle(OPENAI.Title.Name)
                .setDescription(randomWordResult)
                .setColor("Green")
                .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
                .setFooter({
                    text: results.id
                })
                .setURL(OPENAI.Title.URL)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                })
            // send as a file
            await interaction.editReply({
                embeds: [embed],
                files: [ { name: "answer.txt", attachment: Buffer.from(`${author.name} (${author.email})\n${author.url}\n\nAnswer:\n${line}\n${results.answer}\n${line}`) } ]
            });
            if (prompt.length > 200) {
                promptCropped = prompt.slice(0, 200) + "... (truncated)";
            } else {
                promptCropped = prompt;
            }
            return log({ interaction: "/ask", color: "Green", description: "Asked a question to OpenAI", fields: [ { name: "Question", value: promptCropped }, { name: "ID of Completion", value: results.id }, { name: "Usage", value: `Prompt: ${results.usage.prompt_tokens}\nCompletion: ${results.usage.completion_tokens}\nTotal: ${results.usage.total_tokens}` }, { name: "User", value: `${interaction.user.tag} (${interaction.user.id})` }, { name: "Channel", value: `<#${interaction.channel.id}> (${interaction.channel.id})` }, { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})` } ] })
        }
        // create the embed
        const embed = new EmbedBuilder()
            .setTitle(OPENAI.Title.Name)
            .setDescription(results.answer)
            .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
            .setFooter({
                text: results.id
            })
            .setURL(OPENAI.Title.URL)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL()
            })
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