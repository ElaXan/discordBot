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
        const { PermissionsBitField } = require("discord.js")
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        const log = require("../../log/log").log;
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
            name: "Target User",
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
            return log({ interaction: "removerole", color: "Red", description: `Failed to remove role ${role.name} from ${user.tag} because ${interaction.user.tag} doesn't have permission to manage roles`, fields: [roleField, targetUserField, userField, guildField, channelField, messageIdField, messageUrlField] })
        }
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            interaction.reply({ content: "I can't remove roles from this user because their highest role is higher than or equal to my highest role" });
            return log({ interaction: "removerole", color: "Red", description: `Failed to remove role ${role.name} from ${user.tag} because their highest role is higher than or equal to my highest role`, fields: [roleField, targetUserField, userField, guildField, channelField, messageIdField, messageUrlField] })
        }
        if (!member.roles.cache.has(role.id)) {
            interaction.reply({ content: "This user doesn't have this role", ephemeral: true });
            return log({ interaction: "removerole", color: "Red", description: `Failed to remove role ${role.name} from ${user.tag} because they don't have this role`, fields: [roleField, targetUserField, userField, guildField, messageIdField, messageUrlField] })
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "I don't have permission to manage roles", ephemeral: true });
            return log({ interaction: "removerole", color: "Red", description: `Failed to remove role ${role.name} from ${user.tag} because I don't have permission to manage roles`, fields: [roleField, targetUserField, userField, guildField, messageIdField, messageUrlField] });
        }
        member.roles.remove(role).then(() => {
            interaction.reply({ content: `Removed role ${role.name} from ${user.tag}` });
            log({ interaction: "removerole", color: "Green", description: `Successfully removed role ${role.name} from ${user.tag}`, fields: [roleField, targetUserField, userField, guildField, channelField, messageIdField, messageUrlField] })
        }).catch(() => {
            interaction.reply({ content: "I don't have permission to remove this role from this user", ephemeral: true });
            log({ interaction: "removerole", color: "Red", description: `Failed to remove role ${role.name} from ${user.tag} because I don't have permission to remove this role from this user`, fields: [roleField, targetUserField, userField, guildField, channelField, messageIdField, messageUrlField] })
        })
    }
}