document.addEventListener("DOMContentLoaded", function(){
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");
    
    hamburger.addEventListener("click", function(){
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
});