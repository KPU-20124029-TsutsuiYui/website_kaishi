// 開閉制御
document.addEventListener("DOMContentLoaded", function (){
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

  // メニュー表示/非表示
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // メニューを閉じる
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
});