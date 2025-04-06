// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  authDomain: "hubcollections-a001e.firebaseapp.com",
  projectId: "hubcollections-a001e",
  storageBucket: "hubcollections-a001e.appspot.com",
  messagingSenderId: "765474227726",
  appId: "1:765474227726:web:480d8f30ed57cdf77e5e5f",
  measurementId: "G-62C119XRJ9"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Wait for auth state
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("You must be logged in to add a film.");
    window.location.href = "index.html";
    return;
  }

  // Handle form submit
  document.getElementById("film-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const year = parseInt(document.getElementById("year").value);

    if (!title || !genre || !year) {
      document.getElementById("status").textContent = "Please fill in all fields.";
      return;
    }

    try {
      await db.collection("films").add({
        title,
        genre,
        year,
        ownerId: user.uid // 🔑 Add the ownerId here
      });
      document.getElementById("status").textContent = "Film added successfully!";
      document.getElementById("film-form").reset();
    } catch (err) {
      console.error("Error adding film:", err);
      document.getElementById("status").textContent = "Error adding film.";
    }
  });
});
