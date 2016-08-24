/* 关于 */
define(function(require){
	var loc = require("common/location");
	var header = require('common/header');
	var iconstyle = header.getHeaderIconStyle();
    var ajax=require('ajax');
	var o={};
	var h5page;
	
	function init() {
		h5page = new MWT.H5Page({
            render: 'uc-setting-about',
            header: header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					loc.back("forum.php?forumlist=1");
                }},
				{label:'<h1>关于</h1>'},
                {label:'',width:40}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<center><br>'+
					'<img src="'+dz.sitelogo+'" style="max-width:80px;max-height:80px;margin-bottom:10px;">'+
                    '<br><span>版本: '+bigstyle_conf.version+'</span>'+
				'</center>'+
				'<div style="position:absolute;bottom:10px;text-align:center;width:100%;font-size:13px;color:#666;">'+
					'&copy; '+bigstyle_conf.copyright+
					'<p style="margin-top:4px;font-size:13px;color:#666;">theme by: '+
                      '<a href="http://addon.discuz.com/?@bigstyle.template" target="_blank" '+
                      ' style="text-decoration:underline;color:#666;">bigstyle</a></p>'+
                '</div>'
		});
		h5page.on("open", function(){
			query();
		});
    };

	function query() {
		
	};

	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
	};

	return o;
});
