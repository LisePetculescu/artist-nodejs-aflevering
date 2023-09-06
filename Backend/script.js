import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

async function getArtists() {
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
  const artists = await getArtists();
  getArtists(artists);
  res.json(artists);
});

app.get("/artists/:id", async (req, res) => {
  const artists = await getArtists();
  console.log(req.params);

  const id = Number(req.params.id);
  const findArtist = artists.find((artist) => artist.id === id);
  res.json(findArtist);
});

app.post("/artists", async (req, res) => {
  console.log(req.body);
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  console.log(newArtist);

  const artists = await getArtists();
  artists.push(newArtist);
  const json = JSON.stringify(artists);
  await fs.writeFile("artistData.json", json);
  res.json(artists);
});

app.put("/artists/:id", async (req, res) => {
  console.log("vi putter");
  const id = req.params.id;
  console.log(id);

  const artists = await getArtists();

  const artistToUpdate = artists.find(
    (artist) => Number(artist.id) === Number(id)
  );
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

  const artists = await getArtists();

  const NewArtistList = artists.filter((artist) => artist.id !== id);
  fs.writeFile("artistData.json", JSON.stringify(NewArtistList));

  res.json(artists);
});
