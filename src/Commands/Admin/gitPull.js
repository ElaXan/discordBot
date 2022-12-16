module.exports = {
    data: {
        name: 'gitpull',
        description: 'Pull the latest changes from the git repository'
    },
    async execute(interaction) {
        const { OWNER_ID } = require('../../../config.json')
        const { exec } = require('child_process');
        const log = require("../../log/log")
        const { repository } = require("../../../package.json")

        if (interaction.user.id !== OWNER_ID) {
            interaction.reply({ content: `You are not the owner of this bot.\n\nGet the source code from ${repository.url}`, ephemeral: true });
            return log.log("Git Pull", `You are not the owner of this bot.\n\nGet the sources code from ${repository.url}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        await interaction.reply(
            {
                content: `Pulling latest changes from git repository`,
                ephemeral: true
            }
        );
        exec('git pull', (err, stdout, stderr) => {
            if (err) {
                interaction.editReply(
                    {
                        content: `\`\`\`\n${err}\`\`\``,
                        ephemeral: true
                    }
                );
                return log.log("Git Pull", `Error: ${err}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
            }
            if (stderr) {
                interaction.editReply(
                    {
                        content: `\`\`\`\n${stderr}\`\`\``,
                        ephemeral: true
                    }
                );
                return log.log("Git Pull", `Error: ${stderr}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
            }
            interaction.editReply(
                {
                    content: `\`\`\`\n${stdout}\`\`\``,
                    ephemeral: true
                }
            );
            return log.log("Git Pull", `Output: ${stdout}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
        });
    }
}