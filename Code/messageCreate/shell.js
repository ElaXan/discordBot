
module.exports = {
    name: 'bash',
    async execute(message) {
        const { OWNER_ID } = require("../../config.json")
        // if message author is not me, return
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
            if (message.content === `z!${this.name} clear`) return message.reply({ content: 'Blocked Command', ephemeral: true });
            // if message too long 500 characters, send message in a file
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