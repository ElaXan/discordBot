module.exports = {
    name: "forumSolved",
    async execute(message) {
        const { EmbedBuilder } = require("discord.js")
        const { Prefix } = require("../../config.json");
        const { log } = require("../log/log")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content === `${Prefix}${this.name}`) return;
        message.delete();
        const embed = new EmbedBuilder()
            .setTitle("Forum Solved")
            .setDescription("Please close your topic in the forum if you have solved your problem! and add tag [SOLVED] to the topic title")
            .setColor("Green")
            .setTimestamp()
        message.channel.send({ embeds: [embed] });
        log("Forum Solved", "Using problem solved message", message.author.tag, message.author.id, message.channel.id, message.guild.id)
    }
}