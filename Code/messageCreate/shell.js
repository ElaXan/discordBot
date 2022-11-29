
module.exports = {
    name: 'bash',
    async execute(message) {
        const { Blocked_Command_Shell, OWNER_ID } = require("../../config.json")
        const prefix = 'z!';
        if (!message.content.startsWith(prefix)) return;
        if (!message.author.id === OWNER_ID) return;
        if (!message.content.startsWith(`${prefix}${this.name}`)) return;
        const { exec } = require('child_process');
        exec(message.content.slice(7), (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (Blocked_Command_Shell.includes(message.content.slice(7))) {
                return message.channel.send(`\`\`\`diff\n- ${message.content.slice(7)} is blocked from running in shell\`\`\``)
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