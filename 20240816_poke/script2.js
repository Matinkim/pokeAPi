// 포켓몬 총 수 설정
const pokemonCount = 1000; // 가져올 포켓몬의 총 개수를 설정

// DOM 요소 참조
const pokemonGallery = document.getElementById("pokemonGallery"); // 포켓몬 카드 갤러리를 담을 요소
const typeFilter = document.getElementById("typeFilter"); // 타입 필터 드롭다운 메뉴 요소
const darkModeButton = document.getElementById("darkModeButton"); // 다크 모드 토글 버튼 요소

/**
 * 포켓몬 데이터를 가져오고 화면에 표시하는 비동기 함수
 */
async function fetchPokemons() {
  const types = new Set(); // 포켓몬 타입을 저장할 집합 (중복된 타입을 허용하지 않음)

  for (let i = 1; i <= pokemonCount; i++) {
    // 1부터 설정된 총 포켓몬 수까지 반복
    try {
      // 포켓몬 API에서 데이터를 가져옴
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json();

      // 포켓몬 카드를 생성하여 갤러리에 추가
      createPokemonCard(pokemon);

      // 포켓몬 타입을 집합에 추가
      pokemon.types.forEach((typeInfo) => types.add(typeInfo.type.name));
    } catch (error) {
      console.error(`Error fetching Pokémon ${i}:`, error); // 에러가 발생할 경우 콘솔에 에러 메시지 출력
    }
  }

  // 포켓몬 타입 옵션을 드롭다운에 추가
  addTypeOptions(Array.from(types));
}

/**
 * 포켓몬 카드를 생성하여 갤러리에 추가하는 함수
 * @param {Object} pokemon - 포켓몬 데이터 객체
 */
function createPokemonCard(pokemon) {
  // 포켓몬 카드 생성
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.name = pokemon.name.toLowerCase(); // 카드 데이터에 포켓몬 이름 저장
  card.dataset.types = pokemon.types
    .map((typeInfo) => typeInfo.type.name)
    .join(", "); // 카드 데이터에 포켓몬 타입 저장
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

  // 카드 내부 HTML 설정
  card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" onerror="this.onerror=null; this.src='https://via.placeholder.com/120?text=No+Image'">
        <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    `;

  // 카드 클릭 시 모달을 열어 포켓몬 상세 정보를 표시
  card.addEventListener("click", () => openModal(card.dataset.pokemon));

  // 포켓몬 카드를 갤러리에 추가
  pokemonGallery.appendChild(card);
}

/**
 * 타입 필터 옵션을 드롭다운에 추가하는 함수
 * @param {Array} types - 포켓몬 타입 배열
 */
function addTypeOptions(types) {
  typeFilter.innerHTML = ""; // 드롭다운의 기존 옵션 제거
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type; // 타입 값을 옵션에 설정
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // 타입의 첫 글자를 대문자로 변환하여 옵션 텍스트 설정
    typeFilter.appendChild(option); // 드롭다운에 옵션 추가
  });

  // 모든 타입을 선택할 수 있는 옵션 추가
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "모든 타입";
  typeFilter.appendChild(allOption);
}

/**
 * 모달을 열어 포켓몬의 상세 정보를 표시하는 함수
 * @param {string} pokemonData - 포켓몬 데이터 JSON 문자열
 */
function openModal(pokemonData) {
  const data = JSON.parse(pokemonData); // JSON 문자열을 객체로 변환

  // 모달에 포켓몬의 정보를 설정
  document.getElementById("modalTitle").innerText = data.name;
  document.getElementById("modalImage").src = data.images.default;
  document.getElementById("modalShinyImage").src = data.images.shiny;
  document.getElementById("modalTypes").innerText = data.types;
  document.getElementById("modalAbilities").innerText = data.abilities;
  document.getElementById("modalHeight").innerText = data.height;
  document.getElementById("modalWeight").innerText = data.weight;
  document.getElementById("modalStats").innerText = data.stats;

  // 모달을 화면에 표시
  document.getElementById("pokemonModal").style.display = "flex";
}

/**
 * 모달을 닫는 함수
 */
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none"; // 모달을 화면에서 숨김
}

/**
 * 타입 필터링 기능
 */
function filterByType() {
  const selectedType = typeFilter.value.toLowerCase(); // 선택된 타입을 소문자로 변환
  const pokemonCards = document.querySelectorAll(".pokemon-card"); // 모든 포켓몬 카드 요소 선택

  // 각 포켓몬 카드에 대해
  pokemonCards.forEach((card) => {
    const types = card.dataset.types.split(", "); // 카드에서 타입 정보를 가져와 배열로 변환
    if (selectedType === "all" || types.includes(selectedType)) {
      card.style.display = ""; // 선택된 타입이 일치하거나 '모든 타입'이 선택되면 카드 표시
    } else {
      card.style.display = "none"; // 그렇지 않으면 카드 숨김
    }
  });
}

/**
 * 다크 모드 토글 함수
 */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode"); // body 요소에 'dark-mode' 클래스를 토글하여 다크 모드 활성화/비활성화
}

// 이벤트 리스너 등록
darkModeButton.addEventListener("click", toggleDarkMode); // 다크 모드 버튼 클릭 시 toggleDarkMode 함수 호출

// 포켓몬 데이터를 가져오고, 검색 및 타입 필터 이벤트 리스너 등록
fetchPokemons().then(() => {
  document
    .getElementById("searchInput")
    .addEventListener("keyup", filterPokemon); // 검색 입력 필드에서 키 입력 시 filterPokemon 함수 호출
  typeFilter.addEventListener("change", filterByType); // 타입 필터 드롭다운에서 선택 변경 시 filterByType 함수 호출
});

/**
 * 검색 기능
 */
function filterPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase(); // 검색 입력 필드의 값을 소문자로 변환
  const pokemonCards = document.querySelectorAll(".pokemon-card"); // 모든 포켓몬 카드 요소 선택

  // 각 포켓몬 카드에 대해
  pokemonCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase(); // 카드에서 포켓몬 이름을 소문자로 변환
    if (name.includes(searchInput)) {
      card.style.display = ""; // 검색 입력 값이 카드 이름에 포함되면 카드 표시
    } else {
      card.style.display = "none"; // 그렇지 않으면 카드 숨김
    }
  });
}
