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
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "You don't have permission to manage roles", ephemeral: true });
            return log({
                interaction: "addrole",
                color: "Red",
                description: `Failed to add role ${role.name} to ${user.tag} because ${interaction.user.tag} doesn't have permission to manage roles`,
                fields: [
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
                        inline: true
                    },
                    {
                        name: "Role",
                        value: `${role.name}`,
                        inline: true
                    },
                    {
                        name: "User",
                        value: `${user.tag}`,
                        inline: true
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${interaction.channel.name}`,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value: `${interaction.id}`,
                        inline: true
                    },
                    {
                        name: "Message URL",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                        inline: true
                    },
                ]
            })
        }
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            interaction.reply({ content: "I can't add roles to this user because their highest role is higher than or equal to my highest role" });
            return log({
                interaction: "addrole",
                color: "Red",
                description: `Failed to add role ${role.name} to ${user.tag} because their highest role is higher than or equal to my highest role`,
                fields: [
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
                        inline: true
                    },
                    {
                        name: "Role",
                        value: `${role.name}`,
                        inline: true
                    },
                    {
                        name: "User",
                        value: `${user.tag}`,
                        inline: true
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${interaction.channel.name}`,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value: `${interaction.id}`,
                        inline: true
                    },
                    {
                        name: "Message URL",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                        inline: true
                    },
                ]
            })
        }
        if (member.roles.cache.has(role.id)) {
            interaction.reply({ content: `${user.tag} already has the role ${role.name}`});
            return log({
                interaction: "addrole",
                color: "Red",
                description: `Failed to add role ${role.name} to ${user.tag} because they already have the role`,
                fields: [
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
                        inline: true
                    },
                    {
                        name: "Role",
                        value: `${role.name}`,
                        inline: true
                    },
                    {
                        name: "User",
                        value: `${user.tag}`,
                        inline: true
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${interaction.channel.name}`,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value: `${interaction.id}`,
                        inline: true
                    },
                    {
                        name: "Message URL",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                        inline: true
                    },
                ]
            })
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: "I don't have permission to manage roles" });
            return log({
                interaction: "addrole",
                color: "Red",
                description: `Failed to add role ${role.name} to ${user.tag} because I don't have permission to manage roles`,
                fields: [
                    {
                        name: "User",
                        value: `${interaction.user.tag}`,
                        inline: true
                    },
                    {
                        name: "Role",
                        value: `${role.name}`,
                        inline: true
                    },
                    {
                        name: "User",
                        value: `${user.tag}`,
                        inline: true
                    },
                    {
                        name: "Guild",
                        value: `${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${interaction.channel.name}`,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value: `${interaction.id}`,
                        inline: true
                    },
                    {
                        name: "Message URL",
                        value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                        inline: true
                    },
                ]
            })
        }
        member.roles.add(role);
        await interaction.reply({ content: `Added role ${role.name} to ${user.tag}`});
        log({
            interaction: "addrole",
            color: "Green",
            description: `Added role ${role.name} to ${user.tag}`,
            fields: [
                {
                    name: "User",
                    value: `${interaction.user.tag}`,
                    inline: true
                },
                {
                    name: "Role",
                    value: `${role.name}`,
                    inline: true
                },
                {
                    name: "User",
                    value: `${user.tag}`,
                    inline: true
                },
                {
                    name: "Guild",
                    value: `${interaction.guild.name}`,
                    inline: true
                },
                {
                    name: "Channel",
                    value: `${interaction.channel.name}`,
                    inline: true
                },
                {
                    name: "Message ID",
                    value: `${interaction.id}`,
                    inline: true
                },
                {
                    name: "Message URL",
                    value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`,
                    inline: true
                },
            ]
        })
    }
}