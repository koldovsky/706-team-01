(function () {
    const slides = [
        `<div class="stunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-1.jpeg" class="image-slide" alt="norway-landscapes"
        </div>`,
            `<div class="stunning-spots-slide">
        <img src="img/stunning-spots-norway-landscapes/norway-landscapes-2.jpeg" class="image-slide" alt="norway-landscapes"
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

    // setInterval(next, 3000);

    const prevButton = document.querySelector('.stunning-spots-carousel__btn-prev');
    prevButton.addEventListener('click', prev);

    const nextButton = document.querySelector('.stunning-spots-carousel__btn-next');
    nextButton.addEventListener('click', next);
    
    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName(".stunning-spots-slide");
        var dots = document.getElementsByClassName(".slider-dots");
        if (n > slides.length) {
          slideIndex = 1
        }
        if (n < 1) {
            slideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }

    renderCarousel();

    window.addEventListener('resize', renderCarousel);

})();