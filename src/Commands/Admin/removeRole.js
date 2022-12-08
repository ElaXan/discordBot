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
        const { PermissionsBitField } = require("discord.js")
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        const log = require("../../log/log").log
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "You don't have permission to manage roles", ephemeral: true });
            return log("RemoveRole", `Failed to remove role ${role.name} from ${user.tag} because ${interaction.user.tag} doesn't have permission to manage roles`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            interaction.reply({ content: "I can't remove roles from this user because their highest role is higher than or equal to my highest role" });
            return log("RemoveRole", `Failed to remove role ${role.name} from ${user.tag} because their highest role is higher than or equal to my highest role`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (!member.roles.cache.has(role.id)) {
            interaction.reply({ content: "This user doesn't have this role", ephemeral: true });
            return log("RemoveRole", `Failed to remove role ${role.name} from ${user.tag} because they don't have this role`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "I don't have permission to manage roles", ephemeral: true });
            return log("RemoveRole", `Failed to remove role ${role.name} from ${user.tag} because I don't have permission to manage roles`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        member.roles.remove(role);
        log("RemoveRole", `Removed role ${role.name} from ${user.tag}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
        return await interaction.reply({ content: `Removed role ${role.name} from ${user.tag}`});
        
    }
}