module.exports = {
    name: "say",
    async execute(message) {
        const { Prefix } = require("../../config.json")
        const fs = require("fs");
        if (!message.content.startsWith(Prefix)) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        const userId = message.author.id;
        const blockedUserJson = JSON.parse(fs.readFileSync("./src/blockedUser.json", "utf8"));
        const block = blockedUserJson[`<@${userId}>`];
        if (block !== undefined && block.includes(this.name) === true) {
            return message.reply({ content: "You are blocked from using this command" });
        }
        const log = require("../log/log").log;
        const args = message.content.slice(this.name.length + 2);
        if (args.length < 1) {
            return message.reply({ content: "Please provide a message to say.", ephemeral: true });
        }
        message.delete();
        message.channel.send({ content: args });
        log({ color: "Green", interaction: "Say", description: `Command Say was used`, fields: [{ name: "Output", value: `\`\`\`\n${args}\n\`\`\``, }, { name: "Used by", value: `${message.author.tag} (${message.author.id})`, }, { name: "Used in", value: `${message.channel.name} (${message.channel.id})`, }, { name: "Used in guild", value: `${message.guild.name} (${message.guild.id})`, }] })
    }
}