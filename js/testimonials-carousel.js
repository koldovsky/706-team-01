const slides = document.querySelectorAll('.slider-wrapper .testimonials-carousel__slides__container .testimonials-slide');
const sliderLine = document.querySelector('.testimonials-carousel__slides__container');
let count =  0;
let width;

function  init() {
    console.log('resize');
    width = document.querySelector('.slider-wrapper').offsetWidth;
    sliderLine.style.width = width*slides.length + 'px';
    slides.forEach(item => {
        item.style.width = width + 'px';
        item.style.height = 'auto';
    });
    rollSlider();
}

window.addEventListener('resize', init);
init();

document.querySelector('.testimonials-carousel__btn-prev').addEventListener('click', function(){
    count--;
    if (count < 0) {
        count = slides.length - 1;
    }
    rollSlider();
});

document.querySelector('.testimonials-carousel__btn-next').addEventListener('click', function(){
    count++;
    if (count >= slides.length) {
        count = 0;
    }
    rollSlider();
});

function rollSlider() {
    sliderLine.style.transform = 'translate(-'+count*width+'px)';
}