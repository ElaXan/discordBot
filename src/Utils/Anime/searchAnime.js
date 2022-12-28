const fetch = require("node-fetch")
module.exports = {
    /**
     * @param {String} anime
     * @returns {Promise<Object>}
     * @example
     * const { search } = require("./searchAnime.js")
     * // OR
     * const search = require("./searchAnime.js").search
     * // OR
     * const search = require("./searchAnime.js")
     * search("One Piece").then(result => {
     *      console.log(result)
     * })
     * // OR
     * const search = require("./searchAnime.js")
     * const result = await search("One Piece")
     * console.log(result)
     */
    search: async function (anime) {
        try {
            const result = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}&sfw`);
            const json = await result.json();
            const data = json.data[0];
            if (!data) {
                throw new Error("No data found for the given anime");
            }
            return {
                title: data.title || "No title found",
                images: data.images.jpg ? data.images.jpg.image_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzYI0p-u-KFuLVkgmtWnZqBkfB7K7NU-5vA&usqp=CAU",
                background: data.background || "No background found",
                score: data.score || "No score found",
                genres: data.genres ? data.genres.map(genre => genre.name).join(", ") : "No genres found",
                licensors: data.licensors ? data.licensors.map(licensors => licensors.name).join(", ") : "No licensors found",
                status: data.status || "No status found",
                source: data.source || "No source found",
                episodes: data.episodes || "No episodes found",
                duration: data.duration || "No duration found",
            };
        } catch (error) {
            console.error(error);
        }
    }
}