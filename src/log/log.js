// create log after user send command to bot, and log it to file
module.exports = {
    /**
     * @param {String} interaction - The interaction
     * @param {String} message - The message
     * @param {String} member - The member
     * @param {String} user - The user
     * @param {String} channel - The channel
     * @param {String} guild - The guild
     */
    time: {
        date: new Date(),
        date2: new Date().toLocaleDateString().replace(/\//g, '-'),
        date3: new Date().toLocaleString().replace(/\//g, '-').replace(/:/g, '-'),
    },
    log: function (interaction, message, member, user, channel, guild ) {
        const fs = require('fs');
        const time = require("./log")
        if (interaction) {
            console.log(`${this.time.date3} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}`);
            console.log("----------------------------------------");
            fs.appendFileSync(String(`./logs/log-${time.time.date3}.txt`), `\n\n------------------------------------\n${this.time.date3} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}\n------------------------------------`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }
}