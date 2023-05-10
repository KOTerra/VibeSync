const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: '9a324ce2de004464916503c99da4c2f2',
    clientSecret: '6855817946bf4204b187537c4c47dd70',
    redirectUri: 'http://localhost:3000/'
});
const tmdbApiKey = 'd1daab170c2670052a62b699848bd6ba';
module.exports={spotifyApi,tmdbApiKey}
