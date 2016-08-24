/* 版权信息 */
define(function(require){
	var o={};

	// 最底部的版权信息(审核要求,必须加上)
	o.footer = function() {
		var code = '<div style="text-align:center;font-size:13px;padding:15px 0;">'+
			  '<div style="display:inline-block;">'+
				'<a href="'+dz.siteurl+'forum.php?mobile=1&amp;simpletype=no" style="color:#666;">标准版</a>'+
				'&nbsp;&nbsp;|&nbsp;&nbsp;'+
				'<a href="javascript:;" style="color:#bbb;">触屏版</a>'+
				'&nbsp;&nbsp;|&nbsp;&nbsp;'+
				'<a href="'+dz.siteurl+'forum.php?mobile=no" style="color:#666;">电脑版</a>'+
				'&nbsp;&nbsp;|&nbsp;&nbsp;'+
				'<a href="'+bigstyle_conf.applink+'" style="color:#666;">客户端</a>'+
			  '</div>'+
			  '<p style="color:#666;">&copy; '+bigstyle_conf.copyright+'</p>'+
			'</div>';
		return code;
	};

	return o;
});
