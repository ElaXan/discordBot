const { OWNER_ID } = require("../../../config.json")
const { getBlockedUsersJson } = require("../../Utils/block")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: {
        name: "blockuser",
        description: "Block a user from using the bot with specific commands",
        options: [
            {
                name: "user",
                description: "The user to block",
                type: 6,
                required: true
            },
            {
                name: "commands",
                description: "The commands to block",
                type: 3,
                required: true
            },
            {
                name: "reason",
                description: "The reason for blocking the user",
                type: 3,
                required: false
            }
        ]
    },
    /**
     * @param {import("discord.js").Collection<String, import("discord.js").CommandInteractionOption>} user
     * @param {import("discord.js").Collection<String, import("discord.js").CommandInteractionOption>} commands
     * @param {import("discord.js").Collection<String, import("discord.js").CommandInteractionOption>} reason
     */
    async execute(interaction) {
        const user = interaction.options.getUser("user")
        const commands = interaction.options.getString("commands")
        const embed = new EmbedBuilder();
        embed.setTitle("Block User")
        embed.setTimestamp()
        // Check if the user is the owner
        if (interaction.user.id !== OWNER_ID) {
            // Send a message
            embed.setDescription("You are not the owner of this Bot!")
            embed.setColor("Red")
            return interaction.reply({ embeds: [embed] })
        }
        // get result from the function
        const blocked = await getBlockedUsersJson(user, commands)
        // Check if the user is already blocked
        if (blocked === null) {
            // Send a message
            embed.setDescription(`${user} already blocked from command ${commands}`)
            embed.setColor("Yellow")
            return interaction.reply({ embeds: [embed] })
        }
        // Check if the user is successfully blocked
        if (blocked === true) {
            // Send a message
            embed.setDescription(`Success block ${user} to use command ${commands}`)
            embed.setColor("Green")
            return interaction.reply({ embeds: [embed] })
        } else {
            // Send a message
            embed.setDescription(`Failed block ${user} to use command ${commands}`)
            embed.setColor("Red")
            return interaction.reply({ embeds: [embed] })
        }
    }
}