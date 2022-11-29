
module.exports = {
    name: 'bash',
    async execute(message) {
        const { Blocked_Command_Shell, OWNER_ID, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (message.author.id !== OWNER_ID) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        if (Blocked_Command_Shell.includes(message.content.slice(Prefix.length + this.name.length + 1))){
            return message.reply({ content: `\`\`\`\n${message.content.slice(Prefix.length + this.name.length + 1)} command is blocked\`\`\``, ephemeral: true });
        }
        const { exec } = require('child_process');
        exec(message.content.slice(7), (error, stdout, stderr) => {
            if (error) {
                message.reply({ content: `\`\`\`bash\nerror:\n${error.message}\`\`\``, ephemeral: true });
                return;
            }
            if (stderr) {
                message.reply({ content: `\`\`\`bash\nstderr:\n${stderr}\`\`\``, ephemeral: true });
                return;
            }
            if (stdout.length > 500) {
                message.channel.send(
                    {
                        content: 'Output too long, sending as file',
                        files: [
                            {
                                attachment: Buffer.from(stdout),
                                name: 'output.txt'
                            }
                        ]
                    }
                );
            } else {
                message.reply({ content: `\`\`\`${stdout}\`\`\``, ephemeral: true }).catch(console.error);
            }
        });
    },
};