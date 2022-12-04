module.exports = {
    name: "listbc",
    async execute(message) {
        const { Blocked_Command_Shell, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        for (let i = 0; i < Blocked_Command_Shell.length; i++) {
            if (i === 0) {
                var listblockc = `${i + 1}. ${Blocked_Command_Shell[i]}\n`
            } else {
                listblockc += `${i + 1}. ${Blocked_Command_Shell[i]}\n`;
            }
            if (i + 1 === Blocked_Command_Shell.length) {
                message.reply({ content: `\`\`\`\n${listblockc}\n\`\`\`` });
            }
        }
    }
}