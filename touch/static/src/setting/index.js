/* 设置 */
define(function(require){
	require("member/login");
	var loc = require("common/location");
	var header = require('common/header');
    var ajax=require('ajax');
	var h5page;
	
	function init() {
		h5page = new MWT.H5Page({
            render: 'uc-setting',
            header: header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					loc.back("forum.php?forumlist=1");
                }},
				{label:'<h1 id="mythreadtitle">设置</h1>'},
                {label:'',width:40}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div id="uc-setting-div"></div>'+
				require('common/copyright').footer()
		});
		h5page.on("open", function(){
			var list = [
				[{title:'关于',href:'forum.php?about=1'}]
			];
			if (dz.uid!=0) {
				list.push([{title:'退出登录',href:'javascript:require(\'member/login\').logout();'}]);
			}
			var code = '';
			for (var i=0; i<list.length; ++i) {
				var sublist = list[i];
				code += '<div class="weui_cells weui_cells_access">';
				for (var k=0; k<sublist.length; ++k) {
					var item = sublist[k];
                	code += '<a class="weui_cell" href="'+item.href+'"> '+
                    	'<div class="weui_cell_bd weui_cell_primary"><p style="font-family:\'microsoft yahei\';">'+item.title+'</p></div>'+
                    	'<div class="weui_cell_ft"></div>'+
                  	'</a>';
            	}
				code += '</div>';
        	}
			jQuery('#uc-setting-div').html(code);
		});
    };

	function query(page) {
		var api = 'version=4&module=mythread&page='+page;
		ajax.post(api,{},function(res){
			show_list(res, page);
		});
	};

	var o={};
	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
	};
	return o;
});
