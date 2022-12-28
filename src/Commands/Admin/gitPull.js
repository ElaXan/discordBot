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
            return log.log({
                interaction: "gitpull",
                description: "Failed to pull latest changes from git because user is not the owner of the bot",
                color: "Red",
                fields: [
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
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
                return log.log({
                    interaction: "gitpull",
                    description: "Failed to pull latest changes from git",
                    color: "Red",
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`\n${err}\`\`\``,
                        },
                        {
                            name: "User",
                            value: `${interaction.user.tag}`,
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
            if (stderr) {
                interaction.editReply(
                    {
                        content: `\`\`\`\n${stderr}\`\`\``,
                        ephemeral: true
                    }
                );
                return log.log({
                    interaction: "gitpull",
                    description: "Successfully git pull commands but there was an error",
                    color: "Yellow",
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`\n${stderr}\`\`\``,
                        },
                        {
                            name: "User",
                            value: `${interaction.user.tag}`,
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
            interaction.editReply(
                {
                    content: `\`\`\`\n${stdout}\`\`\``,
                    ephemeral: true
                }
            );
            return log.log({
                interaction: "gitpull",
                description: "Successfully git pull commands",
                color: "Green",
                fields: [
                    {
                        name: "Output",
                        value: `\`\`\`\n${stdout}\`\`\``,
                    },
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
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
        });
    }
}