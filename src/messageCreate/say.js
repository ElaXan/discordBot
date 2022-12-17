module.exports = {
    name: "say",
    async execute(message) {
        const { Blocked_Command_Say, OWNER_ID, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        const log = require("../log/log").log
        const args = message.content.slice(5);
        if (args.length < 1) return message.reply({ content: "Please provide a message to say.", ephemeral: true });
        message.delete();
        message.channel.send({ content: args });
        log("Say", `Say: ${args}`, message.author.tag, message.author.id, message.channel.id, message.guild.id);
    }
}