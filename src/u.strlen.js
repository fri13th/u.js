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
})($);
