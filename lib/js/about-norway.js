function encode(val) {
    return encodeURIComponent(val);
};
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function clientWidth() {
    return Math.min(document.documentElement.clientWidth, (window.innerWidth || 0));
}
function clientHeight() {
    return Math.min(document.documentElement.clientHeight, (window.innerHeight || 0));
}

function elementSibling(el, v) {
    v = v ? 'previousSibling' : 'nextSibling';
    while (el && !el.tagName) el = el[v];
    return el;
}

function nextSibling(el) {
    return elementSibling((el || {}).nextSibling);
}

function prevSibling(el) {
    return elementSibling((el || {}).previousSibling, 1);
}

function getVendorPrefix() {
    const ua = navigator.userAgent.toLowerCase();
    const match = /opera/.exec(ua) || /msie/.exec(ua) || /firefox/.exec(ua) || /(chrome|safari)/.exec(ua);
    const vendors = {
        opera: 'O',
        chrome: 'webkit',
        safari: 'webkit',
        firefox: 'Moz',
        msie: 'ms'
    };

    return vendors[match[0]];
}

const applyCSS = (function () {
    const prefix = getVendorPrefix(); // function, that detects prefix using UA string

    return function (element, styleName, styleValue) {
        // Collecting right style name
        const realStyleName = getStyleName();

        // Do nothing if there's no right style name
        if (!realStyleName) return;

        // Applying style 
        element.style[realStyleName] = styleValue;

        function getStyleName() {
            // If there's no need for prefix
            if (styleName in element.style) {
                return styleName;
            }
            // Creating style with vendor prefix
            const prefixedStyleName = prefix + styleName.slice(0, 1).toUpperCase() + styleName.slice(1);
            // Checking again
            if (prefixedStyleName in element.style) {
                return prefixedStyleName;
            }
            // Browser has no support for this style. Shame! :)
            return false;
        }
    };
})();

function setStyle(elem, stylesObject) {
    let value, isN;
    for (const name in stylesObject) {
        value = stylesObject[name];
        isN = isNumeric(value);
        if (isN && (/height|width/i).test(name)) value = Math.abs(value);
        value = isN && !(/z-?index|font-?weight|opacity|zoom|line-?height/i).test(name) ? value + 'px' : value;
        if (elem.style[name] !== value) {
            applyCSS(elem, name, value);
        }
    }
}

function isInited(el, name) {
    return data(el, name || '__INITED__');
}

function data(el, name, data) {
    if (!el) return false;
    if (!el['__DATA__']) el['__DATA__'] = {};
    if (typeof data !== "undefined") {
        if (!el['__DATA__'][name]) el['__DATA__'][name] = {};
        el['__DATA__'][name] = data;
    }
    if (name) return el['__DATA__'][name];
    return el['__DATA__'];
}

function _options(box, extendParams, defaultParams, paramName) {
    paramName = paramName || '__OPTIONS__';
    box = box || {};
    let options = data(box, paramName) // if assigned previously
        || data(box, paramName, Object.assign(defaultParams || {})); // assign default params

    if (extendParams) {
        options = data(box, paramName, Object.assign(options, extendParams));
    }
    return options;
}

var Ajax = {};
Ajax.prepareData = function (data) {
    const query = [];
    data = data || {};

    let encoded;
    for (const key in data) {
        encoded = key + '=' + encode(data[key]);
        query.push(encoded);
    }
    return query.join('&');
}
Ajax.send = function (options, data) { // options - object options || function callback 
    const defaultParams = {
        method: "POST",
        async: true,
        contentType: isObject(data) ? 'application/json' : 'application/x-www-form-urlencoded'
    };
    options = Object.assign(defaultParams, options);
    let url = options.url;

    if (data) {
        if (options.method == 'POST') {
            data = JSON.stringify(data);
        } else { // method == 'GET' 
            data = Ajax.prepareData(data);
            url = url + '?' + data;
        }
    }

    const xhr = new XMLHttpRequest();
    try {
        xhr.open(options.method.toUpperCase(), url, options.async);
    } catch (e) { return false; }

    xhr.onerror = function () {
        console.log('XMLHttpRequest fail');
        if (options.onFail) options.onFail();
    }
    xhr.setRequestHeader('Content-type', options.contentType);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = xhr.responseText;
            try { response = JSON.parse(response) }
            catch (e) { console.log(e); }
            options.onSuccess(response);
        }
    }

    xhr.send(data);
}

    ;
(() => {
    const data = {
        unitGroup: 'metric',
        key: 'CM36RZ78SK635VHT8PPDL9BM6',
        contentType: 'json',
    }
    const options = {
        url: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/norway',
        method: "GET",
        onSuccess: function (response) {
            console.log(response);
            if (!response || !response.days) return;
            let tpl;
            const resultBox = document.querySelector('.weather__fetch-result-box');
            resultBox.innerHTML = '';

            response.days.forEach(day => {
                tpl = document.createElement('div');
                tpl.innerHTML = `
                    <div>Date: ${day.datetime}</div>
                    <div>Temperature: ${day.temp}</div>
                    <div>Wind speed: ${day.windspeed}</div>
                    <img src="img/weather/${day.icon}.png" alt="Weather is ${day.icon}">`;
                resultBox.appendChild(tpl);
            });

            const params = {
                prefix: 'weather',
                countPanesInSlide: 4
            }
            Slider.init(resultBox, params);
        }
    }
    Ajax.send(options, data);

    var Slider = {};
    Slider.preventFastClicks = false;
    Slider.defaultOptions = {
        countPanesInSlide: 1,
    }
    Slider.options = function (box, options) {
        return _options(box, options, Slider.defaultOptions);
    };
    Slider.get = function (elem) {
        return elem.closest(".__slider__");
    };
    Slider.getCountPanesInSlide = function () {
        const screenWidth = clientWidth();
        return screenWidth > 992 ? 5 : (screenWidth > 768 ? 4 : (screenWidth > 480 ? 3 : 2));
    }
    Slider.nextPane = function (pane, options) {
        return nextSibling(pane) || pane.parentNode.querySelector('.' + options.prefix + '__slider-pane');
    }
    Slider.prevPane = function (pane, options) {
        const prev = prevSibling(pane);
        if (prev) return prev;
        const panes = pane.parentNode.querySelectorAll('.' + options.prefix + '__slider-pane');
        return panes[panes.length - 1];
    }
    Slider.nextSlide = function (evt) {
        const box = Slider.get(evt.target);
        let options = Slider.options(box);
        let startPaneNode = document.querySelector('.' + options.prefix + '__pane-visible-position0'); // start process from
        Slider.slide(startPaneNode, -options.countPanesInSlide, Slider.nextPane);
    }
    Slider.prevSlide = function (evt) {
        const box = Slider.get(evt.target);
        let options = Slider.options(box);
        let startPaneNode = document.querySelector('.' + options.prefix + '__pane-visible-position' + (options.countPanesInSlide - 1)); // start process from 
        Slider.slide(startPaneNode, options.countPanesInSlide * 2 - 1, Slider.prevPane);
    }
    Slider.slide = function (startPaneNode, startTranslateXvalue, handler) {
        if (Slider.preventFastClicks) return;
        Slider.preventFastClicks = true;

        const box = Slider.get(startPaneNode);
        let options = Slider.options(box);
        console.log( options );
        let stylesObject = { display: 'none', transition: 'none', transform: 'translateX(0)' };
        const countSlides = 3; // 3 - previous, current, next slides
        const totalProcessed = options.countPanesInSlide * countSlides;
        const panesCurrent = document.querySelectorAll('.' + options.prefix + '__pane-translated');
        let pane = startPaneNode; // start process from
        let direction = startTranslateXvalue < 0 ? +1 : -1;

        // reset to default styles
        panesCurrent.forEach(element => {
            setStyle(element, stylesObject);
        });

        for (let className, i = 0; i < options.countPanesInSlide; i++) {
            className = options.prefix + '__pane-visible-position' + i;
            document.querySelector('.' + className).classList.remove(className);
        }

        for (let i = 0; i < totalProcessed; i++) {
            if (startTranslateXvalue >= 0 && startTranslateXvalue < options.countPanesInSlide) {
                pane.classList.add(options.prefix + '__pane-visible-position' + startTranslateXvalue);
            }

            stylesObject = { display: 'block', transition: 'transform 1s', transform: 'translateX(' + (startTranslateXvalue * 100) + '%)' };
            setStyle(pane, stylesObject);
            pane.classList.add(options.prefix + '__pane-translated');
            pane = handler(pane, options);

            startTranslateXvalue = startTranslateXvalue + direction;
        }

        setTimeout(() => { Slider.preventFastClicks = false; }, 500);
    }
    Slider.init = function (box, options) {
        console.log( box );
        if (isInited(box)) return;

        options.prefix = options.prefix || 'slider-' + (+new Date());
        options.countPanesInSlide = options.countPanesInSlide || Slider.getCountPanesInSlide();

        Slider.options(box, options);
        box.classList.add(options.prefix + '__slider-box');
        box.classList.add('__slider__');

        const childs =  [...box.children];
        const childsLength = childs.length;
        childs.forEach((element, key)=> {
            element.classList.add(options.prefix + '__slider-pane');
            if(key < options.countPanesInSlide){
                className = options.prefix + '__pane-visible-position' + key;
                element.classList.add(className);
            }
        });
        Slider.nextSlide({target: box});
        Slider.prevSlide({target: box});

        Slider.preventFastClicks = false;
        const sliderBtnLeft = document.querySelector('.' + options.prefix + '__arrow_left');
        const sliderBtnRight = document.querySelector('.' + options.prefix + '__arrow_right');
        sliderBtnRight.addEventListener('click', Slider.nextSlide);
        sliderBtnLeft.addEventListener('click', Slider.prevSlide);

        console.log(Slider.options(box));
    };

})(); 