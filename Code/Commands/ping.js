module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction) {
        // TODO: Add with PING and API Latency
        await interaction.reply('Pong!');
    }
};