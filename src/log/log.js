
const { EmbedBuilder } = require("discord.js");
const { WEBHOOK_URL } = require("../../config.json")

module.exports = {
    /**
     * @param {String} interaction - The interaction or message Example: "Info", "Error", "Warn"
     * @param {String} message - The message of the output interaction Example: "This is a message"
     * @param {String} member - The member name who use the command Example: "Z3RO#4032"
     * @param {String} user - The user id who use the command Example: "123456789012345678"
     * @param {String} channel - The channel id where the command is used Example: "123456789012345678"
     * @param {String} guild - The guild id where the command is used Example: "123456789012345678"
     * @param {String} commandType - The command type Example: Slash Command, Message Command
     */
    log: function (interaction, message, member, user, channel, guild) {
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
        }).catch((err) => {
            console.log("Error send log to Webhook!")
            console.error(err);
        });
    }
}