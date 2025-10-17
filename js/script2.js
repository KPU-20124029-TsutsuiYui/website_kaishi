fetch("data.json")
  .then(res => res.json())
  .then(data => displaycategories(data));

function displaycategories(menuItems) {
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = "";

  // カテゴリーごとに分ける
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.categories]) categories[item.categories] = [];
    categories[item.categories].push(item);
  });

  // カテゴリーごとに作成
  for (const [categories, items] of Object.entries(categories)) {
    const container = document.createElement("div");
    container.classList.add("categories-container");

    const title = document.createElement("h3");
    title.classList.add("categories-title");
    title.textContent = categories;
    container.appendChild(title);

    const list = document.createElement("div");
    list.classList.add("categories-list");

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item");








      
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <span class="price">${item.price}</span>
      `;

      div.addEventListener("click", () => showDetail(item));
      list.appendChild(div);
    });

    container.appendChild(list);
    categoriesDiv.appendChild(container);
  }
}

// 詳細モーダル
function showDetail(item) {
  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailName").textContent = item.name;
  document.getElementById("detailPrice").textContent = item.price;
  document.getElementById("detailDescription").textContent = item.description;

  document.getElementById("menuDetail").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// 閉じる処理
document.getElementById("closeDetail").addEventListener("click", closeDetail);
document.getElementById("overlay").addEventListener("click", closeDetail);

function closeDetail() {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

