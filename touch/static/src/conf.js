/* conf.js, (c) 2016 mawentao */
define(function(require){
    var ajax=require('ajax');
	// 插件配置
	var bigcfg;
	// 模板默认配置
	var config = {
		// 日志级别 0:关闭;>=1:WARN;>=2:INFO;>=3DEBUG;
	    loglevel: 3,
	    // 模板版本
	    version: '1.8.0',
		// 插件类型(0:未装插件,1:纯论坛版,2:门户版,3:广告版)
		plugin_type: 0,
        plugin_version: 0,
	    // 论坛版块的默认图标(板块未设置图标时,将用此图标)
	    default_forum_icon: dz.siteurl+'/template/bigstyle/touch/static/imgs/default_forum.png',
		// 版权信息
		copyright: 'Comsenz Inc.',
		// 客户端链接
		applink: 'http://www.discuz.net/mobile.php?platform=ios',
		// 热门版块
		hotforums: {
			source: 1,
			forums: []
		},
	    // 首页banner
	    banners: [
		    {
			    image: dz.siteurl+'/template/bigstyle/touch/static/imgs/banner01.jpg',
			    href: dz.siteurl
		    },{
			    image: dz.siteurl+'/template/bigstyle/touch/static/imgs/banner02.jpg',
			    href: dz.siteurl
		    },{
			    image: dz.siteurl+'/template/bigstyle/touch/static/imgs/banner03.jpg',
			    href: dz.siteurl
		    }
	    ],
		// 个人中心配置
		uclist: [
			{icon:'icon icon-log',iconcolor:'#029C01',title:'我的资料',href:'home.php?mod=space&do=profile&mobile=2'},
			'-',
			{icon:'icon icon-topic', iconcolor:'#D9534F', title:'我的帖子', href:'home.php?mod=space&do=thread&mobile=2'},
			{icon:'icon icon-favor', iconcolor:'#E85E0D', title:'我的收藏', href:'home.php?mod=space&do=favorite&mobile=2'},
			'-',
			{icon:'icon icon-setting', iconcolor:'#086EA2', title:'设置',href:'forum.php?setting=1&mobile=2'}
		],
		// 门户配置
		portal: {
			title: '新闻',
			default_pic: dz.siteurl+'/template/bigstyle/touch/static/imgs/default_pic.png',  //!< 默认文章封面
		},
		// 广告配置
		adapi: 'http://139.196.29.35:8888/api/bigstyle/getad'
	};

    var o={};
	o.get = function() {
		if (!bigstyle_api) return config;
		if (!bigcfg) {
			ajax.post2("config",{},function(res){
				if (res.data) {
					bigcfg = res.data;
					config.banners = bigcfg.banners;
					config.default_forum_icon = bigcfg.default_forum_icon;
					if (bigcfg.uclist) config.uclist=bigcfg.uclist;
					if (bigcfg.copyright) config.copyright=bigcfg.copyright;
					if (bigcfg.applink) config.applink=bigcfg.applink;
					if (bigcfg.hotforums) config.hotforums=bigcfg.hotforums;
					config.adapi = '';
					if (bigcfg.adapi) config.adapi=bigcfg.adapi;
					if (bigcfg.plugin_type) config.plugin_type=bigcfg.plugin_type;
					if (bigcfg.plugin_version) config.plugin_version=parseFloat(bigcfg.plugin_version);
					if (bigcfg.portal) {
						if (bigcfg.portal.title) config.portal.title=bigcfg.portal.title;
						if (bigcfg.portal.default_pic) config.portal.default_pic=bigcfg.portal.default_pic;
					}
				}
			},true);
		}
		return config;
	};
	return o;
});
