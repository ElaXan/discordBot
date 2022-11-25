
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`Ping: ${new Date().getTime() - interaction.createdTimestamp}ms`)
            .setColor('Green')
            .setTimestamp(new Date())
        await interaction.reply({ embeds: [embed] });
    }
};