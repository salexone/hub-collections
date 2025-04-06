// add_film.js
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

// Wait for user to be logged in before allowing film to be added
onAuthStateChanged(auth, (user) => {
  if (!user) {
    document.getElementById("status").textContent = "Please log in first.";
    return;
  }

  const form = document.getElementById("film-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const year = parseInt(document.getElementById("year").value);

    if (!title || !genre || !year) {
      document.getElementById("status").textContent = "Please fill in all fields.";
      return;
    }

    try {
      await addDoc(collection(db, "films"), {
        title,
        genre,
        year,
        ownerId: user.uid, // 🔐 saves the film to that user
      });

      document.getElementById("status").textContent = "Film added successfully!";
      form.reset();
    } catch (err) {
      console.error("Error adding film:", err);
      document.getElementById("status").textContent = "Error adding film.";
    }
  });
});
