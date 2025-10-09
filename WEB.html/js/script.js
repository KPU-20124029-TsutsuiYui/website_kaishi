async function loadMenu() {
  try {
    const response = await fetch("../JSON/data.json");
    const menuData = await response.json();
    displayMenu(menuData);

    const searchBtn = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", () => {
      const keyword = searchInput.value.trim();
      filterMenu(menuData, keyword);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        filterMenu(menuData, keyword);
      }
    });

  } catch (error) {
    console.error("メニューの読み込みに失敗しました:", error);
  }
}

function displayMenu(menuItems) {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";

  if (menuItems.length === 0) {
    menuList.innerHTML = "<p>該当する商品が見つかりません。</p>";
    return;
  }

  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <span class="price">${item.price}</span>
    `;

    menuList.appendChild(div);
  });
}

function filterMenu(menuData, keyword) {
  if (!keyword) {
    displayMenu(menuData);
    return;
  }

  const filtered = menuData.filter(item =>
    item.name.includes(keyword) || item.category.includes(keyword)
  );

  displayMenu(filtered);
}

loadMenu();