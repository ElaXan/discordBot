module.exports = {
    data: {
        name: 'restart',
        description: 'Restarts the bot',
    },
    async execute(interaction) {
        const { OWNER_ID } = require("../../../config.json")
        const { exec } = require("child_process");
        const log = require("../../log/log")
        if (interaction.user.id !== OWNER_ID) {
            interaction.reply({ content: "You are not my owner!", ephemeral: true })
            return log.log("Restart", "You are not my owner!", interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
        };
        exec("systemctl restart discordbot", (error, stdout, stderr) => {
            if (error) {
                interaction.reply("error: " + error.message);
                return log.log("Restart", `error: ${error.message}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
            }
            if (stderr) {
                interaction.reply("stderr: " + stderr);
                return log.log("Restart", `stderr: ${stderr}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
            }
            interaction.reply("Restart successful!")
            return log.log("Restart", `stdout: ${stdout}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
        });
    }
}