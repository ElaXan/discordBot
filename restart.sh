# restart bot

#!/bin/bash
killall -9 node
cd /home/ElaXan/Documents/Coding/discordBot
node .

const text = interaction.options.getString('text');
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'gm.txt');
        const data = fs.readFileSync (filePath, 'utf8');
        const lines = data.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(text)) {
                interaction.reply(line.split(':')[0]);
                logSend(line.split(':')[0], interaction.member.user.tag, interaction.commandName);
            }
        }