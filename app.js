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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(console.error);
};

logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    userInfo.textContent = `Logged in as ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    loadDVDs(user.uid);
  } else {
    userInfo.textContent = "Not logged in";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});

async function loadDVDs(userId) {
  const snapshot = await db.collection("films")
    .where("ownerId", "==", userId).get();

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
