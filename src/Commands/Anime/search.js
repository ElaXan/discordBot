const { EmbedBuilder } = require("discord.js")
const fetch = require('node-fetch');

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
        const anime = interaction.options.getString('search');
        // gunakan API anime untuk mencari anime yang diberikan nama
        fetch(`https://api.jikan.moe/v4/anime?q=${anime.replace(" ", "_")}&sfw`)
            .then(res => res.json())
            .then(json => {
                // jika tidak ada anime yang ditemukan, kirim pesan
                console.log(json.data[0])
                try {
                    const embed = new EmbedBuilder()
                        .setTitle(json.data[0].title)
                        .setURL(json.data[0].url)
                        .setThumbnail(json.data[0].images.jpg.image_url)
                        .setDescription(json.data[0].background)
                        .addFields({
                            name: "Source",
                            value: `${json.data[0].source}`,
                        })
                        .addFields({
                            name: "Scores",
                            value: `${json.data[0].score}`,
                        })
                        .addFields({
                            name: "Episodes",
                            value: `${json.data[0].episodes}`,
                        })
                        .addFields({
                            name: "Duration",
                            value: `${json.data[0].duration}`,
                        })
                        .addFields({
                            name: "Rating",
                            value: `${json.data[0].rating}`,
                        })
                        .addFields({
                            name: "Status",
                            value: `${json.data[0].status}`,
                        })
                        .addFields({
                            name: "Genres",
                            value: `${json.data[0].genres.map(genre => genre.name).join(", ") ? json.data[0].genres.map(genre => genre.name).join(", ") : "No genres found"}`,
                        })
                        .addFields({
                            name: "Studios",
                            value: `${json.data[0].studios.map(studio => studio.name).join(", ") ? json.data[0].studios.map(studio => studio.name).join(", ") : "No studios found"}`,
                        })
                        .addFields({
                            name: "Producers",
                            value: `${json.data[0].producers.map(producer => producer.name).join(", ") ? json.data[0].producers.map(producer => producer.name).join(", ") : "No producers found"}`,
                        })
                        .setColor("Green")
                        .setFooter({
                            text: "Powered by Jikan API",
                            iconURL: "https://jikan.moe/assets/images/logo/jikan.logo.png",
                        })
                    interaction.reply({ embeds: [embed] })
                } catch (error) {
                    console.error(`${error}`)
                    const embed = new EmbedBuilder()
                        .setTitle(anime)
                        .setDescription("Anime not found")
                        .addFields({
                            name: "Reason",
                            value: `${error}`,
                        })
                        .setColor("Red")
                    interaction.reply({ embeds: [embed] })
                }
            }
        )
    }
}