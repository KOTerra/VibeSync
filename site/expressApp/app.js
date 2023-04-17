const bodyParser = require('body-parser');
const tmdbApiKey = 'd1daab170c2670052a62b699848bd6ba';
const SpotifyWebApi =require('spotify-web-api-node');
const spotifyApi =new SpotifyWebApi({
  clientId: '9a324ce2de004464916503c99da4c2f2',
  clientSecret: '6855817946bf4204b187537c4c47dd70',
  redirectUri: 'http://localhost:3000/'
});


spotifyApi.clientCredentialsGrant().then((data) => {
  spotifyApi.setAccessToken(data.body.access_token);

  // search for tracks with specific audio features
  const searchOptions = {
    limit: 1,
    market: 'US',
    seed_genres: 'metal, pop, rock',
    target_acousticness: 0.8,
    target_danceability: 0.5,
    target_energy: 0.7,
    target_instrumentalness: 0.9,
    target_key: 2,
    target_liveness: 0.3,
    target_loudness: 30,
    target_mode: 1,
    target_popularity: 50,
    target_speechiness: 0.4,
    target_tempo: 100,
    target_valence: -0.6,
  };

  spotifyApi.getRecommendations(searchOptions).then(
    function (data) {
      // handle successful response
      const tracks = data.body.tracks;
      console.log(`Found ${tracks.length} tracks:`);
      tracks.forEach((track) => {
        console.log(`${track.name} by ${track.artists[0].name}`);
        console.log(`${track.external_urls.spotify}`);
      });
    },
    function (err) {
      // handle error
      console.error(err);
    }
  );
});

const Vader = require('vader-sentiment');
const express = require('express');
const app = express();
const port=3000;

const index=require('./routes/index');
const users=require('./routes/users');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const text=req.body.text;
  const sentiment = new Vader.SentimentIntensityAnalyzer.polarity_scores(text);
  //sentiment.
  console.log(text);
  res.send(sentiment);
});

app.listen(port, () => {
  console.log('Server started on port 3000');
});


module.exports = app;