module.exports = {
    name: "eval",
    async execute(message) {
        const { OWNER_ID, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (message.author.id !== OWNER_ID) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        try {
            const code = message.content.slice(6);
            const output = eval(code);
        } catch (err) {
            message.reply({ content: `\`\`\`js\nError:\n${err}\n\`\`\``, ephemeral: true });
        }
    }
}