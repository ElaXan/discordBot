
const { EmbedBuilder, WebhookClient } = require("discord.js");
const { WEBHOOK_URL } = require("../../config.json")

module.exports = {
    /**
     * @param {Object} options
     * @param {String} options.interaction
     * @param {String} options.color
     * @param {String} options.description
     * @param {Array} options.fields
     * @param {String} options.fields.name
     * @param {String} options.fields.value
     * @param {Boolean} options.fields.inline
     * @returns {Promise<void>}
     * @example
     * const { log } = require("./log.js")
     * // OR
     * const log = require("./log.js").log
     * // OR
     * const log = require("./log.js")
     * log({
     *      interaction: "ping",
     *      color: "Red",
     *      description: "test",
     *      fields: [
     *          {
     *              name: "test",
     *              value: "test",
     *              inline: true
     *          },
     *          {
     *              name: "test1",
     *              value: "test2",
     *              inline: true
     *          }
     *      ]
     *  })
     */
    log: async function (options) {
        const webhook = new WebhookClient({ url: WEBHOOK_URL });
        if (!options.color) {
            options.color = "Green"
        }
        const embed = new EmbedBuilder()
            .setTitle("Log")
            .setDescription(options.description)
            .setColor(options.color)
            .setTimestamp();
        options.fields.forEach(field => {
            embed.addFields({
                name: field.name,
                value: field.value,
                inline: field.inline
            })
        });
        await webhook.send({
            username: "Z3RO",
            embeds: [embed]
        }).catch(err => {
            console.log("Error while sending log to webhook: " + err)
        })
    }
}