module.exports = {
    data: {
        name: "about",
        description: "About the bot",
    },
    async execute(interaction) {
        const { EmbedBuilder } = require("discord.js")
        const { version } = require("../../../package.json")
        const { Prefix } = require("../../../config.json")
        const { log } = require("../../log/log")
        const lastCommit = require("child_process").execSync("git log -1 --pretty=%B").toString().trim()
        const availabeSlashCommands = interaction.client.commands.map(command => command.data.name)
        const fs = require("fs")
        const availabePrefixCommands = fs.readdirSync("./src/messageCreate").filter(file => file.endsWith(".js")).map(file => file.slice(0, -3))
        const embed = new EmbedBuilder()
            .setTitle("About")
            .setDescription("This bot is made by [ElaXan](https://elaxan.com) and based on [Discord.js](https://discord.js.org)")
            .addFields({
                name: "Version",
                value: version,
            })
            .addFields({
                name: "Source Code",
                value: "[Click Here](https://github.com/ElaXan/discordBot)",
            })
            .addFields({
                name: "Last Commit",
                value: lastCommit,
            })
            .addFields({
                name: "Available Slash Commands (/)",
                value: availabeSlashCommands.join(", "),
            })
            .addFields({
                name: `Available Prefix Commands (${Prefix})`,
                value: availabePrefixCommands.join(", "),
            })
            .setColor("Green")
            .setTimestamp();
        await interaction.reply({ embeds: [embed] })
        log({
            interaction: "/about",
            color: "Green",
            description: "Sent about message",
            fields: [
                {
                    name: "User",
                    value: `${interaction.user.tag} (${interaction.user.id})`
                },
                {
                    name: "Channel",
                    value: `<#${interaction.channel.id}> (${interaction.channel.id})`
                },
                {
                    name: "Guild",
                    value: `${interaction.guild.name} (${interaction.guild.id})`
                }
            ]
        })
    }
}