const tmdbApiKey = require('./public/api/apiKeys').tmdbApiKey;
const spotifyApi = require('./public/api/apiKeys').spotifyApi;

const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const port = 3000;


const index = require('./routes/index');
const users = require('./routes/users');

app.use(express.static(__dirname + '/public'));

const songRecommendations = require('./public/javascripts/songRecommendations');
const movieRecommendations = require('./public/javascripts/movieRecommendations');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/', async (req, res) => {
  const text = req.body.text;

  const imdbLinkPattern = /https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
  const imdbIdPattern = /(tt\d+)/i;
  const spotifyLinkPattern = /(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z0-9]+)(?:.*)?/;
  if (spotifyLinkPattern.test(text)) {
    console.log('spotify');

    const trackId = text.match(spotifyLinkPattern)[1];
    const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
      }
    })
    .then(response=>response.json())
    .then(data=>res.send(data));
  }
  if (imdbLinkPattern.test(text) || imdbIdPattern.test(text)) {
    console.log('imdb');
    const match = text.match(imdbLinkPattern);
    const imdbIdValue = match ? match[1] : text;
    const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdbApiKey}&external_source=imdb_id`);
    const data = await response.json();

    if (data.movie_results.length > 0) {
      const movie = data.movie_results[0];

      const tracks = await songRecommendations.recommendSongs(movie);

      res.send(tracks);
    }
  }

});

/*app.post('/', async (req, res) => {
  const trackUrl = req.body.text;
  const regex = /\/track\/(\w+)/;
  const trackId = trackUrl.match(regex)[1];
  const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

  const response = fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${spotifyApi.getAccessToken}`
    }
  });
  const data = await response.json();
  
  res.send(data);
});
*/
app.listen(port, () => {
  console.log('Server started on port ' + port);
});


module.exports = { app };
