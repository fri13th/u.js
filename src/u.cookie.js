
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
})($);