
module.exports = {
    now: new Date().toLocaleString().replace(/\//g, '-').replace(/:/g, '-'),
    time: {
        date3: function() {
            const dateNow = new Date().toLocaleString().replace(/\//g, '-').replace(/:/g, '-')
            const fs = require('fs');
            if (!fs.existsSync('./logs')) {
                fs.mkdirSync('./logs');
            }
            fs.writeFile(`./logs/log-main.json`, `{ "date": "${dateNow}" }`, function (err) {
                if (err) throw err;
                console.log('Saved log file name!');
            });
        }
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
        const { date } = require("../../logs/log-main.json")
        if (interaction) {
            console.log(`${this.now} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}`);
            console.log("----------------------------------------");
            fs.appendFileSync(String(`./logs/log-${date}.txt`), `\n\n------------------------------------\n${date} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}\n------------------------------------`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }
}