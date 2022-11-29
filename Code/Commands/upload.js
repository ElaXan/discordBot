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
        const { OWNER_ID } = require('../../config.json')
        const fs = require('fs');
        const file = interaction.options.getString('file');
        const path = require('path');
        const basename = path.basename(file);
        const getPath = path.dirname(file);
        const process = require('process');
        const getSizeOfFile = fs.statSync(file).size;

        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: 'You are not the owner of this bot.', ephemeral: true });
        }
        
        if (!fs.existsSync(file)) {
            return interaction.reply({ content: 'File not found.' });
        }
        if (getPath === ".") {
            const getPath = process.cwd();
            await interaction.reply(
                {
                    content: `Uploading ${basename}`
                }
            );
            return await interaction.editReply(
                {
                    content: `\`\`\`\nName : ${basename}\nDirectory : ${getPath}\nSize : ${getSizeOfFile} bytes\`\`\``,
                    files: [
                        file
                    ]
                }
            );
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
    }
}