const tmdb_api_key = "d1daab170c2670052a62b699848bd6ba";
const openai_api_key = "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";

const switchButton = document.querySelector(".switch-button");
const leftContainer = document.querySelector(".left-container");
const rightContainer = document.querySelector(".right-container");
const spotifyForm = document.querySelector("#spotify-form");
const spotifyLink = document.querySelector("#spotify-link");
const spotifyPlayer = document.querySelector("#spotify-player");
const imdbForm = document.querySelector("#imdb-form");
const imdbId = document.querySelector("#imdb-id");
const tmdbInfo = document.querySelector("#tmdb-info");

spotifyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const embedUrl = spotifyLink.value.replace("open.spotify.com", "embed.spotify.com");
  spotifyPlayer.innerHTML = `
  <iframe src="${embedUrl}" width="400" height="500" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
`;
});


imdbForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const imdbIdValue = imdbId.value;
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${tmdb_api_key}&external_source=imdb_id`);
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

switchButton.addEventListener("click", () => {
  document.body.classList.toggle("switched");
  if (document.body.classList.contains("switched")) {
    spotifyForm.style.display = "none";
    imdbForm.style.display = "block";
    spotifyPlayer.innerHTML=null;
  } else {
    spotifyForm.style.display = "block";
    imdbForm.style.display = "none";
    tmdbInfo.innerHTML=null;
  }
});