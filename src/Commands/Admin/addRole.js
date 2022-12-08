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
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);
        member.roles.add(role);
        interaction.reply({ content: `Added role ${role.name} to ${user.tag}`});
        log("AddRole", `Added role ${role.name} to ${user.tag}`, interaction.user.tag, interaction.user.id, interaction.channel.id, interaction.guild.id);
    }
}