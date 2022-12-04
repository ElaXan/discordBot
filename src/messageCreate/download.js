module.exports = {
    name: 'download',
    async execute(message) {
        // download file from link discord message
        const { Blocked_Command_Download, OWNER_ID, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (message.author.id !== OWNER_ID) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        // get link from message
        const link = message.content.slice(10);
        const fs = require('fs');
        // download to local directory
        const download = require('download');
        download(link).then(data => {
            fs.writeFileSync('downloaded-file', data);
        });
        // send message to user if download is success
        message.reply({ content: "Downloaded!", ephemeral: true });
    },

}