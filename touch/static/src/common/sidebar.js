/* 侧边栏 */
define(function(require){
	var sidebar;

	function init() {
		sidebar = new MWT.SideBar({
            render: 'uc-sidebar',
			//position: 'right',
			width: '200px;',
			bodyStyle: "background:rgba(0,0,0,0.9);padding:0 0 20px 0;z-index:1;",
			pagebody: '<div id="uc-sidebar-div"></div>'
		});
		sidebar.on("open",render);
	}


	function render() {
        var avatar = dz.avatar;
        var spaname = dz.username;
		if (dz.uid==0) {
			spaname = "点击登录<br><span>登录后可使用更多功能哦~</span>";
		}
		var code = '<div id="uc-sidebar-btn" class="spacebg mwt-border-bottom" style="background:inherit;color:#fff;padding:20px 0;">'+
				'<img src="'+avatar+'">'+
                '<p>'+spaname+'</p>'+
			'</div>';
		// uclist
		var list = bigstyle_conf.uclist;
		code += '<div class="weui_cells weui_cells_access noline" style="background:inherit;margin-top:0;">';
		for (var i=0; i<list.length; ++i) {
			var item = list[i];
			if (!item.title) {
				// 侧边栏不分组
				//code += '</div><div class="weui_cells weui_cells_access">';
			} else {
                code += '<a class="weui_cell noline" href="'+item.href+'" style="background:inherit;padding:5px;"> '+
                    '<div class="weui_cell_hd">'+
						//'<i class="'+item.icon+'" style="background:'+item.iconcolor+';color:#fff;font-size:16px;'+
                        //     'padding:7px;border-radius:300px;display:block;margin-right:10px;"></i></div>'+
						'<i class="'+item.icon+'" style="color:'+item.iconcolor+';font-size:22px;'+
                             'padding:7px;display:block;margin-right:6px;"></i></div>'+
                    '<div class="weui_cell_bd weui_cell_primary"><p style="font-family:\'microsoft yahei\';color:#d9d9d9;">'+item.title+'</p></div>'+
                    //'<div class="weui_cell_ft"></div>'+
                  '</a>';
			}
		}
		code += '</div>';

		jQuery('#uc-sidebar-div').html(code);
        jQuery('#uc-sidebar-btn').click(function(){
			if (dz.uid==0) {
				require('member/login').login();
			}
		});
	};


    var o={}; 
	o.open = function() {
		if (!sidebar) init();
		sidebar.open();
	};
	return o;
});
