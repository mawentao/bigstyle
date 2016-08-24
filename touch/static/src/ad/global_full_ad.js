/* 全局大屏广告 */
define(function(require){
    var ajax=require('ajax');
	var adengine=require('./adengine');
	var dialog;
    var o={};

	function adrun() {
		adengine.getad(1,function(ad){
			var imgheight=dz.bodyHeight-135;
			var code = '<a href="'+ad.adurl+'" class="ad">'+
			    '<img src="'+ad.adimg+'" style="width:100%;height:'+imgheight+'px;">'+
			  '</a>';
			jQuery('#global_full_ad_div').html(code);
			dialog.open();
		});
	};

	o.init=function() {
		var height = dz.bodyHeight-140;
		dialog = new MWT.H5Dialog({
			render:'global_full_ad',
			top: 50,
			//animate: 'addialog flipInX',
			animate: 'addialog zoomIn',
			height: height,
            body   : '<div id="global_full_ad_div"></div>'+
				'<div style="position:absolute;bottom:1px;right:1px;">'+adengine.adtag()+'</div>'
        });
		dialog.create();
		setTimeout(adrun, 5000);
	};

	return o;
});
