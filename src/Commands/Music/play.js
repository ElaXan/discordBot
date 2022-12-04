module.exports = {
    data: {
        name: 'play',
        description: 'Play a song',
        options: [
            {
                name: 'name_song',
                description: 'The song you want to play',
                type: 3,
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const { EmbedBuilder } = require('discord.js');
        const { Player, Queue } = require("discord-player");
        colorEmbed = "#FF0000";
        const name_song = interaction.options.getString('name_song');
        // stream with discord-player
        // high quality
        // Using discord.js v14
        // Using discord-player v5
        // setup
        const player = new Player(interaction.client, {
            leaveOnEmpty: false, // This options are optional.
        });
        interaction.client.player = player;
        // Create the player
        // To easily access the player
        if (!interaction.member.voice.channel) return interaction.reply("You need to be in a voice channel to play music.");
        if (!name_song) return interaction.reply("Please give me a song name");
        // Join the voice channel and add the track to the queue
        const queue = await interaction.client.player.createQueue(interaction.member.voice.channel);
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            interaction.client.player.deleteQueue(interaction.guildId);
            return interaction.reply("Could not join your voice channel!");
        }
        await interaction.reply({ content: "Searching...", ephemeral: true });
        // Search for a song
        const track = await interaction.client.player
            .search(name_song, {
                requestedBy: interaction.user,
            })
            .then(x => x.tracks[0]);
        // Add the track to the queue
        queue.addTrack(track);
        // Create a progress bar
        const progressBar = queue.createProgressBar();
        // Create now playing message
        const nowPlaying = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle("Now playing")
            .setDescription(`[${track.title}](${track.url})`)
            .setImage(track.thumbnail);
        // Play the song
        queue.play();
        // Send now playing message
        await interaction.editReply({ embeds: [nowPlaying.build()] });
        // Queue status template
        const queueStatus = queue => new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle("Queue status")
            .setDescription(`**Current track:** [${queue.current.title}](${queue.current.url})\n${progressBar}\n**Next track:** ${queue.tracks[0] ? `[${queue.tracks[0].title}](${queue.tracks[0].url})` : "No more track in queue."}`);
        // Queue status
        await interaction.followUp({ embeds: [queueStatus(queue).build()] });
        // Queue events
        // When a song ends
        queue.on("end", () => {
            interaction.followUp("No more songs in the queue!");
        });
        // When a song is added
        queue.on("trackAdd", (track, message) => {
            interaction.followUp(`Added ${track.title} to the queue!`);
        });
        // When the queue is empty
        queue.on("empty", () => {
            interaction.followUp("No more songs in the queue!");
        });
        // When the bot leaves the voice channel
        queue.on("channelEmpty", () => {
            interaction.followUp("No more member in the voice channel, leaving...");
        });
        // When the queue is destroyed
        queue.on("queueEnd", () => {
            interaction.followUp("No more songs in the queue, destroying the queue...");
        });


    },
}