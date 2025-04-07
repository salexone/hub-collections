// === TMDb API Credentials ===
const TMDB_API_KEY = "8e66be4aa9866cb71ea3a2424377ab1c";
const TMDB_READ_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTY2YmU0YWE5ODY2Y2I3MWVhM2EyNDI0Mzc3YWIxYyIsIm5iZiI6MTcyMTU1OTU1My43MTEsInN1YiI6IjY2OWNlYTAxOWUzMzVjODIwNzA5YzA3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dQMQmH0hl5bikBTkByc17Lf0Ur5B2o1z_HtGhgrC5a0";

// === Firebase Setup ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  authDomain: "hubcollections-a001e.firebaseapp.com",
  projectId: "hubcollections-a001e",
  storageBucket: "hubcollections-a001e.appspot.com",
  messagingSenderId: "765474227726",
  appId: "1:765474227726:web:480d8f30ed57cdf77e5e5f",
  measurementId: "G-62C119XRJ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// === DOMContentLoaded to ensure elements are ready ===
window.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("search-result");

  document.getElementById("search-btn").addEventListener("click", async () => {
  const query = document.getElementById("search-query").value.trim();
  const resultContainer = document.getElementById("search-result");
  resultContainer.innerHTML = "";

  if (!query) return;

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`, {
      headers: {
        Authorization: `Bearer ${TMDB_READ_TOKEN}`,
        accept: "application/json"
      }
    });

    const data = await response.json();
    if (data.results.length === 0) {
      resultContainer.textContent = "No results found.";
      return;
    }

    // Show first 6 results
    data.results.slice(0, 6).forEach(film => {
      const posterURL = film.poster_path
        ? `https://image.tmdb.org/t/p/w200${film.poster_path}`
        : "";

      const filmCard = document.createElement("div");
      filmCard.className = "border p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 flex items-center gap-4 mb-2";
      filmCard.innerHTML = `
        ${posterURL ? `<img src="${posterURL}" class="w-16 rounded">` : ""}
        <div>
          <p class="font-medium">${film.title} (${film.release_date?.slice(0, 4) || "N/A"})</p>
          <p class="text-xs text-gray-500">${film.original_title}</p>
        </div>
      `;

      filmCard.addEventListener("click", async () => {
        // Fetch full movie details
        const movieDetailRes = await fetch(`https://api.themoviedb.org/3/movie/${film.id}?language=en-US&append_to_response=credits`, {
          headers: {
            Authorization: `Bearer ${TMDB_READ_TOKEN}`,
            accept: "application/json"
          }
        });
        const movieDetails = await movieDetailRes.json();

        const fullPoster = film.poster_path
          ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
          : "";

        document.getElementById("poster").value = fullPoster;
        document.getElementById("original-title").value = film.original_title;
        document.getElementById("pt-title").value = ""; // Still needs manual input
        document.getElementById("director").value = movieDetails.credits.crew.find(p => p.job === "Director")?.name || "";
        document.getElementById("actors").value = movieDetails.credits.cast.slice(0, 5).map(actor => actor.name).join(", ");
        document.getElementById("genre").value = movieDetails.genres.map(g => g.name).join(", ");
        document.getElementById("duration").value = movieDetails.runtime || "";

        resultContainer.innerHTML = `<p class="text-green-700 font-medium">✅ "${film.title}" selected and form filled!</p>`;
      });

      resultContainer.appendChild(filmCard);
    });

  } catch (err) {
    console.error("TMDb search error:", err);
    resultContainer.textContent = "Error fetching data. Check console.";
  }
});


  // === Firestore Form Submission ===
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      document.getElementById("status").textContent = "Please log in first.";
      return;
    }

    const form = document.getElementById("film-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect all fields
      const filmData = {
        poster: document.getElementById("poster").value.trim(),
        originalTitle: document.getElementById("original-title").value.trim(),
        ptTitle: document.getElementById("pt-title").value.trim(),
        director: document.getElementById("director").value.trim(),
        actors: document.getElementById("actors").value.trim(),
        genre: document.getElementById("genre").value.trim(),
        duration: parseInt(document.getElementById("duration").value),
        format: document.getElementById("format").value.trim(),
        edition: document.getElementById("edition").value.trim(),
        ownerId: user.uid
      };

      // Basic validation
      if (!filmData.originalTitle || !filmData.genre || isNaN(filmData.duration)) {
        document.getElementById("status").textContent = "Please fill in required fields.";
        return;
      }

      try {
        await addDoc(collection(db, "films"), filmData);
        document.getElementById("status").textContent = "✅ Film added!";
        form.reset();
        resultContainer.innerHTML = "";
      } catch (err) {
        console.error("Error adding film:", err);
        document.getElementById("status").textContent = "Error adding film.";
      }
    });
  });
});
