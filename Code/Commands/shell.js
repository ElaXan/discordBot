
module.exports = {
    data: {
        name: 'shell',
        description: 'Run shell commands',
        options: [
            {
                name: 'command',
                description: 'Command to run',
                type: 3,
                required: true,
            }
        ]
    },
    async execute(interaction) {
        const { exec } = require('child_process');
        const { OWNER_ID } = require('../../config.json')
        const command = interaction.options.getString('command');
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: 'You are not the owner!', ephemeral: true });
        }
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return interaction.reply({ content: `error: ${err.message}`, ephemeral: true });
            }
            if (stderr) {
                return interaction.reply({ content: `stderr: ${stderr}`, ephemeral: true });
            }
            interaction.reply({ content: `\`\`\`sh\n${stdout}\n\`\`\``, ephemeral: true });
        });
    }
};