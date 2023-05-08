const tmdbApiKey = 'd1daab170c2670052a62b699848bd6ba';

const bodyParser = require('body-parser');

const Vader = require('vader-sentiment');
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

  const imdbIdValue = text;
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdbApiKey}&external_source=imdb_id`);
  const data = await response.json();

  if (data.movie_results.length > 0) {
    const movie = data.movie_results[0]; 

    const tracks = await songRecommendations.recommendSongs(movie);

    res.send(tracks);
  }
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});


module.exports = { app };
