
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction) {
        const log = require("../../log/log")
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`Ping: ${new Date().getTime() - interaction.createdTimestamp}ms`)
            .setColor('Green')
            .setTimestamp(new Date())
        await interaction.reply({ embeds: [embed] })
        log.log("Ping", `Ping: ${new Date().getTime() - interaction.createdTimestamp}ms`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
    }
};