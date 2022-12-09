
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction) {
        const log = require("../../log/log")
        const client = interaction.client;
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription("Check PING")
            .addFields({
                name: 'Ping',
                value: `${new Date().getTime() - interaction.createdTimestamp}ms`,
            })
            .addFields({
                name: 'API Ping',
                value: `${Math.round(client.ws.ping)}ms`,
            })
            .addFields({
                name: 'Uptime',
                value: `${Math.round(client.uptime / 1000)}s`,
            })
            .setColor('Green')
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        await interaction.reply({ embeds: [embed] })
        log.log("Ping", `Ping: ${new Date().getTime() - interaction.createdTimestamp}ms | API Ping: ${Math.round(client.ws.ping)}ms | Uptime: ${Math.round(client.uptime / 1000)}s`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
    }
};