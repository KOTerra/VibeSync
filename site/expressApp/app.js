
const bodyParser = require('body-parser');

const Vader = require('vader-sentiment');
const express = require('express');
const app = express();
const port=3000;


const index=require('./routes/index');
const users=require('./routes/users');

app.use(express.static(__dirname + '/public'));

const songRecommendations=require('./public/javascripts/songRecommendations');

songRecommendations.recommendSongs();

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
  console.log('Server started on port '+port);
});


module.exports = {app};
