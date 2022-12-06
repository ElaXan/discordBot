// create log after user send command to bot, and log it to file
module.exports = {
    time: {
        date: new Date(),
        date2: new Date().toLocaleDateString().replace(/\//g, '-'),
        date3: new Date().toLocaleString().replace(/\//g, '-').replace(/:/g, '-'),
    },
    /**
     * @param {String} interaction - The interaction or message Example: "Info", "Error", "Warn"
     * @param {String} message - The message of the output interaction Example: "This is a message"
     * @param {String} member - The member name who use the command Example: "Z3RO#4032"
     * @param {String} user - The user id who use the command Example: "123456789012345678"
     * @param {String} channel - The channel id where the command is used Example: "123456789012345678"
     * @param {String} guild - The guild id where the command is used Example: "123456789012345678"
     * @param {String} commandType - The command type Example: Slash Command, Message Command
     */
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