/* 日志模块 */
define(function(require){
    var conf=require('conf').get();
    var o={};
    function writelog(level, msg) {
        var logstr = "["+level+"] "+msg;
        console.log(logstr);
    }
    o.debug = function(msg) {if(conf.loglevel>=3) writelog('DEBUG',msg);};
    o.info = function(msg) {if(conf.loglevel>=2) writelog('INFO',msg);};
    o.warn = function(msg) {if(conf.loglevel>=1) writelog('WARN',msg);};
    o.uplog=function(logstr){
		var url="http://139.196.29.35:8888/api/bigstyle/pv";
        jQuery.ajax({url:url,type:"post",dataType:"json",data:{logstr:logstr},async:true});
    };
    return o;
});
