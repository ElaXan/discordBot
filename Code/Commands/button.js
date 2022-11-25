const { ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'button',
        description: 'Button Test',
    },
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle(ButtonStyle.Primary)
            )

        const embed = new EmbedBuilder()
            .setTitle('Button Test')
            .setDescription('This is a test of buttons')
            .setColor('Green')
            .setTimestamp(new Date())
        await interaction.reply({ embeds: [embed], components: [row] });
        const filter = i => i.customId === 'primary' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
            if (i.customId === 'primary') {
                await i.update({ content: "You Click The Button!", embeds: [], components: [] });
            }
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
}