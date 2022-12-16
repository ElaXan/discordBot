
const { EmbedBuilder } = require("discord.js");
const { Timezone } = require("../../config.json")
const { WEBHOOK_URL } = require("../../config.json")

module.exports = {
    time: {
        date3: function() {
            const { db } = require("../../index")
            const dateNow = new Date().toLocaleString("en-US", {timeZone: Timezone}).replace(/\//g, '-').replace(/:/g, '-')
            db.set("date", dateNow).then(() => {
                console.log("Success write date to Mongodb Database!")
            }).catch((err) => {
                console.error(err);
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
        const { db } = require("../../index")
        db.get("date").then((date) => {
            if (interaction) {
                console.log(`${date} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}`);
                console.log("----------------------------------------");
                if (!fs.existsSync("./logs")) {
                    fs.mkdirSync("./logs");
                }
                fs.appendFileSync(String(`./logs/log-${date}.txt`), `\n\n------------------------------------\n${date} \nInteraction: ${interaction} \nMessage: ${message} \nMember: ${member} \nUser: ${user} \nChannel ID: ${channel} \nGuild ID: ${guild}\n------------------------------------`, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }
            const { WebhookClient } = require('discord.js');
            const webhookClient = new WebhookClient({ url: WEBHOOK_URL });
            const embed = new EmbedBuilder()
                .setTitle("Log")
                .setDescription("Someone used a command!")
                .addFields({
                    name: "Interaction",
                    value: interaction,
                    inline: true
                })
                .addFields({
                    name: "Message",
                    value: message, 
                    inline: true
                })
                .addFields({
                    name: "Member",
                    value: member,
                    inline: true
                })
                .addFields({
                    name: "User",
                    value: user,
                    inline: true
                })
                .addFields({
                    name: "Channel ID",
                    value: channel,
                    inline: true
                })
                .addFields({
                    name: "Guild ID",
                    value: guild,
                    inline: true
                })
                .setTimestamp()
                .setColor("Green");
            webhookClient.send({
                username: "Z3RO",
                embeds: [embed]
            });
        }).catch((err) => {
            console.log("Error read date to Mongodb Database!")
            console.error(err);
        });
    }
}