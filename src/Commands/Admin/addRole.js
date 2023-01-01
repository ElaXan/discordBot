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
        const { PermissionsBitField } = require("discord.js");
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        const { log } = require("../../log/log");
        const userField = {
            name: "User",
            value: `${interaction.user.tag}`,
            inline: true
        };
        const roleField = {
            name: "Role",
            value: `${role.name}`,
            inline: true
        };
        const targetUserField = {
            name: "User",
            value: `${user.tag}`,
            inline: true
        };
        const guildField = {
            name: "Guild",
            value: `${interaction.guild.name}`,
            inline: true
        };
        const channelField = {
            name: "Channel",
            value: `${interaction.channel.name}`,
            inline: true
        };
        const messageIdField = {
            name: "Message ID",
            value: `${interaction.id}`,
            inline: true
        };
        const messageUrlField = {
            name: "Message URL",
            value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
            inline: true
        };

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "You don't have permission to manage roles", ephemeral: true });
            return log({ interaction: "addrole", color: "Red", description: `Failed add role ${role.name} to ${user.tag}. Because the user doesn't have permission to manage roles`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        }
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            interaction.reply({ content: "I can't add roles to this user because their highest role is higher than or equal to my highest role" });
            return log({ interaction: "addrole", color: "Red", description: `Failed add role ${role.name} to ${user.tag}. Because the user's highest role is higher than or equal to my highest role`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        }
        if (member.roles.cache.has(role.id)) {
            interaction.reply({ content: `${user.tag} already has the role ${role.name}` });
            return log({ interaction: "addrole", color: "Green", description: `Failed add role ${role.name} to ${user.tag}. Because the user already has the role`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "I don't have permission to manage roles" });
            return log({ interaction: "addrole", color: "Red", description: `Failed add role ${role.name} to ${user.tag}. Because I don't have permission to manage roles`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        }
        member.roles.add(role).then(() => {
            interaction.reply({ content: `Added role ${role.name} to ${user.tag}` });
            log({ interaction: "addrole", color: "Green", description: `Added role ${role.name} to ${user.tag}`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        }).catch(() => {
            interaction.reply({ content: "I don't have permission to add roles to this user" });
            log({ interaction: "addrole", color: "Red", description: `Failed add role ${role.name} to ${user.tag}. Because I don't have permission to add roles to this user`, fields: [userField, roleField, targetUserField, guildField, channelField, messageIdField, messageUrlField] });
        });
    }
}