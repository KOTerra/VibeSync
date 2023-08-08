const tmdbApiKey = require('../api/apiKeys').tmdbApiKey;
const spotifyApi = require('../api/apiKeys').spotifyApi;
const genreApproximationValues = require('./genreApproximationValues');
const vader = require('vader-sentiment');


function recommendMovies(trackFeatures) {
  const genre = getBestGenre(trackFeatures, genreApproximationValues.genres);

  return searchMovies(trackFeatures, genre);

}
function getBestGenre(features, genres) {
  let bestMatch = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const genreName in genres) {
    const genre = genres[genreName];
    const score = (
      Math.abs(genre.acousticness - features.acousticness) +
      Math.abs(genre.danceability - features.danceability) +
      Math.abs(genre.liveness - features.liveness) +
      Math.abs(genre.loudness - features.loudness) +
      Math.abs(genre.tempo - features.tempo) +
      Math.abs(genre.valence - features.valence)
    );

    if (score > bestScore) {
      bestMatch = genre;
      bestScore = score;
    }
  }

  return bestMatch;
}

async function searchMovies(features, genre) {
  let list = [];
  let h = 0;
  for (i = 1; i <= 3; i++) {
    const tmdbSearch = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=vote_count.desc&include_adult=false&page=${i}&with_genres=${genre.id}`;
    const response = await fetch(tmdbSearch);
    const data = await response.json();
    data.results.forEach(movie => {
      const sentiment = new vader.SentimentIntensityAnalyzer.polarity_scores(movie.overview);
      if (sentiment.compound >= features.valence - 0.2 && sentiment.compound <= features.valence + 0.2) {
        list[h++] = movie;
      }
    });

  }
  return list;
}

module.exports = { recommendMovies };