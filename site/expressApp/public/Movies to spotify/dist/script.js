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
  const spotifyLinkValue = spotifyLink.value;
  const spotifyEmbedCode = `
    <iframe src="${spotifyLinkValue}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
  `;
  spotifyPlayer.innerHTML = spotifyEmbedCode;
});

imdbForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const imdbIdValue = imdbId.value;
  const apiKey = "YOUR_API_KEY";
  const tmdbEndpoint = `https://api.themoviedb.org/3/find/${imdbIdValue}?api_key=${apiKey}&language=en-US&external_source=imdb_id`;
  try {
    const response = await fetch(tmdbEndpoint);
    const data = await response.json();
    const movie = data.movie_results[0];
    const tmdbInfoHTML = `
      <h2>${movie.title}</h2>
      <p>${movie.overview}</p>
      <p>Release Date: ${movie.release_date}</p>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
    `;
    tmdbInfo.innerHTML = tmdbInfoHTML;
  } catch (error) {
    console.error(error);
    tmdbInfo.innerHTML = "Error fetching movie information.";
  }
});

switchButton.addEventListener("click", () => {
  document.body.classList.toggle("switched");
});