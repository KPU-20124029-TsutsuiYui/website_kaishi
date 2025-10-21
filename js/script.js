
// data.jsonからメニュー情報を取得して表示
async function loadMenu() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/KPU-20124029-TsutsuiYui/website_kaishi/refs/heads/main/JSON/data.JSON");
    const menuData = await response.json();
    displayMenuByCategory(menuData);

    // 検索ボタンのイベント
    const searchBtn = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", () => {
      const keyword = searchInput.value.trim();
      filterMenu(menuData, keyword);
    });

    // Enter1キーで検索
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

// メニューの一覧表示
function displayMenuByCategory(menuItems) {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";

  if (menuItems.length === 0) {
    menuList.innerHTML = "<p>該当する商品が見つかりません。</p>";
    return;
  }


  // categoryごとにグループ化
  const grouped = {};
  menuItems.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  // 各カテゴリーごとに描画
  Object.keys(grouped).forEach((category) => {
    const categorySection = document.createElement("div");
    categorySection.classList.add("category-group");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.textContent = category;
    categorySection.appendChild(categoryTitle);

    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("menu-category-container");

    grouped[category].forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("menu-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <span class="price">${item.price}</span>
      `;
      // 詳細表示のクリックイベント
      div.addEventListener("click", () => showDetail(item));
      categoryContainer.appendChild(div);
    });

    categorySection.appendChild(categoryContainer);
    menuList.appendChild(categorySection);
  });
}

// 検索機能
function filterMenu(menuData, keyword) {
  if (!keyword) {
    displayMenuByCategory(menuData);
    return;
  }

  const filtered = menuData.filter(item =>
    item.name.includes(keyword) || item.category.includes(keyword)
  );

  displayMenuByCategory(filtered);
}

// ページ読み込み時にメニューを表示
loadMenu();








