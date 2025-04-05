// 🔥 Replace this config with YOUR Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  authDomain: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  projectId: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  storageBucket: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  messagingSenderId: "AIzaSyCUpzUXiwihGhBzGfGcEzcm1-Zf5gAyj5A",
  appId: "G-62C119XRJ9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore
const db = firebase.firestore();

// Load and display DVDs
async function loadDVDs() {
  const snapshot = await db.collection("dvds").get();
  const list = document.getElementById("movie-list");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.title} (${data.year}) - ${data.genre}`;
    list.appendChild(li);
  });
}

window.onload = loadDVDs;
