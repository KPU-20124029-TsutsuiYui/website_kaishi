// JSONを読み込んでカテゴリーごとに表示
fetch("data.json")
  .then(res => res.json())
  .then(data => displayMenuByCategory(data))
  .catch(err => console.error("メニューの読み込みに失敗しました:", err));

function displayMenuByCategory(menuItems) {
  const drinkList = document.getElementById("drinkList");
  const noodleList = document.getElementById("noodleList");
  const sweetList = document.getElementById("sweetList");

  // カテゴリごとに仕分け
  const drinks = menuItems.filter(i => i.category === "ドリンク");
  const noodles = menuItems.filter(i => i.category === "麺");
  const sweets = menuItems.filter(i => i.category === "ケーキ");

  createMenuItems(drinks, drinkList);
  createMenuItems(noodles, noodleList);
  createMenuItems(sweets, sweetList);
}

function createMenuItems(items, container) {
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");

    // 🔥 ここが重要：バッククォート（``）で囲む！
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <span class="price">${item.price}</span>
    `;

    div.addEventListener("click", () => showDetail(item));
    container.appendChild(div);
  });
}

function showDetail(item) {
  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailImage").alt = item.name;
  document.getElementById("detailName").textContent = item.name;
  document.getElementById("detailPrice").textContent = item.price;
  document.getElementById("detailDescription").textContent = item.description;

  document.getElementById("menuDetail").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

document.getElementById("closeDetail").addEventListener("click", closeDetail);
document.getElementById("overlay").addEventListener("click", closeDetail);

function closeDetail() {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
