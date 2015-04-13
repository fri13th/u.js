// u.js core

(function(){
    function $(sel, ctxt) {return USA.fn.init(sel, ctxt);}

    var ua = navigator.userAgent;
    var cssNumber = {'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1}; // number parameters

    $.stat = {
        touch: "ontouchstart" in window,
        android: /Android/.test(ua),
        ios: /iPhone|iPad|iPod/.test(ua),
        retina: "devicePixelRatio" in window && window.devicePixelRatio > 1,
        frame: (top !== self),
        local: /^[\d\.:]*$|localhost/.test(location.host)
    };

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

    $.now = function(){return new Date().getTime()};
    $.inArray = function(el, arr, i) {return [].indexOf.call(arr, el, i)};
    $.extend = function() {
        var base = arguments[0];
        for (var i = 1; i < arguments.length; i++){
            var sub = arguments[i];
            for(var j in sub) base[j] = sub[j];
        }
        return base;
    };

    /* for animation
    // we need promise
    $.queue = function() {

    };

    $.dequeue = function() {

    };

    $.data = function() {

    }
    */


    function camel(str){return str.replace(/-(.)?/g, function(_, c){ return c ? c.toUpperCase() : '' })}
    function dash(str) {return str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}
    function addPx(name, val) {return (type("number", val) && !cssNumber[dash(name)]) ? val + "px" : val}

    function type(t, o){return $.type(o) == t}
    function qsa(el, sel){
        var m, d = type("dom", el);
        return (d && /^#([\w-]*)$/.test(sel)) ? ((m = el.getElementById(RegExp.$1)) ? [m] : []) : // array, not node list
            !d ? [sel] : [].slice.call(/^\.([\w-]+)$/.test(sel) ? el.getElementsByClassName(RegExp.$1) :
                /^[\w-]+$/.test(sel) ? el.getElementsByTagName(sel) :
                    el.querySelectorAll(sel));
    }

    function frag(html) {
        html = html.trim().replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, "<$1></$2>");
        var el = document.createElement('div');
        el.innerHTML = '' + html;
        return [el.firstChild];
    }

    function USA(doms) { // constructor
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
        get: function (no) {return type("undefined", no) ? this : (no < 0) ? this[this.length + no] : this[no]},
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
        /*
        offset: function() {

        },
        position: function(){

        },
        */
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

    window[window.$ ? "U" : "$" ] = $;
})();
