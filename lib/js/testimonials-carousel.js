(function () {

    const slides = [
        `<div class = "testimonials-slide">
            <img class="testimonials-icons" src = "img/testimonials/cole_tiers.png" alt="Cole Tiers in the mountains">
            <h5 class="testimonials-person">Cole Tiers</h5>
            <p><span class="testimonials-quote">I wanted to see Norway since childhood when
                I saw a stylish house right in the middle of the Norwegian forest in some magazine.
                I thought then that I also want to live in such a house. This dream came true a few
                months ago on a tour of Norway. I am very happy! Thanks, guys!</span></p>
            <p class="testimonials-quote-date">October 28, 2018</p>
        </div>`,
        `<div class = "testimonials-slide">
            <img class="testimonials-icons" src = "img/testimonials/lilland_forester.png" alt="Lilland Forester with daughter">
            <h5 class="testimonials-person">Lilland Forester</h5>
            <p><span class="testimonials-quote">We went on this tour with our daughter,
                she was 5 years old. I was worried that it would be difficult for her but everything
                went great. We spent nights in good hotels with excellent breakfasts. My daughter always
                had something to eat, and the nature in Norway fascinated her even more than us!</span></p>
            <p class="testimonials-quote-date">May 13, 2019</p>
        </div>`,
        `<div class = "testimonials-slide">
            <img class="testimonials-icons" src = "img/testimonials/gull.jpg" alt="Gull">
            <h5 class="testimonials-person">Alice Hendricks</h5>
            <p><span class="testimonials-quote">I still can't believe I have seen the Northern
                Lights with my own eyes! That was incredible! When we arrived in Tromso, it was constantly
                snowing, the weather was bad, and the guide said that we were out of luck, most likely.
                But on the last night, right at midnight, the clouds left, and I saw it! It was magicall</span></p>
            <p class="testimonials-quote-date">January 12, 2020</p>
        </div>`
    ];

    let currentSlideInx = 0;

    function renderCarousel() {
        const slideContainer = document.querySelector('.testimonials-carousel__slides__container');
        slideContainer.innerHTML = slides[currentSlideInx];
    }

    function next() {
        currentSlideInx = currentSlideInx + 1 >= slides.length ? 0 : currentSlideInx + 1;
        renderCarousel();
    }   

    function prev() {
        currentSlideInx = currentSlideInx - 1 < 0 ? slides.length - 1 : currentSlideInx - 1;
        renderCarousel();
    }   

    setInterval(next, 7000);


    const nextButton = document.querySelector('.testimonials-carousel__btn-next');
    nextButton.addEventListener('click', next);

    const prevButton = document.querySelector('.testimonials-carousel__btn-prev');
    prevButton.addEventListener('click', prev);
    

    renderCarousel();

})();