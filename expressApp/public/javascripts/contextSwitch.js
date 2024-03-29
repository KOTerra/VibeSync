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
const tmdbResult = document.querySelector("#tmdb-result");
const spotifyResult = document.querySelector("#spotify-result");


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
  const text = spotifyLink.value;
  tmdbResult.innerHTML = null;
  const resultDiv = tmdbResult;
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })

  })
    .then((response) => {
      console.log(response.body);
      return response.json();
    })
    .then((data) => {
      data.forEach(movie => {
        resultDiv.insertAdjacentHTML('beforeend', ` <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="100" alt="${movie.title} poster">  
        <h2>${movie.title} (${movie.release_date.substr(0, 4)})</h2>`);
      });
    })
    .catch(error => {
      console.error(error);
    });
});


imdbForm.addEventListener("input", async (event) => {
  event.preventDefault();
  const text = imdbId.value;

  const pattern = /https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
  const match = text.match(pattern);
  const imdbIdValue = match ? match[1] : text;
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdbApiKey}&external_source=imdb_id`);
  const data = await response.json();

  if (data.movie_results.length > 0) {
    const movie = data.movie_results[0];
    const tmdbInfoHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="300" alt="${movie.title} poster">  
       <h2>${movie.title} (${movie.release_date.substr(0, 4)})</h2>
      <p>${movie.overview}</p>
    `;
    tmdbInfo.innerHTML = tmdbInfoHTML;
  } else {
    tmdbInfo.innerHTML = "<p>No results found.</p>";
  }
});

imdbForm.addEventListener("submit", (event) => {
  event.preventDefault();
  spotifyResult.innerHTML = null;

  const imdbIdValue = imdbId.value;
  const text = imdbIdValue;
  const resultDiv = spotifyResult;
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })

  })
    .then((response) => response.json())
    .then((data) => {
      let tracks = data.tracks;
      shuffle(tracks);
      for (i = 0; i < 6; i++) {
        let track = tracks[i];
        const embedUrl = `${track.external_urls.spotify}`.replace("open.spotify.com", "embed.spotify.com");
        resultDiv.insertAdjacentHTML('beforeend', `<iframe src="${embedUrl}" width="400" height="150" frameborder="0" allowtransparency="true" frameborder="0" allow="encrypted-media"></iframe>`);
      }
    })
    .catch((error) => {
      console.error(error);
      resultDiv.insertAdjacentHTML('beforeend', `<p>An error occurred. Please try again. ${error}</p>`);
    });


});

switchButton.addEventListener("click", () => {
  document.body.classList.toggle("switched");
  setTimeout(() => {
    if (document.body.classList.contains("switched")) {
      spotifyForm.style.display = "none";
      spotifyForm.reset();
      tmdbResult.innerHTML = null;
      imdbForm.style.display = "block";
      spotifyPlayer.innerHTML = null;
    } else {
      spotifyForm.style.display = "block";
      imdbForm.style.display = "none";
      imdbForm.reset();
      spotifyResult.innerHTML = null;
      tmdbInfo.innerHTML = null;
    }
  }, 500);
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}