import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

async function readArtists() {
  const artistList = await fs.readFile("artistData.json");
  return JSON.parse(artistList);
}

app.listen(port, () => {
  console.log(`noget sjovt skete... server kører på http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("vi får respons! 🎉👌");
});

app.get("/artists", async (req, res) => {
  const artists = await readArtists();
  readArtists(artists);
  res.json(artists);
});

app.get("/artists/:id", async (req, res) => {
  const artists = await readArtists();
  console.log(req.params);

  const id = Number(req.params.id);
  const findArtist = artists.find((artist) => artist.id === id);
  res.json(findArtist);
});

app.get("/favoriteArtists", async (req, res) => {
  try {
    // Read the list of favorite artist IDs from favoritArtists.json
    const favArtistList = await fs.readFile("favoritArtists.json");
    const favoriteArtistIds = JSON.parse(favArtistList);

    res.json(favoriteArtistIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch favorite artists" });
  }
});

app.post("/artists", async (req, res) => {
  console.log(req.body);
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  console.log(newArtist);

  const artists = await readArtists();
  artists.push(newArtist);
  const json = JSON.stringify(artists);
  await fs.writeFile("artistData.json", json);
  res.json(artists);
});

app.post("/favoriteArtists", async (req, res) => {
  let id = req.body.id;
  console.log("reg.body.id", id);
  id = id.toString();

  // Read the existing favorite artists list from the file
  const favArtistList = await fs.readFile("favoritArtists.json");
  let artists = JSON.parse(favArtistList);

  // Check if the ID is not already in the list
  if (!artists.includes(id)) {
    artists.push(id); // Add the ID to the list
  }

  // Write the updated list of favorite artists back to the file
  const json = JSON.stringify(artists);
  await fs.writeFile("favoritArtists.json", json);

  res.json(artists);
});

app.put("/artists/:id", async (req, res) => {
  console.log("vi putter");
  const id = req.params.id;
  console.log(id);

  const artists = await readArtists();

  const artistToUpdate = artists.find((artist) => Number(artist.id) === Number(id));
  const body = req.body;
  console.log(body);
  artistToUpdate.name = body.name;
  artistToUpdate.birthdate = body.birthdate;
  artistToUpdate.activeSince = body.activeSince;
  artistToUpdate.genres = body.genres;
  artistToUpdate.labels = body.labels;
  artistToUpdate.website = body.website;
  artistToUpdate.image = body.image;
  artistToUpdate.shortDescription = body.shortDescription;

  fs.writeFile("artistData.json", JSON.stringify(artists));
  res.json(artists);
});

app.delete("/artists/:id", async (req, res) => {
  const id = Number(req.params.id);

  const artists = await readArtists();

  const NewArtistList = artists.filter((artist) => artist.id !== id);
  fs.writeFile("artistData.json", JSON.stringify(NewArtistList));

  res.json(artists);
});

app.delete("/favoriteArtists/:id", async (req, res) => {
  const id = req.params.id;

  // const artists = await getArtists();
  const favArtistList = await fs.readFile("favoritArtists.json");
  let artists = JSON.parse(favArtistList);

  const NewFavArtistList = artists.filter((artistID) => artistID !== id);
  fs.writeFile("favoritArtists.json", JSON.stringify(NewFavArtistList));

  res.json(artists);
});
