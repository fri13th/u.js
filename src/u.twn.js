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
        ani: function(options) { // we need options extend
            var defaults = {startTime: $.now(), stopTime: 0, duration: 500, begin:0, end:1, finished: false, easing: "linear", stop: false, run:function(e,o){}, finish:function(){}, options:{}};
            var settings = $.extend({}, defaults, options);

            function easing(){
                var t = $.now() - settings.startTime,
                    b = settings.begin,
                    c = settings.end - settings.begin,
                    d = settings.duration;
                settings.finished = (t > d);
                return b + $.ease[settings.easing](t/d)*c;
            }
            function run() {
                settings.run(easing(), settings.options);
                settings.finished ? settings.finish() : !settings.stop ? requestAnimationFrame(run) : null;
            }
            run();
            return {
                stop : function(){settings.stop = true; settings.stopTime = $.now() - settings.startTime},
                resume : function(){settings.stop = false; settings.startTime = $.now() - settings.stopTime; run()}
            };
        }
    }
})($ || {});

/* sample
$.twn.ani({duration:500, begin: 0, end: 300, easing: "easeOutQuart", run: function(easing, options){
    $("#element").css("left", easing);
}, finish: function(options){}});
*/