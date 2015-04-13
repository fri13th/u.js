// we need animation queue, and multiple values and fix animation
(function($){

    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(m){return setTimeout(m, 1000/60)};
    var ease = { // this has some bug. need to use more calculative one
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
    //$.cubic = function(m){return "cubic-bezier("+ease[m].map(function(i){return(i<0)?0:(i>1)?1:i}).join(",")+")"};

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
})($ || U);