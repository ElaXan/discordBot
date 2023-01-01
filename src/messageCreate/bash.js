// Description: This is the bash command, it allows you to run bash commands with the bot
//
// Dependencies:
// - config.json
// - child_process
// - log
//

module.exports = {
    name: 'bash',
    async execute(message) {
        // Get the config
        const { Blocked_Command_Shell, OWNER_ID, Prefix } = require("../../config.json")
        // Check if the message starts with the prefix
        if (!message.content.startsWith(Prefix)) return;
        // Check if the message author is the owner of the bot
        if (message.author.id !== OWNER_ID) return;
        // Check if the message starts with the command name
        if (!message.content.startsWith(`${Prefix}${this.name}`)) return;
        // Check if command contains a blocked command
        if (Blocked_Command_Shell.some(word => message.content.toLowerCase().includes(word))) return message.reply({ content: "You can't use that command!" });
        // Get the log function
        const log = require("../log/log").log
        // Get the child_process
        const { exec } = require('child_process');
        // Run the command
        exec(message.content.slice(this.name.length + 2), (error, stdout, stderr) => {
            // Check if there is an error
            if (error) {
                // Send the error
                message.reply({ content: `\`\`\`bash\nerror:\n${error.message}\`\`\``, ephemeral: true });
                return;
            }
            // Check if there is stderr
            if (stderr) {
                // Send the stderr
                message.reply({ content: `\`\`\`bash\nstderr:\n${stderr}\`\`\``, ephemeral: true });
                return;
            }
            // Check if the output is too long
            if (stdout.length > 500) {
                // Send the output as a file
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
                // Log the command
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
                // Check if the output is empty
                if (stdout === "") {
                    // Send the output as a success message
                    message.reply({ content: "```Success!```", ephemeral: true });
                    // log the command
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
                // Send the output as a message
                message.reply({ content: `\`\`\`${stdout}\`\`\``, ephemeral: true }).catch(console.error);
                // Log the command
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