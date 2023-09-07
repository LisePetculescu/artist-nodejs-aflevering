// "use strict";

import { getArtists, createArtist, putUpdatedArtist, deleteArtist, getFavoriteArtists } from "./dataFetch.js";

window.addEventListener("load", start);
const endpoint = "http://localhost:3000";
let selectedArtist;
let artists;

function start() {
  console.log("we have connection to js 👌🙌");

  document.querySelector("#close-create").addEventListener("click", () => document.querySelector("#dialog-create-artist").close());
  document.querySelector("#close-update").addEventListener("click", () => document.querySelector("#dialog-update-artist").close());

  document.querySelector("#btn-create-artist").addEventListener("click", () => document.querySelector("#dialog-create-artist").showModal());

  document.querySelector("#form-create").addEventListener("submit", createArtistForm);
  document.querySelector("#form-update").addEventListener("submit", submitUpdatedArtist);

  document.querySelector("#genreFilter").addEventListener("change", updateArtistpage);

  updateArtistpage();
  console.log("START FUNC");

  document.querySelector("#sortAll").addEventListener("change", (event) => sortAndFilterArtists(event));

  showFavoriteArtists();
}

async function updateArtistpage(artists) {
  artists = await getArtists();
  const genreFilter = document.getElementById("genreFilter");
  const selectedGenre = genreFilter.value;
  const filteredArtists = filterArtistsByGenre(artists, selectedGenre);
  showArtistsAll(filteredArtists);
}

function showArtistsAll(array) {
  document.querySelector(".grid-container").innerHTML = "";

  for (const artist of array) {
    showArtist(artist);
  }
}

function showArtist(artist) {
  const html = /* html */ `
    <article class="grid-item">
    <div class="btns">
        <button class="btnShowArtistModal">Show more info</button>
        
      </div>
    </br>
    <img src="${artist.image}" />
      <h3>${artist.name}</h3>
      <p>Genre: ${artist.genres}</p>
    </article>
  `;
  document.querySelector(".grid-container").insertAdjacentHTML("beforeend", html);

  document.querySelector(".grid-container article:last-child").addEventListener("click", (event) => showArtistModal(event, artist));
}

async function showArtistModal(event, artist) {
  console.log(artist);
  console.log(event);

  const isFav = await isFavorite(artist.id);
  console.log(isFav);

  const html = /* html */ `
  <button id="close-show-more-artist">Close</button>
    <article class="grid-item">
    <button class="btn-update-artist">Update</button>
    <button class="btn-delete-artist">Delete</button>
    <input
          type="checkbox"
          id="favoriteArtist"
          name="favoriteArtist"
          ${isFav ? "checked" : ""}
        />
        <label for="favoriteArtist">Favorite</label><br />
    </br>
    <h3>${artist.name}</h3>
    <img src="${artist.image}" />
      <p>Birthdate: ${artist.birthdate}</p>
      <p>Active Since: ${artist.activeSince}</p>
      <p>Genres: ${artist.genres}</p>
      <p>Labels: ${artist.labels}</p>
      <p>Website: ${artist.website}</p>
      <p>Short Description: ${artist.shortDescription}</p>
    </article>
    `;
  document.querySelector("#show-artist-modal").innerHTML = html;

  document.querySelector("#show-artist-modal").showModal();

  document.querySelector(".btn-update-artist").addEventListener("click", () => selectedToUpdate(artist));
  document.querySelector(".btn-delete-artist").addEventListener("click", () => deleteArtist(artist.id));
  document.querySelector("#favoriteArtist").addEventListener("change", (event) => favoritArtistChecked(event, artist));

  document.querySelector("#close-show-more-artist").addEventListener("click", () => document.querySelector("#show-artist-modal").close());
}

async function isFavorite(id) {
  const favArtistIds = await getFavoriteArtists();

  if (favArtistIds.includes(String(id))) {
    return true;
  } else {
    return false;
  }
}

async function createArtistForm(event) {
  event.preventDefault();
  console.log(event);

  const form = event.target;
  const newArtist = {
    name: form.name.value,
    birthdate: form.birthdate.value,
    activeSince: form.activeSince.value,
    genres: form.genres.value,
    labels: form.labels.value,
    website: form.website.value,
    image: form.image.value,
    shortDescription: form.shortDescription.value
  };

  createArtist(newArtist);

  const success = await createArtist(newArtist);

  if (success) {
    // updateUIOnCreate(newArtist);
    document.querySelector("#dialog-create-artist").close();
    updateArtistpage(newArtist);
    // Optionally, reset the form or close a modal here
    form.reset();
  } else {
    console.error("couldn't create a new artist :(");
  }
}

function selectedToUpdate(artist) {
  selectedArtist = artist;
  console.log("my selected artist  ", selectedArtist);
  console.log(artist.id);

  const form = document.querySelector("#form-update");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.shortDescription.value = artist.shortDescription;

  document.querySelector("#dialog-update-artist").showModal();
}

async function submitUpdatedArtist(event) {
  event.preventDefault();
  console.log("my updated artist  ", selectedArtist.id);

  const form = event.target;
  const updatedArtist = {
    name: form.name.value,
    birthdate: form.birthdate.value,
    activeSince: form.activeSince.value,
    genres: form.genres.value,
    labels: form.labels.value,
    website: form.website.value,
    image: form.image.value,
    shortDescription: form.shortDescription.value
  };

  putUpdatedArtist(updatedArtist, selectedArtist.id);

  const success = await putUpdatedArtist(updatedArtist, selectedArtist.id);

  if (success) {
    document.querySelector("#dialog-update-artist").close();
    document.querySelector("#show-artist-modal").close();
    updateArtistpage(updatedArtist);
  } else {
    console.error("couldn't update artist :'(");
  }
}

// async function checkDeleteArtist(artist) {
//   const success = await deleteArtist(artist);

//   if (success) {
//     updateArtistpage(artist);
//   } else {
//     console.error("couldn't delete artist :(");
//   }
// }

async function favoritArtistChecked(event, artist) {
  const artistID = { id: artist.id }; // Create an object with the artist's ID
  console.log("artisk id Front", artistID);
  const artistAsJson = JSON.stringify(artistID);

  console.log("sldkjfsalkjnfhlksjhfvlk", event.target.checked);
  const isChecked = event.target.checked;

  if (isChecked) {
    const response = await fetch(`${endpoint}/favoriteArtists`, {
      method: "POST",
      body: artistAsJson,
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      console.log("ID sent to favoriteArtists.json file");
      showFavoriteArtists();
    } else {
      console.error("Something went wrong with sending the ID");
    }
  } else {
    const response = await fetch(`${endpoint}/favoriteArtists/${artist.id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      showFavoriteArtists();
    }
  }
}

async function findFavoriteArtists() {
  const favArtistIds = await getFavoriteArtists();
  const allArtists = await getArtists();

  if (favArtistIds.length === 0) {
    const noFavs = document.getElementById("favoriteArtistList");
    noFavs.innerHTML = /* html */ `<p>No Favorite Artist Found</p>`;
  }

  const matchedArtists = allArtists.filter((artist) => favArtistIds.includes(String(artist.id)));

  console.log(matchedArtists);
  return matchedArtists;
}

async function showFavoriteArtists() {
  const matchedArtists = await findFavoriteArtists();
  document.querySelector("#favoriteArtistList").innerHTML = "";

  if (matchedArtists.length === 0) {
    const noFavs = document.getElementById("favoriteArtistList");
    noFavs.innerHTML = /* html */ `<p>No Favorite Artist Found</p>`;
  } else {
    for (const favArtist of matchedArtists) {
      showFavArtist(favArtist);
    }
  }
}

function showFavArtist(favArtist) {
  const html = /* html */ `
    <article class="fav-item">
    <div class="btns">
      <button class="btnShowArtistModal">Show more info</button>
    </div>
    </br>
    <img src="${favArtist.image}" />
      <h3>${favArtist.name}</h3>
      <p>Genre: ${favArtist.genres}</p>
    </article>
  `;
  document.querySelector("#favoriteArtistList").insertAdjacentHTML("beforeend", html);

  document.querySelector("#favoriteArtistList article:last-child").addEventListener("click", (event) => showArtistModal(event, favArtist));
}

function sortAndFilterArtists(event) {
  const sortValue = event.target.value;
  const genreFilter = document.getElementById("genreFilter");
  const selectedGenre = genreFilter.value;

  let filteredArtists = artists;

  // Apply genre filter
  if (selectedGenre !== "All") {
    filteredArtists = filterArtistsByGenre(filteredArtists, selectedGenre);
  }

  // Apply sorting
  if (sortValue === "name") {
    filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "age") {
    filteredArtists.sort((a, b) => new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime());
  }

  showArtistsAll(filteredArtists);
}

function filterArtistsByGenre(artists, selectedGenre) {
  if (selectedGenre === "All") {
    return artists; // Return all artists if 'All Genres' is selected
  }

  return artists.filter((artist) => artist.genres.includes(selectedGenre));
}
