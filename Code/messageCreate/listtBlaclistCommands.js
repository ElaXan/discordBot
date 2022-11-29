module.exports = {
    name: "listbc",
    async execute(message) {
        const { Blocked_Command_Shell, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        for (let i = 0; i < Blocked_Command_Shell.length; i++) {
            list += `${i + 1}. ${Blocked_Command_Shell[i]}\n`;
        }
        message.reply({ content: `\`\`\`${list}\`\`\``, ephemeral: true });
    }
}