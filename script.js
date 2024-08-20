// 포켓몬 총 수 설정
const pokemonCount = 251;

// DOM 요소 참조
const pokemonGallery = document.getElementById("pokemonGallery"); // 포켓몬 카드 갤러리 요소
const typeFilter = document.getElementById("typeFilter"); // 타입 필터 드롭다운 메뉴
const darkModeButton = document.getElementById("darkModeButton"); // 다크 모드 토글 버튼

// 포켓몬 데이터를 가져오고 화면에 표시하는 비동기 함수
async function fetchPokemons() {
  const types = new Set(); // 포켓몬 타입의 집합을 저장할 변수

  for (let i = 1; i <= pokemonCount; i++) {
    try {
      // 포켓몬 API에서 데이터 가져오기
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json();
      createPokemonCard(pokemon); // 포켓몬 카드 생성 함수 호출

      // 포켓몬의 타입을 집합에 추가
      pokemon.types.forEach((typeInfo) => types.add(typeInfo.type.name));
    } catch (error) {
      console.error(`Error fetching Pokémon ${i}:`, error); // 데이터 가져오기에 실패했을 때의 에러 출력
    }
  }

  addTypeOptions(Array.from(types)); // 타입 필터 옵션 추가 함수 호출
}

// 포켓몬 카드 생성 함수
function createPokemonCard(pokemon) {
  const card = document.createElement("div"); // 새로운 카드 요소 생성
  card.className = "pokemon-card"; // 카드에 클래스 추가
  card.dataset.name = pokemon.name.toLowerCase(); // 포켓몬 이름을 데이터 속성으로 저장
  card.dataset.types = pokemon.types
    .map((typeInfo) => typeInfo.type.name) // 포켓몬의 타입을 데이터 속성으로 저장
    .join(", ");
  card.dataset.pokemon = JSON.stringify({
    name: pokemon.name, // 포켓몬 이름
    images: {
      default: pokemon.sprites.front_default, // 기본 이미지
      shiny: pokemon.sprites.front_shiny, // 이로치 이미지
    },
    types: pokemon.types.map((typeInfo) => typeInfo.type.name).join(", "), // 타입 정보
    abilities: pokemon.abilities
      .map((abilityInfo) => abilityInfo.ability.name) // 능력 정보
      .join(", "),
    height: (pokemon.height / 10).toFixed(1), // 높이 (m 단위로 변환)
    weight: (pokemon.weight / 10).toFixed(1), // 무게 (kg 단위로 변환)
    stats: pokemon.stats
      .map((statInfo) => `${statInfo.stat.name}: ${statInfo.base_stat}`) // 능력치 정보
      .join(", "),
  });

  card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"
        onerror="this.onerror=null; this.src='https://via.placeholder.com/120?text=No+Image'"> <!-- 이미지 로드 실패 시 대체 이미지 표시 -->
        <p>${
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        }</p> <!-- 포켓몬 이름을 첫 글자 대문자로 표시 -->
    `;

  card.addEventListener("click", () => openModal(card.dataset.pokemon)); // 카드 클릭 시 모달 열기

  pokemonGallery.appendChild(card); // 카드 갤러리에 추가
}

// 타입 필터 옵션 추가 함수
function addTypeOptions(types) {
  typeFilter.innerHTML = ""; // 기존 옵션 지우기
  types.forEach((type) => {
    const option = document.createElement("option"); // 새 옵션 요소 생성
    option.value = type; // 옵션의 값 설정
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // 옵션의 텍스트 (타입의 첫 글자 대문자)
    typeFilter.appendChild(option); // 드롭다운 메뉴에 옵션 추가
  });

  // '모든 타입' 옵션 추가
  const allOption = document.createElement("option"); // 새 옵션 요소 생성
  allOption.value = "all"; // '모든 타입' 값 설정
  allOption.textContent = "모든 타입"; // '모든 타입' 텍스트 설정
  typeFilter.appendChild(allOption); // 드롭다운 메뉴에 옵션 추가
}

// 모달을 열어 포켓몬의 상세 정보를 표시하는 함수
function openModal(pokemonData) {
  const data = JSON.parse(pokemonData); // JSON 문자열을 객체로 변환

  // 모달에 포켓몬의 상세 정보 표시
  document.getElementById("modalTitle").innerText = data.name;
  document.getElementById("modalImage").src = data.images.default;
  document.getElementById("modalShinyImage").src = data.images.shiny;
  document.getElementById("modalTypes").innerText = data.types;
  document.getElementById("modalAbilities").innerText = data.abilities;
  document.getElementById("modalHeight").innerText = data.height;
  document.getElementById("modalWeight").innerText = data.weight;
  document.getElementById("modalStats").innerText = data.stats;

  document.getElementById("pokemonModal").style.display = "flex"; // 모달 열기
}

// 모달을 닫는 함수
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none"; // 모달 닫기
}

// 타입 필터링 기능
function filterByType() {
  const selectedType = typeFilter.value.toLowerCase(); // 선택된 타입을 소문자로 변환
  const pokemonCards = document.querySelectorAll(".pokemon-card"); // 모든 포켓몬 카드 요소 선택

  pokemonCards.forEach((card) => {
    const types = card.dataset.types.split(", "); // 카드의 타입 정보 가져오기
    // 선택된 타입이 모든 타입이거나 카드의 타입 정보에 포함된 경우 표시, 아니면 숨기기
    if (selectedType === "all" || types.includes(selectedType)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode"); // 다크 모드 클래스 토글

  // 다크 모드에서 사용될 이미지 설정
  const headerImage = document.getElementById("headerImage");
  if (document.body.classList.contains("dark-mode")) {
    headerImage.src = "./20240816_poke/img/silver1.png"; // 다크 모드 이미지 경로
  } else {
    headerImage.src = "./20240816_poke/img/gold1jfif.jfif"; // 기본 이미지 경로
  }
}

// 이벤트 리스너 등록
darkModeButton.addEventListener("click", toggleDarkMode); // 다크 모드 버튼 클릭 시 toggleDarkMode 함수 호출

// 포켓몬 데이터를 가져오고 화면에 표시
fetchPokemons().then(() => {
  // 검색 입력 필드와 타입 필터의 이벤트 리스너 등록
  document
    .getElementById("searchInput")
    .addEventListener("keyup", filterPokemon); // 검색 입력 필터링
  typeFilter.addEventListener("change", filterByType); // 타입 필터링
});

// 검색 기능
function filterPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase(); // 입력된 검색어를 소문자로 변환
  const pokemonCards = document.querySelectorAll(".pokemon-card"); // 모든 포켓몬 카드 요소 선택

  pokemonCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase(); // 카드의 포켓몬 이름
    // 검색어가 포켓몬 이름에 포함된 경우 표시, 아니면 숨기기
    if (name.includes(searchInput)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}
