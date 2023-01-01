module.exports = {
    data: {
        name: 'upload',
        description: 'Upload a file to the server',
        options: [
            {
                name: 'file',
                description: 'File to upload',
                type: 3,
                required: true,
            },
        ]
    },
    async execute(interaction) {
        const { OWNER_ID } = require('../../../config.json')
        const fs = require('fs');
        const file = interaction.options.getString('file');
        const path = require('path');
        const basename = path.basename(file);
        const getPath = path.dirname(file);
        const process = require('process');
        const getSizeOfFile = fs.statSync(file).size;
        const log = require("../../log/log")

        if (interaction.user.id !== OWNER_ID) {
            interaction.reply({ content: 'You are not the owner of this bot.', ephemeral: true });
            return log.log("Upload", `You are not the owner of this bot.`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }

        if (!fs.existsSync(file)) {
            interaction.reply({ content: 'File not found.', ephemeral: true });
            return log.log({ interaction: "upload", color: "Red", description: `File not found.`, fields: [{ name: "User", value: `${interaction.user.tag}`, inline: true }, { name: "File", value: `${basename}`, inline: true }, { name: "Directory", value: `${getPath}`, inline: true }, { name: "Guild", value: `${interaction.guild.name}`, inline: true }, { name: "Channel", value: `${interaction.channel.name}`, inline: true }, { name: "Message ID", value: `${interaction.id}`, inline: true }] })
        }
        if (getPath === ".") {
            const getPath = process.cwd();
            await interaction.reply(
                {
                    content: `Uploading ${basename}`
                }
            );
            await interaction.editReply(
                {
                    content: `\`\`\`\nName : ${basename}\nDirectory : ${getPath}\nSize : ${getSizeOfFile} bytes\`\`\``,
                    files: [
                        file
                    ]
                }
            );
            return log.log({ interaction: "upload", color: "Green", description: `Uploading ${basename} Directory ${getPath}`, fields: [{ name: "User", value: `${interaction.user.tag}`, inline: true }, { name: "File", value: `${basename}`, inline: true }, { name: "Directory", value: `${getPath}`, inline: true }, { name: "Guild", value: `${interaction.guild.name}`, inline: true }, { name: "Channel", value: `${interaction.channel.name}`, inline: true }, { name: "Message ID", value: `${interaction.id}`, inline: true }] })
        }
        await interaction.reply(
            {
                content: `Uploading ${basename}`
            }
        );
        await interaction.editReply(
            {
                content: `\`\`\`\nName : ${basename}\nDirectory : ${getPath}\nSize : ${getSizeOfFile} bytes\`\`\``,
                files: [
                    file
                ]
            }
        );
        return log.log({ interaction: "upload", color: "Green", description: `Uploading ${basename} Directory ${getPath}`, fields: [{ name: "User", value: `${interaction.user.tag}`, inline: true }, { name: "File", value: `${basename}`, inline: true }, { name: "Directory", value: `${getPath}`, inline: true }, { name: "Guild", value: `${interaction.guild.name}`, inline: true }, { name: "Channel", value: `${interaction.channel.name}`, inline: true }, { name: "Message ID", value: `${interaction.id}`, inline: true }] })
    }
}