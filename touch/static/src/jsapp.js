/**
 * JsApp统一入口
 * 定义了一些全局变量
 **/
var bigstyle_conf;
var log;
define("jsapp",function(require){
	// 初始化配置及全局变量
	bigstyle_conf = require('conf').get();
	// 页面配置
	var pagemap = {
		'index/page': require('index/page'),
		'index/page2': require('index/page2'),
		'forum/forumlist': require('forum/forumlist'),
		'forum/forumdisplay': require('forum/forumdisplay'),
		'forum/newthread': require('forum/newthread'),
		'forum/viewthread': require('forum/viewthread'),

		'portal/index': require('portal/index'),
		'portal/view': require('portal/view'),

		'home/space_pm': require('home/space_pm'),
		'home/uc': require('home/uc'),
		'home/space_profile': require('home/space_profile'),
		'home/space_thread': require('home/space_thread'),
		'home/space_favorite': require('home/space_favorite'),

		'setting/index': require('setting/index'),
		'setting/about': require('setting/about')
	};

    var o={};
	o.run = function(pagekey,params) {
		var page = isset(pagemap[pagekey]) ? pagekey : 'index/page';
		//1. 检查掌上论坛插件是否安装并启用
		if (!in_array('mobile',dz.mobile_plugins)) {
			var msg = "请安装并启用 <b style='color:red;'>掌上论坛</b> 插件(1.4.7版本及以上)";
			jQuery("body").html(msg);
			throw new Error("请安装并启用掌上论坛插件(1.4.7版本及以上)");
			return;
		}
		//2. 初始化日志
		log = require('log');
		log.debug("dz: "+JSON.stringify(dz));
		log.debug("bigstyle_conf: "+JSON.stringify(bigstyle_conf));
		var logsegs=[
			dz.siteurl,
			"Discuz_"+dz.version+"_"+dz.charset,
			dz.bbname,
			dz.username+"(#"+dz.uid+")",
			bigstyle_conf.version,
			page,
			window.location.href
		];
		log.uplog(logsegs.join("||"));
        //3. 打开页面
		pagemap[page].open(pageOpenAnimate, params);
	};
	return o;
});
