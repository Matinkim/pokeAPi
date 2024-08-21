// 포켓몬 총 수 설정
const pokemonCount = 251;

// DOM 요소 참조
const pokemonGallery = document.getElementById("pokemonGallery");
const typeFilter = document.getElementById("typeFilter");
const darkModeButton = document.getElementById("darkModeButton");

// 포켓몬 데이터를 저장할 배열
let pokemonData = [];

// 포켓몬 데이터를 가져오고 화면에 표시하는 비동기 함수
async function fetchPokemons() {
  const types = new Set();

  for (let i = 1; i <= pokemonCount; i++) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json();
      createPokemonCard(pokemon);

      pokemon.types.forEach((typeInfo) => types.add(typeInfo.type.name));
    } catch (error) {
      console.error(`Error fetching Pokémon ${i}:`, error);
    }
  }

  addTypeOptions(Array.from(types));
}

// 포켓몬 카드 생성 함수
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.name = pokemon.name.toLowerCase();
  card.dataset.types = pokemon.types
    .map((typeInfo) => typeInfo.type.name)
    .join(", ");
  card.dataset.pokemon = JSON.stringify({
    name: pokemon.name,
    images: {
      default: pokemon.sprites.front_default,
      shiny: pokemon.sprites.front_shiny,
    },
    types: pokemon.types.map((typeInfo) => typeInfo.type.name).join(", "),
    abilities: pokemon.abilities
      .map((abilityInfo) => abilityInfo.ability.name)
      .join(", "),
    height: (pokemon.height / 10).toFixed(1),
    weight: (pokemon.weight / 10).toFixed(1),
    stats: pokemon.stats
      .map((statInfo) => `${statInfo.stat.name}: ${statInfo.base_stat}`)
      .join(", "),
  });

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"
      onerror="this.onerror=null; this.src='https://via.placeholder.com/120?text=No+Image'">
    <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
  `;

  card.addEventListener("click", () => openModal(card.dataset.pokemon));

  pokemonGallery.appendChild(card);
  pokemonData.push(card);
}

// 타입 필터 옵션 추가 함수
function addTypeOptions(types) {
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
  });
}

// 필터링 기능
function filterPokemons() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const selectedType = typeFilter.value;

  pokemonData.forEach((card) => {
    const name = card.dataset.name;
    const types = card.dataset.types.split(", ");
    const matchesSearch = name.includes(searchInput);
    const matchesType = selectedType === "all" || types.includes(selectedType);

    card.style.display = matchesSearch && matchesType ? "block" : "none";
  });
}

// 모달 열기 함수
function openModal(data) {
  const pokemon = JSON.parse(data);

  document.getElementById("modalTitle").textContent = pokemon.name;
  document.getElementById("modalImage").src = pokemon.images.default;
  document.getElementById("modalShinyImage").src = pokemon.images.shiny;
  document.getElementById("modalTypes").textContent = pokemon.types;
  document.getElementById("modalAbilities").textContent = pokemon.abilities;
  document.getElementById("modalHeight").textContent = pokemon.height;
  document.getElementById("modalWeight").textContent = pokemon.weight;
  document.getElementById("modalStats").textContent = pokemon.stats;

  document.getElementById("pokemonModal").style.display = "flex";
}

// 모달 닫기 함수
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none";
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  const darkModeButton = document.getElementById("darkModeButton");

  if (isDarkMode) {
    darkModeButton.textContent = "라이트 모드";
    darkModeButton.dataset.mode = "dark";
  } else {
    darkModeButton.textContent = "다크 모드";
    darkModeButton.dataset.mode = "light";
  }
}

// 페이지 로드 시 포켓몬 데이터 가져오기
window.onload = () => {
  fetchPokemons();
};

// 다크 모드 버튼 클릭 시 토글 함수 호출
darkModeButton.addEventListener("click", toggleDarkMode);

// 검색 입력 및 타입 필터 선택 시 필터링 기능 호출
document
  .getElementById("searchInput")
  .addEventListener("keyup", filterPokemons);
typeFilter.addEventListener("change", filterPokemons);
