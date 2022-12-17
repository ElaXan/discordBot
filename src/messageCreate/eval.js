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
        if (!message.content.startsWith(Prefix)) return;
        if (message.author.id !== OWNER_ID) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        const log = require("../log/log").log
        try {
            const code = message.content.slice(6);
            const output = eval(code);
            log("Eval", `Eval: ${output}`, message.author.tag, message.author.id, message.channel.id, message.guild.id);
        } catch (err) {
            message.reply({ content: `\`\`\`js\nError:\n${err}\n\`\`\``, ephemeral: true });
            log("Eval", `Error: ${err}`, message.author.tag, message.author.id, message.channel.id, message.guild.id);
        }
    }
}