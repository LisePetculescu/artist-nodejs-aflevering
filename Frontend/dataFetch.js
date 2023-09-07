"use strict";

const endpoint = "http://localhost:3000";

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

async function createArtist(newArtist) {
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: JSON.stringify(newArtist),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    return true;
  }
  return false;
}

async function PutUpdatedArtist(updatedArtist, id) {
  // JSONify the updated artist
  const artistAsJson = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    return true;
  }
}

async function deleteArtist(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return true;
  }
}

async function getFavoriteArtists() {
  const response = await fetch(`${endpoint}/favoriteArtists`);
  const favs = await response.json();
  console.log(favs);
  return favs;
}

// Export the functions
export {
  getArtists,
  createArtist,
  PutUpdatedArtist,
  deleteArtist,
  getFavoriteArtists,
};
