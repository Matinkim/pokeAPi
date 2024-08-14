const pokemonCount = 251; // 2세대 포켓몬까지의 총 수
const pokemonGallery = document.getElementById("pokemonGallery");

// Fetch and display Pokémon images
async function fetchPokemons() {
  for (let i = 1; i <= pokemonCount; i++) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json();
      createPokemonCard(pokemon);
    } catch (error) {
      console.error(`Error fetching Pokémon ${i}:`, error);
    }
  }
}

// Create Pokémon card
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.name = pokemon.name.toLowerCase();
  card.dataset.pokemon = JSON.stringify({
    name: pokemon.name,
    image: pokemon.sprites.front_default,
    types: pokemon.types.map((typeInfo) => typeInfo.type.name).join(", "),
    abilities: pokemon.abilities
      .map((abilityInfo) => abilityInfo.ability.name)
      .join(", "),
    height: (pokemon.height / 10).toFixed(1), // Height in meters
    weight: (pokemon.weight / 10).toFixed(1), // Weight in kg
    stats: pokemon.stats
      .map((statInfo) => `${statInfo.stat.name}: ${statInfo.base_stat}`)
      .join(", "),
  });

  card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" onerror="this.onerror=null; this.src='https://via.placeholder.com/120?text=No+Image'">
        <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    `;

  card.addEventListener("click", () => openModal(card.dataset.pokemon));

  pokemonGallery.appendChild(card);
}

// Open modal with Pokémon details
function openModal(pokemonData) {
  const data = JSON.parse(pokemonData);
  document.getElementById("modalTitle").innerText = data.name;
  document.getElementById("modalImage").src = data.image;
  document.getElementById("modalTypes").innerText = data.types;
  document.getElementById("modalAbilities").innerText = data.abilities;
  document.getElementById("modalHeight").innerText = data.height;
  document.getElementById("modalWeight").innerText = data.weight;
  document.getElementById("modalStats").innerText = data.stats;

  document.getElementById("pokemonModal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none";
}

// Filter Pokémon based on input
function filterPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const pokemonCards = document.querySelectorAll(".pokemon-card");

  pokemonCards.forEach((card) => {
    const name = card.dataset.name;
    if (name.includes(searchInput)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// Initialize Pokémon gallery
fetchPokemons().catch((error) =>
  console.error("Error initializing Pokémon gallery:", error)
);
