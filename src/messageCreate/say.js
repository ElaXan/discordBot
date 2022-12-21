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
        log({
            color: "Green",
            interaction: "Say",
            description: `Command Say was used`,
            fields: [
                {
                    name: "Output",
                    value: `\`\`\`\n${args}\n\`\`\``,
                },
                {
                    name: "Used by",
                    value: `${message.author.tag} (${message.author.id})`,
                },
                {
                    name: "Used in",
                    value: `${message.channel.name} (${message.channel.id})`,
                },
                {
                    name: "Used in guild",
                    value: `${message.guild.name} (${message.guild.id})`,
                }
            ]
        })
    }
}