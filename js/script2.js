fetch("data.json")
  .then(res => res.json())
  .then(data => displayCategories(data));

function displayCategories(menuItems) {
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = "";

  // カテゴリーごとに分ける
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  // カテゴリーごとに作成
  for (const [category, items] of Object.entries(categories)) {
    const container = document.createElement("div");
    container.classList.add("category-container");

    const title = document.createElement("h3");
    title.classList.add("category-title");
    title.textContent = category;
    container.appendChild(title);

    const list = document.createElement("div");
    list.classList.add("category-list");

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item");

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <span class="price">${item.price}</span>
    `;

    // クリックで詳細表示
    div.addEventListener("click", () => showDetail(item));

    menuList.appendChild(div);
  });
}

// 詳細表示関数
function showDetail(item) {
  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailImage").alt = item.name;
  document.getElementById("detailName").textContent = item.name;
  document.getElementById("detailPrice").textContent = item.price;
  document.getElementById("detailDescription").textContent = item.description;

  document.getElementById("menuDetail").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// 閉じるボタン
document.getElementById("closeDetail").addEventListener("click", () => {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// オーバーレイクリックでも閉じる
document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});



