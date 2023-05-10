const tmdbApiKey = require('../api/apiKeys').tmdbApiKey;

function recommendMovies(track){
  
}

function reccommendMovies() {
  const playlistLinkInput = document.getElementById('spotify-link');
  const movieListElement = document.getElementById('movie-list');
  const recommendMoviesButton = document.getElementById('recommend-movies');

  recommendMoviesButton.addEventListener('click', () => {
    // Get the Spotify access token
    const spotifyAccessToken = 'BQCurXjM3fPmH-bfSd3i0DaKgrBqhJVcXM5JucBJFjLNmIEzLTHAOCtqXYHZTJsxycelLFTNDq2YxOP_cXKU0cGtLWwgqwUpl74WQGLmm2KSTyuFQ0jHQGUNFgOnrPRw3qxDCiylaWGfqxGB8RKFs4z7Pz23TjfP8byV1bGWTPRmhCwyK0hyBq1BJ4BPZNgnSHlRbA260f8cM9I_iu09iSe0rvZI8QW4wjVMsPusPFeqBgR_DZ9-v48N3P3KHxo-vL2rjeBUFyMLw7QefkJf6BxSb8afmKmzWXOP82sBEUdp7One96Q4qcTRj4VD9ZAw4KKxA-FEEsl0OEAwVtUQ7vFbTDhJlajEVS-QTeF6hPDx_QU';

    // Retrieve the playlist ID from the Spotify link
    const playlistLink = playlistLinkInput.value;
    const playlistIdMatch = playlistLink.match(/\/playlist\/(\w+)/);
    const playlistId = playlistIdMatch ? playlistIdMatch[1] : '';

    // Retrieve the track IDs in the playlist
    const tracksApiUrl = `${spotifyApiUrl}playlists/${playlistId}/tracks`;
    fetch(tracksApiUrl, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {

        const trackIds = data.items.map(item => {
          const id = item.track.id;
          console.log(item.track.name);
        });

        // Retrieve the audio features for the tracks in the playlist
        const audioFeaturesApiUrl = `${spotifyApiUrl}audio-features/?ids=${trackIds.join(',')}`;
        fetch(audioFeaturesApiUrl, {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`
          }
        })
          .then(response => response.json())
          .then(data => {

            const audioFeatures = data.audio_features.filter(feature => feature !== null);

            // Calculate the average audio features for the playlist
            const totalAudioFeatures = audioFeatures.reduce((acc, feature) => {

              return {
                valence: acc.valence + feature.valence,
                energy: acc.energy + feature.energy,
                danceability: acc.danceability + feature.danceability,
                tempo: acc.tempo + feature.tempo
              };
            }, { valence: 0, energy: 0, danceability: 0, tempo: 0 });
            const avgAudioFeatures = {
              valence: totalAudioFeatures.valence / audioFeatures.length,
              energy: totalAudioFeatures.energy / audioFeatures.length,
              danceability: totalAudioFeatures.danceability / audioFeatures.length,
              tempo: totalAudioFeatures.tempo / audioFeatures.length
            };

            for (let i = 1; i < 3; i++) {
              // Search for movies with a similar vibe
              const tmdbSearch = `${tmdbApiUrl}discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=vote_count.desc&include_adult=true&page=${i}&with_genres=18,10752`;
              fetch(tmdbSearch)
                .then(response => response.json())
                .then(data => {
                  const movieRecommendations = data.results.filter(movie => {
                    //console.log(movie.title);

                    // Calculate the similarity score between the movie and the Spotify playlist
                    const movieValence = movie.vote_average / 10;
                    const movieEnergy = (movie.popularity - 200) / 600;
                    const movieDanceability = (movie.popularity - 200) / 600;
                    const movieTempo = (120 - Math.abs(120 - movie.vote_count)) / 120;

                    const similarityScore = (
                      Math.abs(avgAudioFeatures.valence - movieValence) +
                      Math.abs(avgAudioFeatures.energy - movieEnergy) +
                      Math.abs(avgAudioFeatures.danceability - movieDanceability) +
                      Math.abs(avgAudioFeatures.tempo - movieTempo)
                    ) / 4;
                    // Return true if the similarity score is below a certain threshold
                    const similarityThreshold = 0.2;
                    // return similarityScore <= similarityThreshold;
                    return true;
                  }).slice(0, 100); // Limit the movie recommendations to 10

                  // Display the movie recommendations on the page
                  movieListElement.innerHTML = '';
                  movieRecommendations.forEach(movie => {
                    const moviePosterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
                    const movieTitle = movie.title;
                    const movieReleaseDate = movie.release_date.slice(0, 4);

                    const movieElement = document.createElement('li');
                    movieElement.innerHTML = `
  <img src="${moviePosterUrl}" alt="${movieTitle} poster">
  <div class="movie-info">
    <h3>${movieTitle} (${movieReleaseDate})</h3>
  </div>
`;
                    movieListElement.appendChild(movieElement);

                  });
                });
            }
          });

      });
  });
}


module.exports = { recommendMovies };