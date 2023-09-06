"use strict";

window.addEventListener("load", start);
const endpoint = "http://localhost:3000";
let selectedArtist;
// let artistData;

function start() {
  console.log("we have connection to js 👌🙌");

  document
    .querySelector("#btn-create-artist")
    .addEventListener("click", () =>
      document.querySelector("#dialog-create-artist").showModal()
    );

  document
    .querySelector("#form-create")
    .addEventListener("submit", createArtist);
  document
    .querySelector("#form-update")
    .addEventListener("submit", submitUpdatedArtist);

  updateArtistpage();
  console.log("START FUNC");

  // document.querySelector("#sort").addEventListener("change", sortByX);
  // document.querySelector("#favoriteArtist").addEventListener("change", favoritArtistChecked)

  // getFavoriteArtists();
  // findFavoriteArtists();
  showFavoriteArtists();
}

async function updateArtistpage() {
  const artists = await getArtistsFromBackend();
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
  document
    .querySelector(".grid-container")
    .insertAdjacentHTML("beforeend", html);

  // document
  //   .querySelector(".grid-container article:last-child .btn-update-artist")
  //   .addEventListener("click", () => selectedToUpdate(artist));
  // document
  //   .querySelector(".grid-container article:last-child .btn-delete-artist")
  //   .addEventListener("click", () => deleteArtist(artist.id));

  document
    .querySelector(".grid-container article:last-child")
    .addEventListener("click", () => showArtistModal(artist));
}

function showArtistModal(artist) {
  console.log(artist);
  const html = /* html */ `
    <article class="grid-item">
    <button class="btn-update-artist">Update</button>
    <button class="btn-delete-artist">Delete</button>
    <input
          type="checkbox"
          id="favoriteArtist"
          name="favoriteArtist"
          value="true"
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

  document
    .querySelector(".btn-update-artist")
    .addEventListener("click", () => selectedToUpdate(artist));
  document
    .querySelector(".btn-delete-artist")
    .addEventListener("click", () => deleteArtist(artist.id));
  document
    .querySelector("#favoriteArtist")
    .addEventListener("change", () => favoritArtistChecked(artist));
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
    shortDescription: form.shortDescription.value,
  };

  // JSONify the new artist
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    // if success, update the grid
    updateArtistpage();
    // and scroll to top
    // scrollToTop();
    scrollIntoView({ behavior: "smooth" });
  } else {
    console.error("Something went wrong with posting a new artist Lise");
  }
}

function selectedToUpdate(artist) {
  selectedArtist = artist;
  console.log("my selected artist  ", selectedArtist);

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
    shortDescription: form.shortDescription.value,
  };

  // JSONify the updated artist
  const artistAsJson = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    updateArtistpage();
    scrollToTop({ behavior: "smooth" });
  }
}

async function deleteArtist(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    updateArtistpage();
    scrollToTop({ behavior: "smooth" });
  }
}

// async function favoritArtistChecked(artist) {
//   // console.log(event);
//   console.log(artist.id);
//   const artistID = { id: artist.id };
//   const artistAsJson = JSON.stringify(artistID);
//   const response = await fetch(`${endpoint}/artists/${artist.id}`, {
//     method: "POST",
//     body: artistAsJson,
//     headers: { "Content-Type": "application/json" },
//   });

//   if (response.ok) {
//     console.log("id sent to favoriteArtists.json file");
//   } else {
//     console.error("Something went wrong with sending the id");
//   }
// }

async function favoritArtistChecked(artist) {
  const artistID = { id: artist.id }; // Create an object with the artist's ID
  const artistAsJson = JSON.stringify(artistID);

  const response = await fetch(`${endpoint}/artists/${artist.id}`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    console.log("ID sent to favoriteArtists.json file");
  } else {
    console.error("Something went wrong with sending the ID");
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

  const matchedArtists = allArtists.filter((artist) =>
    favArtistIds.includes(String(artist.id))
  );

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
  document
    .querySelector("#favoriteArtistList")
    .insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#favoriteArtistList article:last-child")
    .addEventListener("click", () => showArtistModal(artist));
}
