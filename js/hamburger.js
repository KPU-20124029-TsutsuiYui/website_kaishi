document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav");
    const navLinks = nav.querySelectorAll("a");
    
    // クリックで開閉
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        nav.classList.toggle("active");
    });
    
    // メニュー項目をクリックしたら閉じる
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            nav.classList.remove("active");
        });
    });
});
