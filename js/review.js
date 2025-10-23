document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const submitBtn = document.getElementById("submitReview");
    const deleteAllBtn = document.getElementById("deleteAllReviews");
    const commentInput = document.getElementById("comment");
    const reviewList = document.getElementById("reviewList");
    
    // 投稿フォームの選択ボックス
    const categorySelect = document.getElementById("categorySelect");
    const menuSelect = document.getElementById("menuSelect");
    
    // フィルターの選択ボックス (今回追加/既存)
    const ratingFilter = document.getElementById("ratingFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const menuFilter = document.getElementById("menuFilter");
    
    let selectedRating = 0;
    let menuData = []; // メニューデータを格納する配列
    let savedReviews = []; // 口コミデータを格納する配列 (localStorageからロード)

    // プレースホルダースタイル適用/解除
    function togglePlaceholderStyle(selectElement) {
        if (selectElement.value === "" || selectElement.value === "all") {
            selectElement.classList.add('placeholder-selected');
        } else {
            selectElement.classList.remove('placeholder-selected');
        }
    }

    // 初期状態でプレースホルダ―の色を適用 (投稿フォームとフィルター)
    togglePlaceholderStyle(categorySelect);
    togglePlaceholderStyle(menuSelect);
    if (categoryFilter) togglePlaceholderStyle(categoryFilter);
    if (menuFilter) togglePlaceholderStyle(menuFilter);

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
        populateCategories(categorySelect); // 投稿フォームのカテゴリーを生成
        populateMenus(menuSelect);          // 投稿フォームのメニューを生成
        
        // フィルターの選択肢を生成
        if (categoryFilter) populateCategories(categoryFilter);
        if (menuFilter) populateMenus(menuFilter);
    })
    .catch(error => console.error('メニューデータの読み込みに失敗しました:', error));

    // カテゴリーのドロップダウンを生成
    function populateCategories(selectElement, selectedCategory = '') {
        // 最初のoption ("カテゴリーを選択"または"指定なし") を保持
        const initialOption = selectElement.querySelector('option');
        selectElement.innerHTML = '';
        if (initialOption) {
            selectElement.appendChild(initialOption.cloneNode(true));
        } else {
            // 初期化されていない場合はデフォルトの"指定なし"オプションを追加
            const defaultText = selectElement.id === 'categoryFilter' ? '指定なし' : 'カテゴリーを選択';
            const defaultVal = selectElement.id === 'categoryFilter' ? 'all' : '';
            const defaultOption = document.createElement("option");
            defaultOption.value = defaultVal;
            defaultOption.textContent = defaultText;
            selectElement.appendChild(defaultOption);
        }

        // 重複しないカテゴリーのリストを作成
        const categories = [...new Set(menuData.map(item => item.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            selectElement.appendChild(option);
        });
        
        if (selectedCategory) {
             selectElement.value = selectedCategory;
        }
        togglePlaceholderStyle(selectElement);
    }

    // メニューのドロップダウンを生成
    function populateMenus(selectElement, selectedCategory = '') {
        const initialOption = selectElement.querySelector('option');
        selectElement.innerHTML = ''; // 初期化
        if (initialOption) {
            selectElement.appendChild(initialOption.cloneNode(true));
        } else {
            // 初期化されていない場合はデフォルトの"指定なし"オプションを追加
            const defaultText = selectElement.id === 'menuFilter' ? '指定なし' : 'メニューを選択';
            const defaultVal = selectElement.id === 'menuFilter' ? 'all' : '';
            const defaultOption = document.createElement("option");
            defaultOption.value = defaultVal;
            defaultOption.textContent = defaultText;
            selectElement.appendChild(defaultOption);
        }
        
        const filteredMenus = selectedCategory
            ? menuData.filter(item => item.category === selectedCategory)
            : menuData;
        
        filteredMenus.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
        togglePlaceholderStyle(selectElement);
    }
    
    // フォーム: カテゴリー選択時のイベント
    categorySelect.addEventListener('change', () => {
        populateMenus(menuSelect, categorySelect.value);
        togglePlaceholderStyle(categorySelect);
    });

    // フォーム: メニュー選択時のイベント
    menuSelect.addEventListener('change', () => {
        const selectedMenuName = menuSelect.value;
        if (selectedMenuName) {
            const selectedMenuItem = menuData.find(item => item.name === selectedMenuName);
            if (selectedMenuItem) {
                // メニューを選択したら、自動でカテゴリーも選択
                categorySelect.value = selectedMenuItem.category;
                togglePlaceholderStyle(categorySelect);
            }
        }
        togglePlaceholderStyle(menuSelect);
    });

    if (categoryFilter && menuFilter) {
        // フィルター: カテゴリー変更時のイベント
        categoryFilter.addEventListener('change', () => {
            // カテゴリーフィルターが変わったら、メニューフィルターの選択肢を絞り込む
            const selectedCategory = categoryFilter.value !== 'all' ? categoryFilter.value : '';
            populateMenus(menuFilter, selectedCategory);
            // メニューフィルターを"指定なし"に戻す
            menuFilter.value = 'all'; 

            togglePlaceholderStyle(categoryFilter);
            togglePlaceholderStyle(menuFilter);
            displayReviews(savedReviews); // フィルター適用
        });

        // フィルター: メニュー変更時のイベント
        menuFilter.addEventListener('change', () => {
            const selectedMenuName = menuFilter.value;
            if (selectedMenuName !== 'all') {
                const selectedMenuItem = menuData.find(item => item.name === selectedMenuName);
                if (selectedMenuItem) {
                    // メニューを選択したら、自動でカテゴリーフィルターも連動させる
                    categoryFilter.value = selectedMenuItem.category;
                }
            } else if (categoryFilter.value !== 'all') {
                 // メニューを'指定なし'に戻す際、カテゴリーが'指定なし'でなければ、メニュー選択肢をカテゴリーで再絞り込み
                const selectedCategory = categoryFilter.value !== 'all' ? categoryFilter.value : '';
                populateMenus(menuFilter, selectedCategory);
            } else {
                 // メニューもカテゴリーも指定なしの場合、全メニューを表示し直す
                 populateMenus(menuFilter, '');
            }

            togglePlaceholderStyle(categoryFilter);
            togglePlaceholderStyle(menuFilter);
            displayReviews(savedReviews); // フィルター適用
        });
    }

    // フィルター: 星評価変更時のイベント
    if (ratingFilter) {
        ratingFilter.addEventListener('change', () => {
            displayReviews(savedReviews); // フィルター適用
        });
    }

    // --- 星の選択処理 ---
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

    // --- データロードと投稿処理 ---
     loadReviews();
     function loadReviews() {
        savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        displayReviews(savedReviews);
    }
    
    // 投稿ボタンの処理
    submitBtn.addEventListener("click", () => {
        const comment = commentInput.value.trim();
        const category = categorySelect.value;
        const menu = menuSelect.value;
        
        if (!comment || selectedRating === 0 || !category || !menu) {
            alert("全ての項目を入力してください！");
            return;
        }
        
        const now = new Date();
        const timestamp = now.toLocaleString("ja-JP", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
        
        const newReview = { category, menu, comment, rating: selectedRating, date: timestamp };
        
        savedReviews.unshift(newReview);
        localStorage.setItem("reviews", JSON.stringify(savedReviews));

        displayReviews(savedReviews); // リストを再描画

        // 入力欄リセット
        commentInput.value = "";
        categorySelect.value = "";
        menuSelect.value = "";
        populateMenus(menuSelect);
        selectedRating = 0;
        updateStars(0);
        togglePlaceholderStyle(categorySelect);
        togglePlaceholderStyle(menuSelect);
    });

    // 全削除ボタン
    deleteAllBtn.addEventListener("click", () => {
        if (confirm("本当にすべての口コミを削除しますか？")) {
            localStorage.removeItem("reviews");
            savedReviews.length = 0;
            reviewList.innerHTML = "";
            alert("すべての口コミを削除しました。");
        }
    });
    
    // --- 口コミをHTMLに描画する関数 (フィルター処理を含む) ---
    function displayReviews(reviews) {
        reviewList.innerHTML = ""; // 既存のリストをクリア

        // 1. フィルター条件の取得 (ratingFilterが存在しない場合は 'all' をデフォルトとする)
        const ratingFilterValue = ratingFilter ? ratingFilter.value : 'all';
        const categoryFilterValue = categoryFilter ? categoryFilter.value : 'all';
        const menuFilterValue = menuFilter ? menuFilter.value : 'all';

        // 2. 複合フィルターの適用
        let filteredReviews = reviews.filter(review => {
            // 星評価フィルター
            const isRatingMatch = ratingFilterValue === 'all' || review.rating === parseInt(ratingFilterValue);
            
            // カテゴリーフィルター
            const isCategoryMatch = categoryFilterValue === 'all' || review.category === categoryFilterValue;
            
            // メニューフィルター
            const isMenuMatch = menuFilterValue === 'all' || review.menu === menuFilterValue;

            return isRatingMatch && isCategoryMatch && isMenuMatch;
        });

        // 3. 描画
        if (filteredReviews.length === 0) {
            reviewList.innerHTML = "<p style='text-align:center; color:#8b5e3c; font-weight:bold;'>該当する口コミはありません。</p>";
            return;
        }

        filteredReviews.forEach(review => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");
            
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

            reviewList.appendChild(reviewItem);
        });
    }
});


