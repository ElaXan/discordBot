
module.exports = {
    name: 'bash',
    async execute(message) {
        const { Blocked_Command_Shell, OWNER_ID, Prefix } = require("../../config.json")
        if (!message.content.startsWith(Prefix)) return;
        if (message.author.id !== OWNER_ID) return;
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        if (Blocked_Command_Shell.some(word => message.content.toLowerCase().includes(word))) return message.reply({ content: "You can't use that command!", ephemeral: true });
        const log = require("../log/log").log
        const { exec } = require('child_process');
        exec(message.content.slice(7), (error, stdout, stderr) => {
            if (error) {
                message.reply({ content: `\`\`\`bash\nerror:\n${error.message}\`\`\``, ephemeral: true });
                return;
            }
            if (stderr) {
                message.reply({ content: `\`\`\`bash\nstderr:\n${stderr}\`\`\``, ephemeral: true });
                return;
            }
            if (stdout.length > 500) {
                message.channel.send(
                    {
                        content: 'Output too long, sending as file',
                        files: [
                            {
                                attachment: Buffer.from(stdout),
                                name: 'output.txt'
                            }
                        ]
                    }
                );
                log({
                    color: "Green",
                    interaction: "Bash",
                    description: `Command Bash was used`,
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`\n${stdout}\n\`\`\``,
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
            } else {
                if (stdout === "") {
                    message.reply({ content: "```Success!```", ephemeral: true });
                    return log({
                        color: "Green",
                        interaction: "Bash",
                        description: `Command Bash was used`,
                        fields: [
                            {
                                name: "Output",
                                value: `\`\`\`\nSuccess\n\`\`\``,
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
                    });
                }
                message.reply({ content: `\`\`\`${stdout}\`\`\``, ephemeral: true }).catch(console.error);
                log({
                    color: "Green",
                    interaction: "Bash",
                    description: `Command Bash was used`,
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`\n${stdout}\n\`\`\``,
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
        });
    },
};