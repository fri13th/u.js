(function ($) {
    "use strict";

    var el = {},
        data = {},
        env = {},
        common = {
            windowWidth: 0
        };

    { // init
        el.$window = $(window);
        common.width = el.$window.width();
    }

    var stepCtrl = (function() {
        function resize () {
            console.log("step resize");
        }
    })();

    var accCtrl = (function() {
        var abc;

        { // init
            var def = "abc";
            el.acc = {};
            el.acc.$box = $(".box");
        }

        { // event
            el.acc.$box.on("click", ".btn", function(){
                console.log("def abc" + def);
                console.log("button clicked");
            });
        }

        // private funcion

        // public function
        function resize () {
            console.log("acc resize");
        }

        return {
            resize: resize
        };
    })();

    var commonCtrl = (function() {
        function resize() {
            common.width = el.$window.width();
            stepCtrl.resize();
            accCtrl.resize();
        }

        $(window).on("resize", resize);
    })();


})($ || {});
