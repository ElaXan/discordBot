module.exports = {
    data: {
        name: "removerole",
        description: "Remove a role from a user",
        options: [
            {
                name: "user",
                description: "The user to remove the role from",
                type: 6,
                required: true
            },
            {
                name: "role",
                description: "The role to remove from the user",
                type: 8,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const { OWNER_ID } = require("../../../config.json")
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "This feature still on development", ephemeral: true });
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        const log = require("../../log/log").log
        member.roles.remove(role);
        log("RemoveRole", `Removed role ${role.name} from ${user.tag}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
        return await interaction.reply({ content: `Removed role ${role.name} from ${user.tag}`});
        
    }
}