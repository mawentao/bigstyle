/* 异常信息,错误信息 */
define(function(require){
    var o={};

	// 通用异常信息
	o.error=function(msg) {
		var code = '<table class="tablay"><tr>'+
			'<td style="text-align:center;vertical-align:middle;padding-top:10px;" width="70">'+
				'<i class="fa fa-warning" style="font-size:40px;color:#999;"></i></td>'+
			'<td style="vertical-align:middle;color:#999;padding-top:10px;">'+msg+'</td>'+
        '</tr></table>';
		return code;
	};

	o.portal_disable=function() {
		var code = '<center style="color:#999;">'+
			'<p><i class="fa fa-frown-o" style="font-size:40px;margin-top:20px;"></i></p>'+
			'您访问的站点未开启门户功能'+
        '</center>';
		return code;
	};


	return o;
});
