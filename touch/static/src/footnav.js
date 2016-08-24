FootNav = function(list) {
	var navlist = [
	    {icon:'icon icon-home',title:'首页',href:"forum.php?mobile=2"},
	    {icon:'icon icon-topic',title:'论坛',href:"forum.php?forumlist=1&mobile=2"},
	    {icon:'icon icon-ask',title:'发帖',href:"forum.php?newthread=1&mobile=2"},
	    {icon:'icon icon-comment',title:'消息',href:"home.php?mod=space&do=pm&mobile=2"},
	    {icon:'icon icon-user',title:'我的',href:"forum.php?uc=1&mobile=2"}
	];	
	if (list) {
		navlist = list;
	}


	function dom(id) {return document.getElementById(id);}
	
	// 根据当前url自动匹配active的元素序号
	function getActiveIdx() {
		var ids = -1;
		var len = 0;
		var url = window.location.href;
		for (var i=0;i<navlist.length;++i) {
			var im=navlist[i];
			var k = url.toLowerCase().indexOf(im.href.toLowerCase());
			if (k>=0 && im.href.length>=len) {
				ids = i;
				len = im.href.length;
			}
		}
		return ids;
	}

	// 初始化底部导航菜单
    this.init = function() {
		if (!navlist || navlist.length==0) {
			return;
		}
		var code = '<div class="mwt-h5bar footnav mwt-border-top" style="bottom:0;height:45px;z-index:1;position:fixed;background:#fff;">'+
          			'<table class="mwt-bar-tb"><tr>';
        var wd = 100/navlist.length;
		for (var i=0;i<navlist.length;++i) {
			var im=navlist[i];
			code += '<td width="'+wd+'%" style="height:45px;">'+
				'<a class="foota" data-i="0" name="footnav-btn" href="'+im.href+'">'+
					'<i class="'+im.icon+'" style="display:block;margin-top:3px;"></i>'+im.title+'</a>'+
				'</td>';
		}
		code += '</tr></table></div>';
		dom('footnavdiv').innerHTML=code;
		this.active(getActiveIdx());
	};

	// 选中菜单项
	this.active = function(idx) {
		var btns = document.getElementsByName('footnav-btn');
		if (!btns || btns.length==0) return;
		if (idx<0 || idx>=btns.length) return;
		var reg = new RegExp('(\\s|^)active(\\s|$)');
		for (var i=0; i<btns.length; ++i) {
			var btn = btns[i];
			if (i==idx) {
				if (!btn.className.match(reg)) {
					btn.className += " active";
				}
			} else {
				btn.className=btn.className.replace(reg,' '); 
			}
		}
	};
};
