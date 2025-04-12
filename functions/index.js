const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.igdbProxy = functions.https.onRequest(async (req, res) => {
  try {
    const accessTokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
      method: "POST"
    });

    const { access_token } = await accessTokenRes.json();

    const query = req.query.search || "";
    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "text/plain"
      },
      body: `search "${query}"; fields name, first_release_date, cover.url, genres.name, involved_companies.company.name, involved_companies.publisher, collection.name; limit 5;`
    });

    const games = await igdbRes.json();

    res.set("Access-Control-Allow-Origin", "*");
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});
