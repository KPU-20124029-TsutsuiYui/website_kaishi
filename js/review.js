document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const submitBtn = document.getElementById("submitReview");
    const deleteAllBtn = document.getElementById("deleteAllReviews");
    // const usernameInput = document.getElementById("username");
    const commentInput = document.getElementById("comment");
    const reviewList = document.getElementById("reviewList");
    const categorySelect = document.getElementById("categorySelect");
    const menuSelect = document.getElementById("menuSelect");
    
    let selectedRating = 0;
    let menuData = []; // メニューデータを格納する配列

    // 初期状態でプレースホルダ―の色を適用
    categorySelect.classList.add('placeholder-selected');
    menuSelect.classList.add('placeholder-selected');

    // data.JSONからメニューデータを非同期で取得
    fetch('https://raw.githubusercontent.com/KPU-20124029-TsutsuiYui/website_kaishi/refs/heads/main/JSON/data.JSON')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        menuData = data;
        populateCategories();
        populateMenus();
    })
    .catch(error => console.error('メニューデータの読み込みに失敗しました:', error));

    // カテゴリーのドロップダウンを生成
    function populateCategories() {
        // 重複しないカテゴリーのリストを作成
        const categories = [...new Set(menuData.map(item => item.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // メニューのドロップダウンを生成
    // selectedCategoryが指定されていれば、そのカテゴリのメニューのみ表示
    function populateMenus(selectedCategory = '') {
        menuSelect.innerHTML = '<option value="">メニューを選択</option>'; // 初期化
        menuSelect.classList.add('placeholder-selected'); // メニューリセット時もプレースホルダ―の色を適用
        
        const filteredMenus = selectedCategory
            ? menuData.filter(item => item.category === selectedCategory)
            : menuData;
        
        filteredMenus.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;
            menuSelect.appendChild(option);
        });
    }
    
    // カテゴリー選択時のイベント
    categorySelect.addEventListener('change', () => {
        populateMenus(categorySelect.value);
        // 選択状態に応じて色を変更
        if (categorySelect.value === "") {
            categorySelect.classList.add('placeholder-selected');
        } else {
            categorySelect.classList.remove('placeholder-selected');
        }
    });

    // メニュー選択時のイベント
    menuSelect.addEventListener('change', () => {
        const selectedMenuName = menuSelect.value;
        // 選択状態に応じて色を変更
        if (selectedMenuName) {
            menuSelect.classList.remove('placeholder-selected');
            const selectedMenuItem = menuData.find(item => item.name === selectedMenuName);
            if (selectedMenuItem) {
                categorySelect.value = selectedMenuItem.category;
                categorySelect.classList.remove('placeholder-selected');
            }
        } else {
            menuSelect.classList.add('placeholder-selected');
        }
    });

  // 初期読み込み時に、localStorageから口コミを読み込む
    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    savedReviews.forEach((review) => renderReview(review));

  // 星の選択処理
     stars.forEach((star) => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.dataset.value);
            updateStars(selectedRating);
        });
    });
    
    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.classList.toggle("active", index < rating);
        });
    }

  // 投稿ボタンの処理
    submitBtn.addEventListener("click", () => {
        // const username = usernameInput.value.trim();
        const comment = commentInput.value.trim();
        const category = categorySelect.value;
        const menu = menuSelect.value;
        
        if (!comment || selectedRating === 0 || !category || !menu) {
            alert("全ての項目を入力してください！");
            return;
        }
        
        const now = new Date();
        const timestamp = now.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        
        const newReview = {
            // username
            category,
            menu,
            comment,
            rating: selectedRating,
            date: timestamp,
        };
        
        // 表示
        renderReview(newReview, true);
        
        // localStorageに保存
        savedReviews.unshift(newReview);
        localStorage.setItem("reviews", JSON.stringify(savedReviews));

        // 入力欄リセット
        // usernameInput.value = "";
        commentInput.value = "";
        categorySelect.value = "";
        menuSelect.value = "";
        populateMenus();
        selectedRating = 0;
        updateStars(0);
        // リセット時にプレースホルダ―の色を戻す
        categorySelect.classList.add('placeholder-selected');
        menuSelect.classList.add('placeholder-selected');
    });

    // 全削除ボタン
    deleteAllBtn.addEventListener("click", () => {
        if (confirm("本当にすべての口コミを削除しますか？")) {
            localStorage.removeItem("reviews");
            reviewList.innerHTML = "";
            savedReviews.length = 0; // 配列をクリア
            alert("すべての口コミを削除しました。");
        }
    });
    
    // 口コミをHTMLに描画する関数
    function renderReview(review, prepend = false) {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");

        // カテゴリーとメニュー情報がある場合のみ表示
        const menuInfoHTML = review.category && review.menu
        ? `<div class="review-menu-info">${review.menu}</div>`
        : '';

        const dateHTML = `<span class="review-date">${review.date}</span>`;
        const starsHTML = `<div class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>`;
        const commentHTML = `<div class="review-comment">${review.comment}</div>`;
        reviewItem.innerHTML = `
            ${dateHTML}
            ${starsHTML}
            ${menuInfoHTML}
            ${commentHTML}
        `;
        
        if (prepend) {
            reviewList.prepend(reviewItem); // 新しいものを上に
        } else {
            reviewList.appendChild(reviewItem); // 読み込み時は古い順
        }
    }
});

