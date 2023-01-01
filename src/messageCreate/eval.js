module.exports = {
    name: "eval",
    async execute(message) {
        const { OWNER_ID, Prefix } = require("../../config.json")
        // No need to require discord.js, it's already required in the main file, maybe i will add a check for that later
        const {
            Client,
            Collection,
            EmbedBuilder,
            Guild,
            GuildMember,
            Message,
            ActionRowBuilder,
            ButtonBuilder,
            ButtonStyle,
            SelectMenuBuilder,
            SelectMenuOptionBuilder,
        } = require("discord.js");
        if (!message.content.startsWith(Prefix) || message.author.id !== OWNER_ID || !message.content.startsWith(`${Prefix}${this.name}`)) return;
        const log = require("../log/log").log
        try {
            const code = message.content.slice(6);
            const output = eval(code);
            log({ color: "Green", interaction: "Eval", description: `Command Eval was used`, fields: [{ name: "Output", value: `\`\`\`js\n${output}\n\`\`\``, }, { name: "Used by", value: `${message.author.tag} (${message.author.id})`, }, { name: "Used in", value: `${message.channel.name} (${message.channel.id})`, }, { name: "Used in guild", value: `${message.guild.name} (${message.guild.id})`, }] })
        } catch (err) {
            message.reply({ content: `\`\`\`js\nError:\n${err}\n\`\`\``, ephemeral: true });
            log({ color: "Red", interaction: "Eval", description: `Error while executing command Eval`, fields: [{ name: "Error", value: `\`\`\`js\n${err}\n\`\`\``, }, { name: "Used by", value: `${message.author.tag} (${message.author.id})`, }, { name: "Used in", value: `${message.channel.name} (${message.channel.id})`, }, { name: "Used in guild", value: `${message.guild.name} (${message.guild.id})`, }] })
        }
    }
}