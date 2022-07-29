(function() {

    const clockContainer = document.querySelector('.main-nav__clock'); 
    
    function updateClock() {
        clockContainer.innerText = new Date().toLocaleTimeString();
    }

    setInterval(updateClock, 1000);

})();