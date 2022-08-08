const slides = document.querySelectorAll('.slider-wrapper .testimonials-carousel__slides__container .testimonials-slide');
const sliderLine = document.querySelector('.testimonials-carousel__slides__container');
let count =  0;
let width;
const dots = document.querySelectorAll('.circle')

function  init() {
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
    activeDot(count);
});

document.querySelector('.testimonials-carousel__btn-next').addEventListener('click', function(){
    count++;
    if (count >= slides.length) {
        count = 0;
    }
    rollSlider();
    activeDot(count);
});

function rollSlider() {
    sliderLine.style.transform = 'translate(-'+count*width+'px)';
};

const activeDot = n => {
    for(circle of dots) {
        circle.classList.remove('activee');
    }
    dots[n].classList.add('activee');
}

dots.forEach((item, indexDot) => {
    item.addEventListener('click', () => {
        count = indexDot;
        rollSlider();
        activeDot(count);
    })
})