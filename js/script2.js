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
