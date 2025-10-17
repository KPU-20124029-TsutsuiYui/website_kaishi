document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const submitBtn = document.getElementById("submitReview");
    const deleteAllBtn = document.getElementById("deleteAllReviews");
    const usernameInput = document.getElementById("username");
    const commentInput = document.getElementById("comment");
    const reviewList = document.getElementById("reviewList");
    
    let selectedRating = 0;

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
        const username = usernameInput.value.trim();
        const comment = commentInput.value.trim();
        
        if (!username || !comment || selectedRating === 0) {
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
            username,
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
        usernameInput.value = "";
        commentInput.value = "";
        selectedRating = 0;
        updateStars(0);
    });

    // 全削除ボタン
    deleteAllBtn.addEventListener("click", () => {
        if (confirm("本当にすべての口コミを削除しますか？")) {
            localStorage.removeItem("reviews");
            reviewList.innerHTML = "";
            alert("すべての口コミを削除しました。");
        }
    });
    
    // 口コミをHTMLに描画する関数
    function renderReview(review, prepend = false) {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-username">${review.username}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
            <div class="review-comment">${review.comment}</div>
        `;
        if (prepend) {
            reviewList.prepend(reviewItem); // 新しいものを上に
        } else {
            reviewList.appendChild(reviewItem); // 読み込み時は古い順
        }
    }
});