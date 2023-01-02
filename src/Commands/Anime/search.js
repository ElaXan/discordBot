const { EmbedBuilder } = require("discord.js")
const { search } = require("../../Utils/searchAnime")
const { log } = require("../../log/log")

module.exports = {
    data: {
        name: 'anime',
        description: 'Search for an anime',
        options: [
            {
                name: 'search',
                description: 'Search for an anime',
                type: 3,
                required: true,
            },
        ]
    },
    async execute(interaction) {
        // ambil nama anime dari opsi
        const anime = interaction.options.getString('search');
        // kirim balasan sebelum mencari anime "(nama bot) is thinking..."
        await interaction.deferReply()
        // cari anime
        const result = await search(anime);
        // jika tidak ada anime yang ditemukan, kirim balasan "No anime found"
        if (result === "" || result === null || result === undefined) {
            // bikin embed
            const embed = new EmbedBuilder()
                // set judul embed
                .setTitle(anime)
                // set deskripsi embed
                .setDescription("No anime found")
                // set warna embed ke merah
                .setColor("Red")
                // set footer embed dengan API yang digunakan
                .setAuthor({ name: "Powered by Jikan API", iconURL: "https://jikan.moe/assets/images/logo/jikan.logo.png" })
            return interaction.editReply({ embeds: [embed] })
        }
        const embed = new EmbedBuilder()
            // set judul embed
            .setTitle(result.title)
            // set deskripsi embed (background)
            .setDescription(result.background)
            // set warna embed ke hijau
            .setColor("Green")
            // tambahkan field
            .addFields(
                {
                    name: "Genres",
                    value: `${result.genres || "No genres found"}`,
                },
                {
                    name: "Source",
                    value: `${result.source || "No source found"}`,
                },
                {
                    name: "Status",
                    value: `${result.status || "No status found"}`,
                },
                {
                    name: "Episodes",
                    value: `${result.episodes || "No episodes found"}`,
                },
                {
                    name: "Duration",
                    value: `${result.duration || "No duration found"}`,
                },
                {
                    name: "Score",
                    value: `${result.score || "No score found"}`,
                },
                {
                    name: "Licensors",
                    value: `${result.licensors || "No licensors found"}`,
                }
            )
            // set gambar thumbnail sebagai gambar anime
            .setThumbnail(result.images)
            .setTimestamp()
            // set footer embed dengan API yang digunakan
            .setAuthor({ name: "Powered by Jikan API", iconURL: "https://jikan.moe/assets/images/logo/jikan.logo.png" })
        // kirim balasan dengan embed
        interaction.editReply({ embeds: [embed] })
        // log ke webhook
        log({ color: "Green", interaction: "/anime", description: `Searched for ${anime}`, fields: [{ name: "Anime", value: anime }, { name: "User", value: interaction.user.tag + " (" + interaction.user.id + ")" }, { name: "Channel", value: interaction.channel.name + " (" + interaction.channel.id + ")" }, { name: "Guild", value: interaction.guild.name + " (" + interaction.guild.id + ")" },] })
    }
}