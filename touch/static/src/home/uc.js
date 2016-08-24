/* 我的（个人中心） */
define(function(require){
    var ajax=require('ajax');
	var h5page;

	function init() {
		h5page = new MWT.H5Page({
			bodyStyle: "background-color:#f2f2f2;padding:0 0 45px;",
			pagebody: '<div id="ucdiv"></div>'+
				require('common/copyright').footer()
		});
		h5page.on("open",render);
	};

	function render() {
        var avatar = dz.avatar;
        var spaname = dz.username;
		if (dz.uid==0) {
			spaname = "点击登录<br><span>登录后可使用更多功能哦~</span>";
		}
		var code = '<div id="ucbtn" class="spacebg">'+
				'<img src="'+avatar+'">'+
                '<p>'+spaname+'</p>'+
			'</div>';
		// uclist
		var list = bigstyle_conf.uclist;
		code += '<div class="weui_cells weui_cells_access">';
		for (var i=0; i<list.length; ++i) {
			var item = list[i];
			if (!item.title) {
				code += '</div><div class="weui_cells weui_cells_access">';
			} else {
                code += '<a class="weui_cell" href="'+item.href+'"> '+
                    '<div class="weui_cell_hd">'+
						'<i class="'+item.icon+'" style="background:'+item.iconcolor+';color:#fff;font-size:16px;'+
                             'padding:7px;border-radius:300px;display:block;margin-right:10px;"></i></div>'+
                    '<div class="weui_cell_bd weui_cell_primary"><p style="font-family:\'microsoft yahei\';">'+item.title+'</p></div>'+
                    '<div class="weui_cell_ft"></div>'+
                  '</a>';
			}
		}
		code += '</div>';

		jQuery('#ucdiv').html(code);
        jQuery('#ucbtn').click(function(){
			if (dz.uid==0) {
				require('member/login').login();
			}
		});
	};
	
	var o={};
	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
	};
	return o;
});
