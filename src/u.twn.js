/* micro animation framework */
(function($){
    $.now = function(){return new Date().getTime()};
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(m){return setTimeout(m, 1000/60)};
    $.ease = {
        linear: function (t) { return t },
        easeInQuad: function (t) { return t*t },
        easeOutQuad: function (t) { return t*(2-t) },
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        easeInCubic: function (t) { return t*t*t },
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        easeInQuart: function (t) { return t*t*t*t },
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        easeInQuint: function (t) { return t*t*t*t*t },
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    };
    $.twn = {
        ani: function(options) {
            var defaults = {duration: 500, begin:0, end:1, delay: 0, easing: "linear", run: function(easing, options){}, finish: function(){}, options: {}};
            var settings = $.extend({}, defaults, options);
            var startTime = $.now(), stopTime = 0, stop = false, finished = false,
                b = settings.begin,
                c = settings.end - settings.begin,
                d = settings.duration;

            function easing() {
                var t = $.now() - startTime;
                finished = (t > d);
                return b + $.ease[settings.easing](t/d)*c;
            }
            function run() {
                settings.run(easing(), settings.options);
                finished ? settings.finish() : !stop ? requestAnimationFrame(run) : null;
            }
            (settings.delay) ? setTimeout(function(){startTime = $.now(); run();}, settings.delay) : run();

            return {
                stop : function(){stop = true; stopTime = $.now() - startTime},
                resume : function(){stop = false; startTime = $.now() - stopTime; run()}
            };
        }
    }
})($ || {});

/* sample
$.twn.ani({duration:500, begin: 0, end: 300, easing: "easeOutQuart", run: function(easing, options){
    $("#element").css("left", easing);
}, finish: function(options){}});
*/