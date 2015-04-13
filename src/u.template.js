(function($){

    // precompile must be available
    // var data = {name: "fri13th", nick: "teru", list: ["abc", "def", "ghi"], obj: {title: "subtitle"}};
    // {{name}}, {{list[0]}}, {{obj.title}}
    // {{name|sanitize}} {{name|safe}} {{name|timestamp:YYMMDD}}
    // {% if name == "fri13th" %}<div> welcome, fri13th!</div>{% endif %}
    // {% foreach list as item %}<li>{{item}}</li>{% endfor %}


    $.tmpl = function tmpl(str){

        // we have to provide two thing, compile or render, source for printing precompiled function
        //var fn =
        //
        //    new Function("obj",
        //        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        //        "with(obj){p.push('" +
        //
        //        str
        //            .replace(/[\r\t\n]/g, " ")
        //            .split("{{").join("\t")
        //            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        //            .replace(/\t=(.*?)%>/g, "',$1,'")
        //            .split("\t").join("');")
        //            .split("}}").join("p.push('")
        //            .split("\r").join("\\'")
        //        + "');}return p.join('');");
        //fn.prototype.compile = fn;

        return fn;
    };
})($);