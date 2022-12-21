
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Check PING, Uptime, Memory Usage, CPU Usage, Node Version, Discord.js Version, OS',
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
            .addFields({
                name: 'Memory Usage',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            })
            .addFields({
                name: 'CPU Usage',
                value: `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`,
            })
            .addFields({
                name: 'Node Version',
                value: `${process.version}`,
            })
            .addFields({
                name: 'Discord.js Version',
                value: `${require('discord.js').version}`,
            })
            .addFields({
                name: 'OS',
                value: `${process.platform}`,
            })
            .setColor('Green')
            .setTimestamp(new Date())
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        await interaction.reply({ embeds: [embed] })
        log.log({
            interaction: "ping",
            description: "Slash Command PING was used",
            color: "Green",
            fields: [
                {
                    name: "User",
                    value: `${interaction.user.tag}`,
                    inline: true
                },
                {
                    name: "Ping",
                    value: `${new Date().getTime() - interaction.createdTimestamp}ms`,
                    inline: true
                },
                {
                    name: "API Ping",
                    value: `${Math.round(client.ws.ping)}ms`,
                    inline: true
                },
                {
                    name: "Guild",
                    value: `${interaction.guild.name}`,
                    inline: true
                },
                {
                    name: "Channel",
                    value: `${interaction.channel.name}`,
                    inline: true
                },
                {
                    name: "Message ID",
                    value: `${interaction.id}`,
                    inline: true
                },
                {
                    name: "Message URL",
                    value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                    inline: true
                },
            ]
        })
    }
};