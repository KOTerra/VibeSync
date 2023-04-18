const bodyParser = require('body-parser');

const Vader = require('vader-sentiment');
const express = require('express');
const app = express();
const port=3000;

const index=require('./routes/index');
const users=require('./routes/users');

const songRecommendations=require('./public/javascripts/songRecommendation');


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
  console.log('Server started on port 3000');
});


module.exports = {app};
