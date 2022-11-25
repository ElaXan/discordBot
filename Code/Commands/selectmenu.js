const { ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js")
module.exports = {
    data: {
        name: 'select',
        description: 'Select a menu',
    },
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            );
        await interaction.reply({ content: 'Pong!', components: [row] });

        const filter = i => i.customId === 'select' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
            max: 1,
        });
        collector.on('collect', (i) => {
            if (i.values[0] === 'first_option') {
                i.reply({ content: 'You selected first option!', ephemeral: true });
            } else if (i.values[0] === 'second_option') {
                i.reply({ content: 'You selected second option!', ephemeral: true });
            }
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        })
    }
}