
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
            days: Math.floor(client.uptime / 86400000),
            hours: Math.floor(client.uptime / 3600000) % 24,
            minutes: Math.floor(client.uptime / 60000) % 60,
            seconds: Math.floor(client.uptime / 1000) % 60
        };

        uptime.days = uptime.days > 30 ? 30 : uptime.days;
        uptime.hours = uptime.hours > 24 ? 24 : uptime.hours;
        uptime.minutes = uptime.minutes > 60 ? 60 : uptime.minutes;
        uptime.seconds = uptime.seconds > 60 ? 60 : uptime.seconds;


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