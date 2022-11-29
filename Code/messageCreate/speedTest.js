module.exports = {
    name: 'speedtest',
    async execute(message) {
        const { Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        const { exec } = require('child_process');
        message.reply("Running speedtest...").then(async msg => {
            exec('speedtest --simple', (error, stdout, stderr) => {
                if (error) {
                    msg.edit({ content: `\`\`\`bash\nerror:\n${error.message}\`\`\``, ephemeral: true });
                    return;
                }
                if (stderr) {
                    msg.edit({ content: `\`\`\`bash\nstderr:\n${stderr}\`\`\``, ephemeral: true });
                    return;
                }
                msg.edit({ content: `\`\`\`${stdout}\`\`\``, ephemeral: true }).catch(console.error);
            });
        });
    }
}