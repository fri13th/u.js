// preload images for smooth animation
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
            var nw = img.naturalWidth;
            return $.type(nw) != "undefined" || nw != 0;
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
})($);
