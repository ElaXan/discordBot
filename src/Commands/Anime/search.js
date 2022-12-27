const { EmbedBuilder } = require("discord.js")
const fetch = require('node-fetch');
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
        // gunakan API anime untuk mencari anime yang diberikan nama
        fetch(`https://api.jikan.moe/v4/anime?q=${anime.replace(" ", "_")}&sfw`)
            .then(res => res.json())
            .then(json => {
                try {
                    // buat embed baru
                    const embed = new EmbedBuilder()
                        // set judul embed
                        .setTitle(json.data[0].title)
                        // set url embed
                        .setURL(json.data[0].url)
                        // set thumbnail embed
                        .setThumbnail(json.data[0].images.jpg.image_url)
                        // set deskripsi embed
                        .setDescription(json.data[0].background)
                        // tambahkan field
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
                        // set warna embed ke hijau
                        .setColor("Green")
                        // tambahkan footer
                        .setFooter({
                            text: "Powered by Jikan API",
                            iconURL: "https://jikan.moe/assets/images/logo/jikan.logo.png",
                        })
                    // kirim embed
                    interaction.reply({ embeds: [embed] })
                    // log
                    log({
                        color: "Green",
                        interaction: "Anime",
                        description: `Command Anime was used`,
                        fields: [
                            {
                                name: "Anime",
                                value: anime
                            },
                            {
                                name: "Used by",
                                value: `${interaction.user.tag} (${interaction.user.id})`,
                            },
                            {
                                name: "Channel",
                                value: `${interaction.channel.name} (${interaction.channel.id})`,
                            },
                            {
                                name: "Guild",
                                value: `${interaction.guild.name} (${interaction.guild.id})`,
                            }
                        ]
                    })
                } catch (error) {
                    // jika ada error, kirim embed yang berisi error
                    console.error(`${error}`)
                    const embed = new EmbedBuilder()
                        .setTitle(anime)
                        .setDescription("Anime not found")
                        .addFields({
                            name: "Reason",
                            value: `${error}`,
                        })
                        .setColor("Red")
                    // kirim embed
                    interaction.reply({ embeds: [embed] })
                    // log
                    log({
                        color: "Red",
                        interaction: "Anime",
                        description: `Command Anime was used and results not found`,
                        fields: [
                            {
                                name: "Anime",
                                value: anime
                            },
                            {
                                name: "Output Error",
                                value: `${error}`,
                            },
                            {
                                name: "Used by",
                                value: `${interaction.user.tag} (${interaction.user.id})`,
                            },
                            {
                                name: "Channel",
                                value: `${interaction.channel.name} (${interaction.channel.id})`,
                            },
                            {
                                name: "Guild",
                                value: `${interaction.guild.name} (${interaction.guild.id})`,
                            }
                        ]
                    })
                }
            }
        )
    }
}