const spotifyApi = require('../api/apiKeys').spotifyApi;
const genreApproximationValues = require('./genreApproximationValues');
const vader = require('vader-sentiment');


async function recommendSongs(movie) {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);

        const genreAverages = calculateGenreAverages(movie, genreApproximationValues.genres);
        const sentimentValues=performSentimentAnalysis(movie);

        const searchOptions = generateSearchOptions(genreAverages,sentimentValues);

        const tracks = (await spotifyApi.getRecommendations(searchOptions)).body;


        return tracks;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function calculateGenreAverages(movie, genres) {
    const matchingGenres = movie.genre_ids.map(id => Object.keys(genres).find(key => genres[key].id === id));
    const genreValues = {};

    matchingGenres.forEach(genre => {
        if (genres[genre]) {
            genreValues.acousticness = (genreValues.acousticness || 0) + genres[genre].acousticness;
            genreValues.danceability = (genreValues.danceability || 0) + genres[genre].danceability;
            genreValues.liveness = (genreValues.liveness || 0) + genres[genre].liveness;
            genreValues.loudness = (genreValues.loudness || 0) + genres[genre].loudness;
            genreValues.tempo = (genreValues.tempo || 0) + genres[genre].tempo;
            genreValues.valence = (genreValues.valence || 0) + genres[genre].valence;
        }
    });

    const numMatchingGenres = matchingGenres.filter(genre => genres[genre]).length;

    genreValues.acousticness /= numMatchingGenres;
    genreValues.danceability /= numMatchingGenres;
    genreValues.liveness /= numMatchingGenres;
    genreValues.loudness /= numMatchingGenres;
    genreValues.tempo /= numMatchingGenres;
    genreValues.valence /= numMatchingGenres;

    return genreValues;
}
function performSentimentAnalysis(movie) {
    const sentiment = new vader.SentimentIntensityAnalyzer.polarity_scores(movie.overview);
    const sentimentValues = {};
    sentimentValues.positive = sentiment.pos;
    sentimentValues.neutral = sentiment.neu;
    sentimentValues.negative = sentiment.neg;
    sentimentValues.valence = sentiment.compound;
    console.log(sentimentValues);
    return sentimentValues;
}

function generateSearchOptions(genreAverages, sentimentValues) {
    const searchOptions = {
        limit: 10,
        market: 'US',
        seed_genres: 'rock, r-n-b, pop, electronic, blues',
        target_acousticness: genreAverages.acousticness,
        target_danceability: genreAverages.danceability,
        target_key: 0,
        target_liveness: genreAverages.liveness,
        target_loudness: genreAverages.loudness,
        target_mode: 6,
        target_popularity: 200,
        target_tempo: genreAverages.tempo,
        target_valence: genreAverages.valence,
    };
    searchOptions.target_valence += sentimentValues;
    searchOptions.target_valence /= 2;
    return searchOptions;
}

module.exports = { recommendSongs };