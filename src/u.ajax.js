
(function($){
    $.fn.serialize = function() {
        var form = this[0];
        if (!form || form.nodeName !== "FORM") return null;
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            var e= form.elements[i], n = e.name, o = e.nodeName, v = e.value, s = n + "=" + encodeURIComponent(v), t = e.type, c = e.checked;
            if (n === "") continue;
            if (o == "TEXTAREA" || o == "BUTTON") q.push(s);
            if (o == "INPUT" && (!(t == "checkbox" || t == "radio") || c)) q.push(s);
            if (o == "SELECT") {
                if (t == "select-one") q.push(s);
                else for (j = e.options.length - 1; j >= 0; j = j - 1) if (e.options[j].selected) q.push(n + "=" + encodeURIComponent(e.options[j].value));
            }
        }
        return q.join("&");
    };

    var defaults = {
        url: "",
        username: null,
        password: null,
        type: "GET",
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: null,
        cache: true,
        dataType: null,
        crossDomain: false,
        timeout : 30000
    };

    $.ajax= function(options) {
        var settings = $.extend({}, defaults, options);
        var xhr = new XMLHttpRequest();
        if (!settings.cache) {
            xhr.setRequestHeader("Cache-Control", "no-cache");
            settings.url += ((settings.url.indexOf("?") > -1) ? "&" : "?") + "_=" + $.now();
        }
        xhr.open(settings.type, settings.url, settings.async, settings.username, settings.password);
        xhr.setRequestHeader("Content-type", settings.contentType);
        var timer = setTimeout(function() {xhr.abort();}, settings.timeout);

        function handler () {
            if (xhr.readyState == 4) {
                clearTimeout(timer);
                var contentType = xhr.getResponseHeader("Content-Type");
                var status = xhr.status;
                var text = xhr.responseText;
                var result  = (contentType.indexOf("xml") > -1) ? xhr.responseXML :
                    (contentType.indexOf("json") > -1 || (settings.dataType == "json")) ? JSON.parse(text) :
                        (settings.dataType == "html") ? $(text)[0] :
                            (settings.dataType == "jsonp") ? eval("("+text+")"): text;

                if (settings.complete) settings.complete(xhr);
                if (status == 200 || status === 304) {
                    if (settings.dataType == "script") $("<script>" + text + "</script>").append(document.body);
                    else if(settings.success) settings.success(result);
                }
                else if (settings.error) settings.error();
            }
        }
        xhr.onreadystatechange = handler;
        if (settings.error) xhr.onerror = settings.error;
        xhr.send(settings.data);
    };
})($);