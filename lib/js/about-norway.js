function encode(val) {
    return encodeURIComponent(val);
};
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
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
            const resultBox = document.querySelector('.about-norway__weather-result-box');

            response.days.forEach(day => {
                tpl = document.createElement('div');
                tpl.innerHTML = `
                    <div>Date: ${day.datetime}</div>
                    <div>Temperature: ${day.temp}</div>
                    <div>Wind speed: ${day.windspeed}</div>
                    <img src="img/weather/${day.icon}.png" alt="Weather is  ${day.icon}">`; 
                resultBox.appendChild(tpl);
            });
        }
    } 
    Ajax.send(options, data);
})(); 