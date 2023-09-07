"use strict";

window.addEventListener("load", start);
const endpoint = "http://localhost:3000";
let selectedArtist;
let artists;

function start() {
  console.log("we have connection to js 👌🙌");

  document.querySelector("#btn-create-artist").addEventListener("click", () => document.querySelector("#dialog-create-artist").showModal());

  document.querySelector("#form-create").addEventListener("submit", createArtist);
  document.querySelector("#form-update").addEventListener("submit", submitUpdatedArtist);

  updateArtistpage();
  console.log("START FUNC");

  // document.querySelector("#sortAll").addEventListener("change", showArtistsAll);
  document.querySelector("#sortAll").addEventListener("change", (event) => sortAllByX(event));
  // document.querySelector("#sortAll").addEventListener("change", (event) => sortAllByX(event));

  // document.querySelector("#favoriteArtist").addEventListener("change", favoritArtistChecked)

  // getFavoriteArtists();
  // findFavoriteArtists();
  showFavoriteArtists();
}

async function updateArtistpage() {
  artists = await getArtistsFromBackend();
  showArtistsAll(artists);
}

async function getArtistsFromBackend() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  console.log(data);
  // artistData = data;
  return data;
}

function showArtistsAll(array) {
  // document.querySelector("#artist-table-body").innerHTML = "";
  document.querySelector(".grid-container").innerHTML = "";

  // sortAllByX();

  for (const artist of array) {
    // sortAllByX();
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

  // document
  //   .querySelector(".grid-container article:last-child .btn-update-artist")
  //   .addEventListener("click", () => selectedToUpdate(artist));
  // document
  //   .querySelector(".grid-container article:last-child .btn-delete-artist")
  //   .addEventListener("click", () => deleteArtist(artist.id));

  document.querySelector(".grid-container article:last-child").addEventListener("click", (event) => showArtistModal(event, artist));
}

async function showArtistModal(event, artist) {
  console.log(artist);
  console.log(event);

  const isFav = await isFavorite(artist.id);
  console.log(isFav);

  const html = /* html */ `
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
}

async function isFavorite(id) {
  const favArtistIds = await getFavoriteArtists();

  if (favArtistIds.includes(String(id))) {
    return true;
  } else {
    return false;
  }
}

async function createArtist(event) {
  event.preventDefault();

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

  // JSONify the new artist
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" }
  });

  if (response.ok) {
    // if success, update the grid
    updateArtistpage();
    // and scroll to top
    // scrollToTop();
    // scrollIntoView({ behavior: "smooth" });
  } else {
    console.error("Something went wrong with posting a new artist Lise");
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

  PutUpdatedArtist(updatedArtist, selectedArtist.id);
}

async function PutUpdatedArtist(updatedArtist, id) {
  // JSONify the updated artist
  const artistAsJson = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" }
  });
  if (response.ok) {
    updateArtistpage();
    showFavoriteArtists();
  }
}

async function deleteArtist(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    updateArtistpage();
    showFavoriteArtists();
    scrollToTop({ behavior: "smooth" });
  }
}

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
      // updateArtistpage();
      showFavoriteArtists();
    } else {
      console.error("Something went wrong with sending the ID");
    }
  } else {
    const response = await fetch(`${endpoint}/favoriteArtists/${artist.id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      // updateArtistpage();
      showFavoriteArtists();
    }
  }
}

async function getFavoriteArtists() {
  const response = await fetch(`${endpoint}/favoriteArtists`);
  const favs = await response.json();
  console.log(favs);
  // console.log(artistData);
  // const artists = await getArtistsFromBackend();
  // console.log("bbbbbbbbb", artists);
  return favs;
}
// getFavoriteArtists()

async function findFavoriteArtists() {
  const favArtistIds = await getFavoriteArtists();
  const allArtists = await getArtistsFromBackend();

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

// function sortAllByX(event) {
//   console.log(event);
//   console.log(this.value);
//   const sortValue = this.value;

//   if (sortValue === "name") {
//     return artist.sort((nameA, nameB) => nameA.localeCompare(nameB));
//   }
// }

function sortAllByX(event) {
  const sortValue = event.target.value;
  console.log(event);
  // console.log(artists);

  if (sortValue === "name") {
    const sortedArtists = artists.slice().sort((a, b) => a.name.localeCompare(b.name));
    showArtistsAll(sortedArtists);
  } else if (sortValue === "age") {
    const sortedArtistsByAge = artists.slice().sort((a, b) => new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime());
    {
      showArtistsAll(sortedArtistsByAge);
    }
  } else {
    updateArtistpage();
  }
}
