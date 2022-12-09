
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction) {
        const log = require("../../log/log")
        const client = interaction.client;
        const uptime = {
            seconds: Math.round(client.uptime / 1000),
            minutes: Math.round(client.uptime / (1000 * 60)),
            hours: Math.round(client.uptime / (1000 * 60 * 60)),
            days: Math.round(client.uptime / (1000 * 60 * 60 * 24)),
        };
        if (Math.round(client.uptime / 1000) < 60) {
            uptime.seconds = Math.round(client.uptime / 1000);
            uptime.minutes = 0;
            uptime.hours = 0;
            uptime.days = 0;
        } else if (Math.round(client.uptime / (1000 * 60)) < 60) {
            uptime.seconds = Math.round(client.uptime / 1000);
            uptime.minutes = Math.round(client.uptime / (1000 * 60));
            uptime.hours = 0;
            uptime.days = 0;
        } else if (Math.round(client.uptime / (1000 * 60 * 60)) < 24) {
            uptime.seconds = Math.round(client.uptime / 1000);
            uptime.minutes = Math.round(client.uptime / (1000 * 60));
            uptime.hours = Math.round(client.uptime / (1000 * 60 * 60));
            uptime.days = 0;
        } else {
            uptime.seconds = Math.round(client.uptime / 1000);
            uptime.minutes = Math.round(client.uptime / (1000 * 60));
            uptime.hours = Math.round(client.uptime / (1000 * 60 * 60));
            uptime.days = Math.round(client.uptime / (1000 * 60 * 60 * 24));
        }
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
                value: `${uptime.days}d ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`,
            })
            .setColor('Green')
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        await interaction.reply({ embeds: [embed] })
        log.log("Ping", `Ping command used by ${interaction.user.tag}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
    }
};