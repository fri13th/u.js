(function(){
    function $(sel, ctxt) {return USA.fn.init(sel, ctxt)}

    var ua = navigator.userAgent;
    var cssNumber = {'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1};

    function type(t, o){return $.type(o) == t}
    $.type = function (o) {
        if (o === null) return "null";
        var t = typeof o;
        if (t == "undefined") return "undefined";
        if (o instanceof USA) return "U";
        var n = o.nodeType, c = o.constructor;
        if (n && (n == o.ELEMENT_NODE || n == o.DOCUMENT_NODE)) return "dom";
        if (c === Array) return "array";
        if (c === RegExp) return "regexp";
        return t;
    };

    function qsa(el, sel){
        var m, d = type("dom", el);
        return (d && /^#([\w-]*)$/.test(sel)) ? ((m = el.getElementById(RegExp.$1)) ? [m] : []) : // array, not node list
               !d ? [sel] : [].slice.call(/^\.([\w-]+)$/.test(sel) ? el.getElementsByClassName(RegExp.$1) :
               /^[\w-]+$/.test(sel) ? el.getElementsByTagName(sel) :
               el.querySelectorAll(sel));
    }
    function frag(html) { // support only div
        html = html.trim().replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, "<$1></$2>");
        var el = document.createElement('div');
        el.innerHTML = '' + html;
        return [el.firstChild];
    }

    function camel(str){return str.replace(/-(.)?/g, function(_, c){ return c ? c.toUpperCase() : '' })}
    function dash(str) {return str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}
    function addPx(name, val) {return (type("number", val) && !cssNumber[dash(name)]) ? val + "px" : val}

    $.touch = "ontouchstart" in window;
    $.android = /Android/.test(ua);
    $.ios = /iPhone|iPad|iPod/.test(ua);
    $.legacy = $.android && parseInt(ua.slice(ua.indexOf("Android")+8)) < 3;
    $.retina = "devicePixelRatio" in window && window.devicePixelRatio > 1;
    $.frame = (top !== self);
    $.now = function(){return new Date().getTime()};
    $.inArray = function(el, arr, i) {return [].indexOf.call(arr, el, i)};
//    $.css = function (rule) {
//        var lastSheet = document.styleSheets[document.styleSheets.length - 1];
//        lastSheet.insertRule(rule, lastSheet.cssRules.length);
//    };
    $.local = /^[\d\.:]*$|localhost/.test(location.host);
    $.extend = function() {
        var base = arguments[0];
        for (var i = 1; i < arguments.length; i++){
            var sub = arguments[i];
            for(var j in sub) base[j] = sub[j];
        }
        return base;
    };

    function USA(doms) {
        this.length = 0;
        [].push.apply(this, doms);
    }

    USA.prototype = USA.fn = $.fn = {
        init: function (sel,  ctxt) {
            var st = $.type(sel), ct = $.type(ctxt);
            ctxt = (ct == "U")   ? ctxt[0]:
                   (ct == "dom") ? ctxt : document;
            return (st == "string")  ? new USA(/^\s*<(\w+|!)[^>]*>/.test(sel) ? frag(sel) : qsa(ctxt, sel)):
                   (st == "dom")     ? new USA([sel]):
                   (st == "U")       ? sel:
                   (st == "function")? $(document).ready(sel):
                                       this;
        },
        ready: function (handler) {
            if (/complete|loaded|interactive/.test(document.readyState)) handler(this);
            else document.addEventListener('DOMContentLoaded', function() {handler(this)});
            return this;
        },
        exists: function(){return this.length > 0},
        each: function (handler) {
            [].every.call(this, function(el, idx){
                return handler.call(el, idx, el) !== false
            });
        },
        grep: function(handler) {return [].filter.call(this, handler)},
        map: function(handler) {return [].map.call(this, handler)},
        reduce: function(handler) {return [].reduce.call(this, handler)},
        text: function (text) {
            return text === undefined ?
                (this.length == 0 ? null :
                    this.length == 1 ? this[0].innerText :
                        this.reduce(function(prev, dom){return (type("string", prev) ? prev : prev.innerText) + dom.innerText})) :
                this.each(function(){this.textContent = text});
        },
        html: function (html) {
            return html === undefined ?
                (this.length > 0 ? this[0].innerHTML : null) :
                this.each(function(){this.innerHTML = html})
        },
        on: function (events, func) {
            this.each(function(idx, el){
                events.split(/\s/).forEach(function(event){
                    el.addEventListener(event, func);
                })
            });
            return this;
        },
        off: function (events, func) {
            this.each(function(idx, el){
                events.split(/\s/).forEach(function(event){
                    el.removeEventListener(event, func);
                })
            });
            return this;
        },
        trigger: function(name) {
            this.each(function(idx, el){
                el.dispatchEvent(new Event(name));
            });
            return this;
        },
        get: function (no) {return (no === undefined)? this : (no < 0) ? this[this.length + no] : this[no]},
        find: function (sel) {
            return new USA((this.length == 1) ? qsa(this[0], sel) : this.reduce(function(prev, dom){return prev.concat(qsa(dom, sel))}, []));
        },
        attr: function(name, val){ // this is not good implemented
            return (val === undefined && this.length > 0) ? this[0].getAttribute(name):
                this.each(function(){
                    if (type("dom", this)) this.setAttribute(name, val);
                });
        },
        prop: function(name, val){
            return (val === undefined) ? this[0][name]:
                this.each(function(){
                    if (type("dom", this)) this[name] = val;
                });
        },
        css: function (prop, val) {
            var s = type("string", prop);
            if (val === undefined && s) return this[0].style[camel(prop)] || getComputedStyle(this[0], '').getPropertyValue(prop);

            var css = '', key = null, obj = {}, dashed = "";
            if (s) obj[prop] = val;
            else obj = prop;
            for (key in obj){
                val = obj[key];
                dashed = dash(key);
                if (!val && val !== 0) this.each(function(){ this.style.removeProperty(dashed) });
                else css += dashed + ':' + addPx(key, val) + ';';
            }

            this.each(function(){this.style.cssText += ';' + css});
            return this;
        },
        wrap: function (html) {
            this.each(function(idx, el){
                var $html = (html instanceof USA) ? html : type("function", html) ? $(html.call(idx, el)) : $(html);
                $(el).before($html);
                $html[0].appendChild(el)
            })
        },
        wrapAll: this.wrap,
        append: function (frag) {this.insert(frag, 0);},
        prepend: function (frag) {this.insert(frag, 1);},
        before: function (frag) {this.insert(frag, 2);},
        after: function (frag) {this.insert(frag, 3);},
        insert:function (frag, no) {
            var dom = type("string", frag) ? $(frag)[0]:frag[0];
            this.each(function(idx, el) {
                var node = (no < 2 ) ? el : el.parentNode;
                var pos = [null, el.firstChild, el, el.nextSibling][no];
                node.insertBefore(dom, pos);
            });
        },
        addClass: function(name) {
            this.each(function(idx, el) {el.classList.add(name)});
            return this;
        },
        removeClass: function(name) {
            this.each(function(idx, el) {el.classList.remove(name)});
            return this;
        },
        toggleClass: function(name, mode) {
            this.each(function(idx, el) {el.classList.toggle(name)});
            return this;
        },
        empty: function() {this.html(null)},
        remove: function() {this.each(function(idx, el){el.parentNode.removeChild(el)})},
        parent: function() {var t = this[0], p = t && t.parentNode; return p && $(p)},
        show: function() {this.css("display", "")},
        hide: function() {this.css("display", "none")} // width, height, opacity changed..
    };

    window.U = $;
})();

(function($){
    $.preload = function(images, callback) {
        var objs = [];
        for(var i = 0; i < images.length; i++) {
            var obj = new Image();
            obj.src = images[i];
            objs[i] = obj;
        }
        var retryCount = 10;
        function isLoaded (img) {
            if (!img.complete) return false;
            return !(typeof img.naturalWidth != "undefined" && img.naturalWidth == 0);
        }
        function check() {
            for (var i = 0; i < objs.length; i++) {
                if (!isLoaded(objs[i])) {
                    retryCount--;
                    if (retryCount > 0) {
                        setTimeout(check(), 500);
                        return;
                    }
                }
            }
            callback();
        }
        check();
    };

})(window.U);

(function($){
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(m){return setTimeout(m, 1000/60)};
    var ease = {
        'linear'            : [0,0,1,1],
        'ease'              : [.25,.1,.25,1],
        'easeIn'            : [.42,0,1,1],
        'easeOut'           : [0,0,.58,1],
        'easeInOut'         : [.42,0,.58,1],
        'easeInCubic'       : [.55,.055,.675,.19],
        'easeOutCubic'      : [.215,.61,.355,1],
        'easeInOutCubic'    : [.645,.045,.355,1],
        'easeInCirc'        : [.6,.04,.98,.335],
        'easeOutCirc'       : [.075,.82,.165,1],
        'easeInOutCirc'     : [.785,.135,.15,.86],
        'easeInExpo'        : [.95,.05,.795,.035],
        'easeOutExpo'       : [.19,1,.22,1],
        'easeInOutExpo'     : [1,0,0,1],
        'easeInQuad'        : [.55,.085,.68,.53],
        'easeOutQuad'       : [.25,.46,.45,.94],
        'easeInOutQuad'     : [.455,.03,.515,.955],
        'easeInQuart'       : [.895,.03,.685,.22],
        'easeOutQuart'      : [.165,.84,.44,1],
        'easeInOutQuart'    : [.77,0,.175,1],
        'easeInQuint'       : [.755,.05,.855,.06],
        'easeOutQuint'      : [.23,1,.32,1],
        'easeInOutQuint'    : [.86,0,.07,1],
        'easeInSine'        : [.47,0,.745,.715],
        'easeOutSine'       : [.39,.575,.565,1],
        'easeInOutSine'     : [.445,.05,.55,.95],
        'easeInBack'        : [.6,-.28,.735,.045],
        'easeOutBack'       : [.175, .885,.32,1.275],
        'easeInOutBack'     : [.68,-.55,.265,1.55],
        'easeInElastic'     : [0,0,1,1],
        'easeOutElastic'    : [0,0,1,1],
        'easeInOutElastic'  : [0,0,1,1],
        'easeInBounce'      : [0,0,1,1],
        'easeOutBounce'     : [0,0,1,1],
        'easeInOutBounce'   : [0,0,1,1]
    };
    $.cubic = function(m){return "cubic-bezier("+ease[m].map(function(i){return(i<0)?0:(i>1)?1:i}).join(",")+")"};

    function cubic(easing){
        var e = 0.01, a = ease[easing], x1=a[0], y1=a[1], x2=a[2], y2=a[3];
        function curveX(t){var v = 1 - t; return 3*v*v*t*x1 + 3*v*t*t*x2 + t*t*t;}
        function curveY(t){var v = 1 - t; return 3*v*v*t*y1 + 3*v*t*t*y2 + t*t*t;}
        function derivativeCurveX(t){var v = 1 - t; return 3*(2*(t-1)*t+v*v)*x1 + 3*(-t*t*t + 2*v*t)*x2;}
        return function(t){
            var t0, t1, t2, x2, d2, i;
            for (t2 = t, i = 0; i < 8; i++){
                x2 = curveX(t2) - t;
                if (Math.abs(x2) < e) return curveY(t2);
                d2 = derivativeCurveX(t2);
                if (Math.abs(d2) < e) break;
                t2 = t2 - x2 / d2;
            }
            t0 = 0; t1 = 1; t2 = t;
            if (t2 < t0) return curveY(t0);
            if (t2 > t1) return curveY(t1);
            while (t0 < t1){
                x2 = curveX(t2);
                if (Math.abs(x2 - t) < e) return curveY(t2);
                if (t > x2) t0 = t2;
                else t1 = t2;
                t2 = (t1 - t0)*.5 + t0;
            }
            return curveY(t2);
        };
    }
    function easeInBounce(t, b, c, d) {return c - easeOutBounce(d-t, 0, c, d) + b}
    function easeOutBounce (t, b, c, d) {
        if ((t/=d) < (1/2.75)) return c*(7.5625*t*t) + b;
        else if (t < (2/2.75)) return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        else if (t < (2.5/2.75)) return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        else return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
    function easeInElastic(t, b, c, d) {
        var s=1.70158, p= 0, a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }
    function easeOutElastic(t, b, c, d) {
        var s=1.70158, p= 0, a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }
    function easeInOutElastic(t, b, c, d) {
        var s=1.70158, p= 0, a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    }

    $.ease = function(options) { // we need options extend
        function easing(){
            var t = $.now() - settings.startTime,
                b = settings.begin,
                c = settings.end - settings.begin,
                d = settings.duration;

            settings.finished = (t > d);
            switch(settings.easing) {
                case "linear":
                    return c*t/d + b;
                case "easeInElastic":
                    return easeInElastic(t, b, c, d);
                case "easeOutElastic":
                    return easeOutElastic(t, b, c, d);
                case "easeInOutElastic":
                    return easeInOutElastic(t, b, c, d);
                case "easeInBounce":
                    return easeInBounce(t, b, c, d);
                case "easeOutBounce":
                    return easeOutBounce(t, b, c, d);
                case "easeInOutBounce":
                    if (t < d/2) return easeInBounce (t*2, 0, c, d) * .5 + b;
                    return easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
                default:
                    return b + cubic(settings.easing)(t/d)*c;
            }
        }

        function run() {
            settings.ani(easing(), settings.options);
            settings.finished ? settings.finish() : !settings.stop ? requestAnimationFrame(run, settings.options) : null;
        }

        var defaults = {startTime: $.now(), stopTime: 0, duration: 500, begin:0, end:0, finished: false, easing: "linear", stop: false, ani:function(e,o){}, finish:function(){}, options:{}};
        var settings = $.extend({}, defaults, options);
        run();

        return {
            stop : function(){settings.stop = true; settings.stopTime = $.now() - settings.startTime},
            resume : function(){settings.stop = false; settings.startTime = $.now() - settings.stopTime; run()}
        };
    };
})(window.U);

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

})(window.U);
(function($){
    //http://www.geocities.jp/scs00046/pages/2006112701.html
    $.strlen = function(str) {
        var len = 0, i;
        for (i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            len += ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) ? 1 : 2;
        }
        return len;
    }
})(window.U);

(function ($) {
    $.cookie = {
        set: function (key, value, days) {
            if (!days) days = 365;
            var d = new Date();
            d.setTime(d.getTime() + (days*24*60*60*1000));
            document.cookie = key + "=" + value + "; expires=" + d.toUTCString() + "; path=/";
        },
        get: function (key) {
            var val = document.cookie.match(new RegExp("(;?\\s?)" + key + "=(.*?)(;|$)"));
            return (val) ? val[2] : null;
        },
        remove: function (key) {
            this.set(key,"",-1);
        }
    };
})(window.U);


if (!window.$) window.$ = window.U;

function init() {
    if(!$.local && console && console.log) console.log = function(){};
    if ($.touch) setTimeout(function(){window.scrollTo(0, 1)}, 500);
    if ($.legacy || !$.retina) $("body").addClass("non-retina");
    if ($.android && ($.frame || !$.legacy)) {
        function zoom() {document.body.style.zoom = window.innerWidth/320}
        $(window).on("orientationchange",zoom);
        zoom();
    }
}
