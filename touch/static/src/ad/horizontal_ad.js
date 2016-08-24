/* 页面内横向广告 */
define(function(require){
    var ajax=require('ajax');
	var adengine=require('./adengine');
	var dialog;
	var domid;

	function adrun(){
		adengine.getad(2,function(ad){
			var code='<div style="position:relative;line-height:0;height:60px;">'+
			  '<a href="'+ad.adurl+'" class="ad">'+
				'<img src="'+ad.adimg+'" style="width:100%;height:60px;">'+
			  '</a>'+
			  '<div style="position:absolute;bottom:12px;right:2px;">'+adengine.adtag()+'</div>'+
		    '</div>';
			jQuery('#'+domid).html(code);
		});
	}

	var o={};
	o.init=function(did){
		domid=did;
		adrun();
	};
	return o;
});
