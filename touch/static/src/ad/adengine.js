/* 所有广告的驱动引擎 */
define(function(require){
	var o={};
	// 广告统一标记
	o.adtag = function() {
		var tag='<span class="adtag">广告</span>';
		return tag;
	};
	// 获取广告
	o.getad=function(adtype,callback) {
		var api = bigstyle_conf.adapi;
		if (!api || api=='') {
			return;
		}
		var params = {
			adtype: adtype,
			site: dz.siteurl,
			bbname: dz.bbname,
			sitename: dz.sitename
		};
		jQuery.ajax({
			url: api,
			type: 'post',
			dataType: "json",
			data: params,
			success: function(res){
				if (!res.data) return;
				var ad=res.data;
				if (callback) {
					callback(ad);
				}
			}
		});
	};
	o.run=function(func) {
		func();
		while(true) {
			setTimeout(func,300000);   //!< 每隔5分钟拉一次广告
		};
	};
	return o;
});
