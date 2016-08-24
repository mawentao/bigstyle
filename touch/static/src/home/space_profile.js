/* 我的资料 */
define(function(require){
	var header = require('common/header');
	var iconstyle = header.getHeaderIconStyle();
    var ajax=require('ajax');
	var h5page;
	
	function init() {
		var pagebody = '<div id="uc-profile-body" style="padding-top:20px;"></div>'+
				'<div id="headdiv" style="position:fixed;top:0;left:0;right:0;"></div>';
		jQuery("body").append(pagebody).css('background','#f2f2f2');

		var topbar = require("common/header").createHeader({
			render: 'headdiv',
			items:[
				'back',
				{label:'<h1>我的资料</h1>'},
				'home'
			]
		});
		topbar.create();

		query();
    };

	function query() {
		var api = 'version=4&module=profile';
		ajax.post(api,{},function(res){
			var space = res.Variables.space;
			var code = "";
			// 账号信息
			var list = [
				['用户名',space.username],
				['用户组',space.group.grouptitle],
				['管理组',space.admingroup.grouptitle],
				['注册时间',space.regdate]
			];
			code += getlistcode(list);

			// 积分信息
			list = [
				['主题数', space.threads],
				['回帖数', space.posts],
				['积分', space.credits]
			];
			for (var i in res.Variables.extcredits) {
				var im = res.Variables.extcredits[i];
				var sc = res.Variables.space['extcredits'+i];
				list.push([im.title, sc]);
			}
			code += getlistcode(list);
			jQuery('#uc-profile-body').html(code);
		});
	}

	function getlistcode(list) {
		var code = "<div class='weui_cells'>";
		for (var i=0; i<list.length; ++i) {
			var im = list[i];
			code += '<div class="weui_cell">'+
					'<div class="weui_cell_bd weui_cell_primary">'+
                    	'<p>'+im[0]+'</p>'+
                	'</div>'+
                	'<div class="weui_cell_ft">'+im[1]+'</div>'+
            	'</div>';
		}
		code += '</div>';
		return code;
	}

	var o={};
	o.open = function(animate) {
		init();
	};
	return o;
});
