const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: '9a324ce2de004464916503c99da4c2f2',
    clientSecret: '6855817946bf4204b187537c4c47dd70',
    redirectUri: 'http://localhost:3000/'
});

const genreApproximationValues = require('./genreApproximationValues');


async function recommendSongs(movie) {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);

        const genreAverages = calculateGenreAverages(movie, genreApproximationValues.genres);

        const searchOptions = {
            limit: 10,
            market: 'US',
            seed_genres: 'rock, r-n-b, pop, electronic, blues',
            target_acousticness: genreAverages.acousticness,
            target_danceability: genreAverages.danceability,
            target_key: 2,
            target_liveness: genreAverages.liveness,
            target_loudness: genreAverages.loudness,
            target_mode: 1,
            target_popularity: 50,
            target_tempo: genreAverages.tempo,
            target_valence: genreAverages.valence,
        };

        const tracks = (await spotifyApi.getRecommendations(searchOptions)).body;
        //console.log(tracks);
        //const tracks = data2.body.tracks;

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


module.exports = { recommendSongs };