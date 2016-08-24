/* 验证码图片 */
define(function(require){
	var o={};

	o.create = function(domid, style) {
		var s = style ? style : '';
		var securl = dz.securl + "&update="+time();
		var code = '<img id="sec-'+domid+'" src="'+securl+'" style="cursor:pointer;'+s+'">';
		jQuery('#'+domid).html(code);
		jQuery('#sec-'+domid).click(function(){
			var securl = dz.securl + "&update="+time();
			jQuery(this).attr('src',securl);
		});
	};
	
	return o;
});
