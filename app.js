// API Gateway URL from AWS
const API_URL = "https://hdub22bv8f.execute-api.eu-north-1.amazonaws.com";

async function loadMovies() {
    try {
        const response = await fetch(API_URL);
        const movies = await response.json();

        const movieList = document.getElementById("movie-list");
        movieList.innerHTML = "";

        movies.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = `${movie.title} - ${movie.genre}`;
            movieList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

window.onload = loadMovies;
