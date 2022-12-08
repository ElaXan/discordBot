module.exports = {
    data: {
        name: "addrole",
        description: "Add a role to a user",
        options: [
            {
                name: "user",
                description: "The user to add the role to",
                type: 6,
                required: true
            },
            {
                name: "role",
                description: "The role to add to the user",
                type: 8,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const { OWNER_ID } = require("../../../config.json")
        if (interaction.user.id !== OWNER_ID) return interaction.reply({ content: "This feature still on development", ephemeral: true });
        const { PermissionsBitField } = require("discord.js");
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        const { log } = require("../../log/log");
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "You don't have permission to manage roles", ephemeral: true });
            return log("AddRole", `Failed to add role ${role.name} to ${user.tag} because ${interaction.user.tag} doesn't have permission to manage roles`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            interaction.reply({ content: "I can't add roles to this user because their highest role is higher than or equal to my highest role" });
            return log("AddRole", `Failed to add role ${role.name} to ${user.tag} because their highest role is higher than or equal to my highest role`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (member.roles.cache.has(role.id)) {
            interaction.reply({ content: `${user.tag} already has the role ${role.name}`});
            return log("AddRole", `Failed to add role ${role.name} to ${user.tag} because ${user.tag} already has the role`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "I don't have permission to manage roles" });
            return log("AddRole", `Failed to add role ${role.name} to ${user.tag} because I don't have permission to manage roles`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id)
        }
        member.roles.add(role);
        await interaction.reply({ content: `Added role ${role.name} to ${user.tag}`});
        log("AddRole", `Added role ${role.name} to ${user.tag}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
    }
}