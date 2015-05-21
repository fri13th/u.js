(function($){

    // precompile must be available
    // var data = {name: "fri13th", nick: "teru", list: ["abc", "def", "ghi"], obj: {title: "subtitle"}};
    // {{this.name}}, {{this.list[0]}}, {{obj.title}}
    // {{name|sanitize}} {{name|safe}} {{name|timestamp:YYMMDD}}
    // {% if (name == "fri13th") { %}<div> welcome, fri13th!</div>{% } %}
    // {% if name == "fri13th" %}<div> welcome, fri13th!</div>{% endif %}
    // {% foreach list as item %}<li>{{item}}</li>{% endfor %}
    // below 5k


    // underscore is right way
    // look hogan



    // add eval and work..
    //
    $.tmpl = function tmpl(str){

        var src = "source";
        var fn = new Function(src);



        // compile and execute
        //var newfn = fn.bind(txt); newfn();
        // use bind for attach variables to this
        fn.prototype.source = "source";
        // generate by source
        fn.prototype.compile = function(data) {};




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