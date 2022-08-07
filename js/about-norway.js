function encode(val) {
    return encodeURIComponent(val);
};
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isFunction(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Function]';
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function clientWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
function clientHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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

(function (w) {
    // onElementResize

    let attachEvent = document.attachEvent;
    const requestFrame = (function () {
        const raf = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame || function (fn) { return w.setTimeout(fn, 66); };
        return function (fn) { return raf(fn); };
    })();
    const cancelFrame = (function () {
        const cancel = w.cancelAnimationFrame || w.mozCancelAnimationFrame || w.webkitCancelAnimationFrame || w.clearTimeout;
        return function (id) { return cancel(id); };
    })();
    function resizeListener(evt) {
        let target = evt.target;
        if (target.__resizeRAF__) cancelFrame(target.__resizeRAF__);
        target.__resizeRAF__ = requestFrame(function () {
            const trigger = target.__resizeTrigger__;
            trigger.__resizeListeners__.forEach(function (fn) {
                fn.call(trigger);
            });
        });
    }
    function objectLoad() {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }

    w.addResizeEvent = function (element, fn) {
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];
            //}
            //if (!element.__resizeListeners__) {
            if (attachEvent) {
                element.__resizeTrigger__ = element;
                element.attachEvent('onresize', resizeListener);
            } else {
                let obj = element.__resizeTrigger__ = document.createElement('object');
                setStyle(obj, { position: 'absolute', display: 'block', top: 0, left: 0, height: '100%', width: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 });
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                obj.data = 'about:blank';
                element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    };
    w.removeResizeEvent = function (element, fn) {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            if (attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    }
})(window);

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

function isInitialized(el, name) {
    return data(el, name || '__INITED__');
}

function extend() {
    const a = arguments, len = a.length;
    let args, i = 1, deep = false, target = a[0] || {};

    if (typeof target === 'boolean') {
        deep = target;
        target = a[1] || {};
        i = 2;
    }

    if (!isObject(target) && !isFunction(target)) target = {};
    for (; i < len; ++i) {
        if ((args = a[i]) != null) {
            for (const name in args) {
                const src = target[name], copy = args[name];
                if (target === copy) continue;
                if (deep && copy && isObject(copy) && !copy.nodeType) {
                    target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
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
        || data(box, paramName, extend({}, defaultParams || {})); // assign default params

    if (extendParams) {
        options = data(box, paramName, extend(true, {}, options, extendParams));
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

            //const resultBox = document.querySelector('.weather__fetch-result-box');
            const countPanesInSlide = function () {
                const screenWidth = clientWidth();
                return screenWidth > 991 ? 5 : (screenWidth > 767 ? 4 : (screenWidth > 559 ? 3 : 2));
            }
            const params = {
                prefix: 'weather',
                countPanesInSlide: countPanesInSlide(),
                onResize: function () {
                    const options = this.options();
                    const newCountPanesInSlide = countPanesInSlide();

                    if (newCountPanesInSlide !== options.countPanesInSlide) {
                        console.log(options);
                        this.options({ countPanesInSlide: newCountPanesInSlide });
                        this.init(options);
                    }
                }
            }

            new Slider(resultBox, params);
        }
    }
    Ajax.send(options, data);

    class Slider {
        constructor(box, options) {
            if (!Slider._instance) Slider._instance = this;
            this.container = box;
            this.preventFastClicks = false;
            this.defaultOptions = {
                countPanesInSlide: 1,
            }
            options.prefix = options.prefix || 'slider-' + (+new Date());
            this.options(options);
            this.init(options);

            return Slider._instance;
        }

        options(options) {
            const box = this.container;
            return _options(box, options, this.defaultOptions);
        }

        nextPane(pane, options) {
            return nextSibling(pane) || pane.parentNode.querySelector('.' + options.prefix + '__slider-pane');
        }

        prevPane(pane, options) {
            const prev = prevSibling(pane);
            if (prev) return prev;
            const panes = pane.parentNode.querySelectorAll('.' + options.prefix + '__slider-pane');
            return panes[panes.length - 1];
        }

        nextSlide() {
            const options = this.options();
            const className = '.' + options.prefix + '__pane-visible-position0';
            let startPaneNode = document.querySelector(className); // start process from 
            this.slide(startPaneNode, -options.countPanesInSlide, this.nextPane);
        }

        prevSlide() {
            const options = this.options();
            const className = '.' + options.prefix + '__pane-visible-position' + (options.countPanesInSlide - 1);
            let startPaneNode = document.querySelector(className); // start process from 
            this.slide(startPaneNode, options.countPanesInSlide * 2 - 1, this.prevPane);
        }

        resetStyles() {
            let stylesObject = { display: 'none', transition: 'none', transform: 'translateX(0)', zIndex: 0 };
            const childs = [...this.container.children];
            childs.forEach((pane) => {
                setStyle(pane, stylesObject);
            });
            return stylesObject;
        }

        slide(startPaneNode, startTranslateXvalue, handler) {
            if (this.preventFastClicks) return;
            this.preventFastClicks = true;
            setTimeout(() => { this.preventFastClicks = false; }, 500);

            const options = this.options();
            const countPanesInSlide = options.countPanesInSlide;
            const countSlides = 3; // 3 - previous, current, next slides
            const totalProcessed = countPanesInSlide * countSlides;
            const direction = startTranslateXvalue < 0 ? +1 : -1;
            let pane = startPaneNode; // start process from 
            let stylesObject = this.resetStyles();

            for (let i = 0; i < totalProcessed; i++) {
                let className = options.prefix + '__pane-visible-position' + i;
                let element = document.querySelector('.' + className);
                if (!element) {
                    break;
                } else {
                    element.classList.remove(className);
                }
            }

            for (let i = 0; i < totalProcessed; i++) {
                stylesObject = { display: 'block', zIndex: 1, transition: 'transform 1s', transform: 'translateX(' + (startTranslateXvalue * 100) + '%)' };
                if (startTranslateXvalue >= 0 && startTranslateXvalue < countPanesInSlide) {
                    pane.classList.add(options.prefix + '__pane-visible-position' + startTranslateXvalue);
                    stylesObject.zIndex = 2;
                } else if (i < countPanesInSlide) {
                    stylesObject.zIndex = 2;
                }

                setStyle(pane, stylesObject);
                pane = handler(pane, options);

                startTranslateXvalue = startTranslateXvalue + direction;
            }
        }

        addEventListeners(options) {
            const sliderBtnLeft = document.querySelector('.' + options.prefix + '__arrow_left');
            const sliderBtnRight = document.querySelector('.' + options.prefix + '__arrow_right');
            sliderBtnRight.addEventListener('click', this.nextSlide.bind(this));
            sliderBtnLeft.addEventListener('click', this.prevSlide.bind(this));
            if (options.onResize) {
                addResizeEvent(this.container.parentNode, options.onResize.bind(this));
            }
        }

        init(options) {
            const box = this.container;
            box.classList.add(options.prefix + '__slider-box');
            box.classList.add('__slider__');

            this.resetStyles();

            const childs = [...box.children];
            childs.forEach((pane, key) => {
                pane.className = '';
                pane.classList.add(options.prefix + '__slider-pane');
                if (key < options.countPanesInSlide) {
                    let className = options.prefix + '__pane-visible-position' + key;
                    pane.classList.add(className);
                }
            });

            this.nextSlide();
            this.preventFastClicks = false;
            this.prevSlide();

            this.preventFastClicks = false;
            this.addEventListeners(options)
        }
    };
})(); 
