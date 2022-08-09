(function () {
    const slides = [
        `<div class="stunning-spots-slide">
        <img onclick="img/stunning-spots-norway-landscapes/norway-landscapes-1.jpeg" src="img/stunning-spots-norway-landscapes/norway-landscapes-1.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="stunning-spots-slide">
        <img onclick="img/stunning-spots-norway-landscapes/norway-landscapes-2.jpeg" src="img/stunning-spots-norway-landscapes/norway-landscapes-2.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="stunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-3.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="stunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-4.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="stunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-5.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="s"tunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-6.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`
    ];

    let currentSlideIdx = 0;

    function renderCarousel() {
        const slideContainer = document.querySelector('.stunning-spots-carousel__slides');
        slideContainer.innerHTML = slides[currentSlideIdx];
        if (window.innerWidth > 768) {
            const secondSlideIdx = currentSlideIdx + 1 >= slides.length ? 0 : currentSlideIdx + 1;
            slideContainer.innerHTML += slides[secondSlideIdx];
        if (window.innerWidth > 992) {
            const thirdSlideIdx = secondSlideIdx + 1 >= slides.length ? 0 : secondSlideIdx + 1;
            slideContainer.innerHTML += slides[thirdSlideIdx];
            }
        }
    }
    function prev() {
        currentSlideIdx = currentSlideIdx - 1 < 0 ? slides.length - 1 : currentSlideIdx - 1;
        renderCarousel();
    }

    function next() {
        currentSlideIdx = currentSlideIdx + 1 >= slides.length ? 0 : currentSlideIdx + 1;
        renderCarousel();
    }

    setInterval(next, 5000);

    const prevButton = document.querySelector('.stunning-spots-carousel__btn-prev');
    prevButton.addEventListener('click', prev);

    const nextButton = document.querySelector('.stunning-spots-carousel__btn-next');
    nextButton.addEventListener('click', next);

    renderCarousel();

    window.addEventListener('resize', renderCarousel);

})();