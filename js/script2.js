// data.jsonを読み込んで表示
fetch('data.json')
  .then(res => res.json())
  .then(data => displayMenuByCategory(data));

function displayMenuByCategory(menuItems) {
  const menuSection = document.getElementById("menu");
  
  // カテゴリーごとに分ける
  const categories = ["ドリンク", "麺", "ケーキ"];
  
  categories.forEach(category => {
    const items = menuItems.filter(item => item.category === category);
    if(items.length === 0) return;

    // カテゴリー見出し
    const h3 = document.createElement("h3");
    h3.textContent = category;
    h3.style.textAlign = "left";
    h3.style.color = "#8b5e3c";
    h3.style.margin = "20px 0 10px";
    menuSection.appendChild(h3);

    // 横スクロール用コンテナ
    const listDiv = document.createElement("div");
    listDiv.classList.add("menu-list");
    menuSection.appendChild(listDiv);

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h4>${item.name}</h4>
        <span class="price">${item.price}</span>
      `;
      // クリックでモーダル表示
      div.addEventListener("click", () => showDetail(item));
      listDiv.appendChild(div);
    });
  });
}

// モーダル表示関数はそのまま
function showDetail(item) {
  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailImage").alt = item.name;
  document.getElementById("detailName").textContent = item.name;
  document.getElementById("detailPrice").textContent = item.price;
  document.getElementById("detailDescription").textContent = item.description;
  document.getElementById("menuDetail").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

document.getElementById("closeDetail").addEventListener("click", () => {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});
document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("menuDetail").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});
