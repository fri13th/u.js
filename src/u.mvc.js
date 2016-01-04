
(function ($) {
    $.mvc = (function() {
        "use strict";

        var $root = null,
            model = {},
            event = {},
            template = null,
            compiled = null,
            el = {},
            env = {
                windowWidth: 0
            };

        var initCtrl = (function() {
            el.$window = $(window);
            env.width = el.$window.width();
        })();

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

        var globalCtrl = (function() {
            function resize() {
                env.width = el.$window.width();
                stepCtrl.resize();
                accCtrl.resize();
            }

            $(window).on("resize", resize);
        })();




        function init(options) {
            $root = $(options.root);
            event = options.events;
            template = $(options.template).html();

            for (var e in events) {
                var es = e.split(" ");
                if (es.length > 1) $root.on(es[0], es[1], events[e]);
                else $root.on(e, events[e]);
            }
            if (options.model) {
                update(options.model);
            }

        }
        function update(newModel) {
            model = newModel;
            compiled = $.tmpl(template, model);
            $root.empty().append(compiled);
        }

        return {
            init: init,
            update: update
        }

    })();

})($);