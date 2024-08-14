document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const digimonList = document.getElementById("digimon-list");

  // 디지몬 데이터 가져오기
  fetch("https://digimon-api.vercel.app/api/digimon")
    .then((response) => response.json())
    .then((data) => {
      let digimons = data;
      renderDigimons(digimons);

      // 검색 기능 추가
      searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const filteredDigimons = digimons.filter((digimon) =>
          digimon.name.toLowerCase().includes(query)
        );
        renderDigimons(filteredDigimons);
      });

      function renderDigimons(digimons) {
        digimonList.innerHTML = "";
        digimons.forEach((digimon) => {
          const card = document.createElement("div");
          card.className = "digimon-card";
          card.innerHTML = `
                        <img src="${digimon.img}" alt="${digimon.name}">
                        <h3>${digimon.name}</h3>
                        <p>${digimon.level}</p>
                    `;
          digimonList.appendChild(card);
        });
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});
