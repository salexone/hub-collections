// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  authDomain: "hubcollections-a001e.firebaseapp.com",
  projectId: "hubcollections-a001e",
  storageBucket: "hubcollections-a001e.appspot.com",
  messagingSenderId: "765474227726",
  appId: "1:765474227726:web:480d8f30ed57cdf77e5e5f",
  measurementId: "G-62C119XRJ9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load DVDs from Firestore
async function loadDVDs() {
  try {
    const snapshot = await db.collection("dvds").get();
    const list = document.getElementById("movie-list");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = `${data.title} (${data.year}) - ${data.genre}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading DVDs:", error);
  }
}

window.onload = loadDVDs;
