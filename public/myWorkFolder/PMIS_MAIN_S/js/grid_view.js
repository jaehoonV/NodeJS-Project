$(function () {
    const wrapper = document.getElementById("cardWrapper");
    const container = document.querySelector(".card-container");
    const allCards = Array.from(container.querySelectorAll(".card"));
    const btnOne = document.getElementById("oneView");
    const btnFour = document.getElementById("fourView");
    const indicatorContainer = document.getElementById("indicator");

    const btnPrev = document.getElementById("prevSlide");
    const btnNext = document.getElementById("nextSlide");
    const btnToggle = document.getElementById("toggleSlide");
    const toggleIcon = document.getElementById("toggleIcon");

    let currentIndex = 0;
    let isSingleView = true;
    let isGridSlideView = false;
    let slideTimer;
    let isPlaying = true;

    // 슬라이드 갱신
    function updateSlide() {
        const slideCount = isGridSlideView
            ? document.querySelectorAll(".card-slide-group").length
            : document.querySelectorAll(".card").length;

        if (isSingleView || isGridSlideView) {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateIndicator(slideCount);
        } else {
            container.style.transform = `translateX(0)`;
        }
    }

    // 인디케이터 상태 반영
    function updateIndicator(count) {
        const dots = indicatorContainer?.querySelectorAll(".dot") || [];
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    // 인디케이터 생성
    function buildDots(count, clickHandler) {
        if (!indicatorContainer) return;
        indicatorContainer.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const dot = document.createElement("span");
            dot.className = "dot";
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                clickHandler?.();
            });
            indicatorContainer.appendChild(dot);
        }
    }

    // 자동 슬라이드
    function startAutoSlide() {
        clearInterval(slideTimer);
        const total = isGridSlideView
            ? document.querySelectorAll(".card-slide-group").length
            : document.querySelectorAll(".card").length;

        if (isPlaying && (isSingleView || isGridSlideView)) {
            slideTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % total;
                updateSlide();
            }, 4000);
        }
    }

    function pauseSlide() {
        clearInterval(slideTimer);
        isPlaying = false;
        if (toggleIcon) {
            toggleIcon.src = "images/ico_slide_play.png";
            toggleIcon.alt = "재생";
        }
    }

    function resumeSlide() {
        isPlaying = true;
        if (toggleIcon) {
            toggleIcon.src = "images/ico_slide_pause.png";
            toggleIcon.alt = "일시정지";
        }
        startAutoSlide();
    }

    function updateButtonState() {
        btnOne.classList.toggle("active", isSingleView);
        btnFour.classList.toggle("active", !isSingleView);
    }

    // grid-slide용 카드 4개씩 그룹화
    function buildGridSlideView() {
        const groupSize = 4;
        const groups = [];

        for (let i = 0; i < allCards.length; i += groupSize) {
            const group = document.createElement("div");
            group.className = "card-slide-group";
            allCards.slice(i, i + groupSize).forEach(card => group.appendChild(card));
            groups.push(group);
        }

        container.innerHTML = "";
        groups.forEach(g => container.appendChild(g));

        buildDots(groups.length, () => {
            updateSlide();
            startAutoSlide();
        });
    }

    // 1개 보기 버튼
    btnOne.addEventListener("click", () => {
        isSingleView = true;
        isGridSlideView = false;
        wrapper.classList.remove("grid-view", "grid-slide-view");
        wrapper.classList.add("single-view");

        container.innerHTML = "";
        allCards.forEach(card => container.appendChild(card));

        buildDots(allCards.length, () => {
            updateSlide();
            startAutoSlide();
        });

        currentIndex = 0;
        updateButtonState();
        updateSlide();
        startAutoSlide();
    });

    // 4개 보기 버튼
    btnFour.addEventListener("click", () => {
        isSingleView = false;

        if (allCards.length > 4) {
            isGridSlideView = true;
            wrapper.classList.remove("single-view", "grid-view");
            wrapper.classList.add("grid-slide-view", "grid-view");
            buildGridSlideView();
        } else {
            isGridSlideView = false;
            wrapper.classList.remove("single-view", "grid-slide-view");
            wrapper.classList.add("grid-view");
            container.innerHTML = "";
            allCards.forEach(card => container.appendChild(card));

            buildDots(1); // dot 1개만 (슬라이드 아님)
        }

        currentIndex = 0;
        updateButtonState();
        updateSlide();
        startAutoSlide();
    });

    // 마우스 오버/아웃 시 슬라이드 멈춤
    container.addEventListener("mouseenter", () => clearInterval(slideTimer));
    container.addEventListener("mouseleave", () => isPlaying && startAutoSlide());

    // 이전/다음 버튼
    btnPrev?.addEventListener("click", () => {
        const total = isGridSlideView
            ? document.querySelectorAll(".card-slide-group").length
            : document.querySelectorAll(".card").length;
        currentIndex = (currentIndex - 1 + total) % total;
        updateSlide();
        startAutoSlide();
    });

    btnNext?.addEventListener("click", () => {
        const total = isGridSlideView
            ? document.querySelectorAll(".card-slide-group").length
            : document.querySelectorAll(".card").length;
        currentIndex = (currentIndex + 1) % total;
        updateSlide();
        startAutoSlide();
    });

    // 재생/정지 버튼
    btnToggle?.addEventListener("click", () => {
        if (isPlaying) pauseSlide();
        else resumeSlide();
    });

    // 초기 진입
    updateButtonState();
    updateSlide();
    buildDots(allCards.length, () => {
        updateSlide();
        startAutoSlide();
    });
    startAutoSlide();
});
