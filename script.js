const pokemonCount = 251; // 2세대 포켓몬의 총 수
const pokemonGallery = document.getElementById("pokemonGallery"); // 포켓몬 이미지를 표시할 HTML 요소

// 포켓몬 데이터를 가져오고 화면에 표시하는 비동기 함수
async function fetchPokemons() {
  // 1부터 pokemonCount까지의 숫자를 순회하며 포켓몬 데이터를 가져옴
  for (let i = 1; i <= pokemonCount; i++) {
    try {
      // 포켓몬 API에서 해당 포켓몬 데이터를 가져옴
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json(); // JSON 형태로 변환
      createPokemonCard(pokemon); // 가져온 데이터로 포켓몬 카드 생성
    } catch (error) {
      // 데이터 가져오기에 실패하면 에러를 콘솔에 출력
      console.error(`Error fetching Pokémon ${i}:`, error);
    }
  }
}

// 포켓몬 카드 생성 함수
function createPokemonCard(pokemon) {
  const card = document.createElement("div"); // 새로운 div 요소 생성
  card.className = "pokemon-card"; // 카드의 클래스 이름 설정
  card.dataset.name = pokemon.name.toLowerCase(); // 포켓몬 이름을 데이터 속성으로 저장
  card.dataset.pokemon = JSON.stringify({
    name: pokemon.name,
    image: pokemon.sprites.front_default, // 포켓몬 이미지 URL
    types: pokemon.types.map((typeInfo) => typeInfo.type.name).join(", "), // 포켓몬 타입들
    abilities: pokemon.abilities
      .map((abilityInfo) => abilityInfo.ability.name)
      .join(", "), // 포켓몬의 능력
    height: (pokemon.height / 10).toFixed(1), // 포켓몬의 높이 (미터 단위)
    weight: (pokemon.weight / 10).toFixed(1), // 포켓몬의 무게 (킬로그램 단위)
    stats: pokemon.stats
      .map((statInfo) => `${statInfo.stat.name}: ${statInfo.base_stat}`)
      .join(", "), // 포켓몬의 능력치
  });

  // 카드의 HTML 내용 설정
  card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" onerror="this.onerror=null; this.src='https://via.placeholder.com/120?text=No+Image'">
        <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    `;

  // 카드 클릭 시 모달을 열도록 이벤트 리스너 추가
  card.addEventListener("click", () => openModal(card.dataset.pokemon));

  // 생성한 카드를 갤러리에 추가
  pokemonGallery.appendChild(card);
}

// 모달을 열어 포켓몬의 상세 정보를 표시하는 함수
function openModal(pokemonData) {
  const data = JSON.parse(pokemonData); // 저장된 데이터 문자열을 객체로 변환
  document.getElementById("modalTitle").innerText = data.name; // 모달의 제목에 포켓몬 이름 설정
  document.getElementById("modalImage").src = data.image; // 모달에 포켓몬 이미지 설정
  document.getElementById("modalTypes").innerText = data.types; // 모달에 포켓몬 타입 설정
  document.getElementById("modalAbilities").innerText = data.abilities; // 모달에 포켓몬 능력 설정
  document.getElementById("modalHeight").innerText = data.height; // 모달에 포켓몬 높이 설정
  document.getElementById("modalWeight").innerText = data.weight; // 모달에 포켓몬 무게 설정
  document.getElementById("modalStats").innerText = data.stats; // 모달에 포켓몬 능력치 설정

  // 모달을 표시
  document.getElementById("pokemonModal").style.display = "block";
}

// 모달을 닫는 함수
function closeModal() {
  // 모달의 표시를 숨김
  document.getElementById("pokemonModal").style.display = "none";
}

// 포켓몬 필터링 기능
function filterPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase(); // 검색 입력값을 소문자로 변환
  const pokemonCards = document.querySelectorAll(".pokemon-card"); // 모든 포켓몬 카드 요소를 선택

  // 각 카드에 대해 검색 입력값을 포함하는지 확인
  pokemonCards.forEach((card) => {
    const name = card.dataset.name;
    if (name.includes(searchInput)) {
      card.style.display = ""; // 검색 입력값이 포함된 카드는 보이도록 설정
    } else {
      card.style.display = "none"; // 검색 입력값이 포함되지 않은 카드는 숨김
    }
  });
}

// 페이지 로드 시 포켓몬 갤러리 초기화(수정)
fetchPokemons().catch((error) =>
  console.error("Error initializing Pokémon gallery:", error)
);
