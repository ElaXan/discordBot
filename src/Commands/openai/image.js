const { draw } = require("../../Utils/OpenAI/main")
const { EmbedBuilder } = require("discord.js")
const { OPENAI } = require("../../../config.json")

module.exports = {
    data: {
        name: "image",
        description: "Draw an image with OpenAI",
        options: [
            {
                name: "inspiration",
                description: "The inspiration for the image",
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const prompt = interaction.options.getString("inspiration");
        await interaction.deferReply();
        const results = await draw(prompt);
        const embed = new EmbedBuilder()
            .setTitle(OPENAI.Title.Name)
            .setDescription("Here is the image I drew for you!")
            .setColor(`${OPENAI.Color}`)
            .setTimestamp()
            .setImage(results)
            .setThumbnail("https://openai.com/content/images/2022/05/openai-avatar.png")
            .setFooter({
                text: OPENAI.Footer
            })
            .setURL(OPENAI.Title.URL)
        // edit the message
        await interaction.editReply({
            content: null,
            embeds: [embed]
        })
    }
}