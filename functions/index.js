const functions = require("firebase-functions");
const fetch = require("node-fetch");

const CLIENT_ID = "tvna954erunoc4fqqfc13tajfshj6h";
const CLIENT_SECRET = "nj1ganxd7wgde7m1e24yaeso5gojwq";

let accessToken = null;
let tokenExpiry = null;

// Get new access token if expired
async function getAccessToken() {
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
    method: "POST",
  });

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1min early
  return accessToken;
}

// Public HTTPS function to search games
exports.searchGame = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const token = await getAccessToken();
    const query = req.body.query || "";

    const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain"
      },
      body: `search "${query}"; fields name, first_release_date, cover.url, genres.name, involved_companies.company.name, involved_companies.publisher, collection.name; limit 5;`
    });

    if (!igdbResponse.ok) {
      console.error("IGDB error:", await igdbResponse.text());
      return res.status(igdbResponse.status).send("IGDB error");
    }

    const games = await igdbResponse.json();
    res.json(games);
  } catch (err) {
    console.error("SearchGame Error:", err);
    res.status(500).send("Server error");
  }
});

