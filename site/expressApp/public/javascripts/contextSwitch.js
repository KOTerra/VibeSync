const tmdbApiKey = 'd1daab170c2670052a62b699848bd6ba';


const switchButton = document.querySelector(".switch-button");
const leftContainer = document.querySelector(".left-container");
const rightContainer = document.querySelector(".right-container");
const spotifyForm = document.querySelector("#spotify-form");
const spotifyLink = document.querySelector("#spotify-link");
const spotifyPlayer = document.querySelector("#spotify-player");
const imdbForm = document.querySelector("#imdb-form");
const imdbId = document.querySelector("#imdb-id");
const tmdbInfo = document.querySelector("#tmdb-info");

spotifyForm.style.display = "block";
imdbForm.style.display = "none";
tmdbInfo.innerHTML = null;


spotifyForm.addEventListener("input", (event) => {
  event.preventDefault();
  const embedUrl = spotifyLink.value.replace("open.spotify.com", "embed.spotify.com");
  spotifyPlayer.innerHTML = `
  <iframe src="${embedUrl}" width="400" height="500" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
`;
});
spotifyForm.addEventListener("submit", (event) => {
  event.preventDefault();
});


imdbForm.addEventListener("input", async (event) => {
  event.preventDefault();
  const imdbIdValue = imdbId.value;
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdbApiKey}&external_source=imdb_id`);
  const data = await response.json();
  if (data.movie_results.length > 0) {
    const movie = data.movie_results[0];
    const tmdbInfoHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="400" alt="${movie.title} poster">  
       <h2>${movie.title} (${movie.release_date.substr(0, 4)})</h2>
      <p>${movie.overview}</p>
    `;
    tmdbInfo.innerHTML = tmdbInfoHTML;
  } else {
    tmdbInfo.innerHTML = "<p>No results found.</p>";
  }
});
imdbForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const imdbIdValue = imdbId.value;
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdbApiKey}&external_source=imdb_id`);
  const data = await response.json();

});

switchButton.addEventListener("click", () => {
  document.body.classList.toggle("switched");
  setTimeout(() => {
    if (document.body.classList.contains("switched")) {
      spotifyForm.style.display = "none";
      spotifyForm.reset();
      imdbForm.style.display = "block";
      spotifyPlayer.innerHTML = null;
    } else {
      spotifyForm.style.display = "block";
      imdbForm.style.display = "none";
      imdbForm.reset();
      tmdbInfo.innerHTML = null;
    }
  }, 500);
});
/*
const analyzeButton = document.querySelector('#analyze-button');
const resultDiv = document.querySelector('#result');

analyzeButton.addEventListener('click', () => {
  const text = document.querySelector('#text').value;
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  })
    .then((response) => response.json())
    .then((sentiment) => {
      resultDiv.innerHTML = `
        <p>Positive: ${sentiment.pos.toFixed(2)}</p>
        <p>Neutral: ${sentiment.neu.toFixed(2)}</p>
        <p>Negative: ${sentiment.neg.toFixed(2)}</p>
        <p>Compound: ${sentiment.compound.toFixed(2)}</p>
      `;
    })
    .catch((error) => {
      console.error(error);
      resultDiv.innerHTML = '<p>An error occurred. Please try again later.</p>';
    });
});
*/
