/* 版块列表 */
define(function(require){
    var ajax=require('ajax');

	function init() {
		var pagebody = '<div style="margin:40px 0 45px;">'+
            '<div id="ad-div"></div>'+
			'<div id="forumlistdiv"></div>'+
			require('common/copyright').footer()+
		'</div>';
		jQuery("body").append(pagebody).css("background","#f2f2f2");

		var topbar = require("common/header").createHeader({
			items: [
				'uc',
			    {label:'<h1>论坛</h1>'},
				'search'
			]
		});
		topbar.create();
		query();
		// 广告
		require('ad/horizontal_ad').init('ad-div');
	};

    function query() {
		ajax.post('version=4&module=forumindex',{},function(res){
			render(res.Variables.catlist, res.Variables.forumlist);
        });
    };

    function render(catlist, forumlist) {
		var forummap = {};
		for (var i=0; i<forumlist.length; ++i) {
			var im = forumlist[i];
			forummap[im.fid] = i;
		}
		var code = "";
		for (var i=0; i<catlist.length; ++i) {
			var cartname = catlist[i].name;
            var style= i==0 ? 'style="margin:0;"' : '';
		    code += '<div style="background:#fff;">'+
                 '<div class="weui_cells_title mwt-border-bottom" '+style+'>'+cartname+'</div>'+
                 '<div class="weui_cells">';
			for (var k=0;k<catlist[i].forums.length; ++k) {
				var fid = catlist[i].forums[k];
				var fix = forummap[fid];
                var fim = forumlist[fix];
                var icon = fim.icon ? fim.icon : bigstyle_conf.default_forum_icon;
				code += '<div name="fmdiv" data-fid="'+fid+'" data-fname="'+fim.name+'" class="weui_cell">'+
                   //'<a href="javascript:;">'+
                     '<div class="weui_cell_hd"><img src="'+icon+'" style="width:40px;height:40px;margin-right:10px;display:block"></div>'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       ''+fim.name+'<br>'+
                       '<span style="font-size:13px;">主题:'+fim.threads+' | 帖子:'+fim.posts+'</span>'+
                     '</div>'+
                     '<div class="weui_cell_ft">'+
                       '<span style="border-radius:300px;background:#666;color:#fff;font-size:12px;padding:5px 10px;">'+
                         '今日: '+fim.todayposts+'</span></div>'+
                   //'</a>'+
                '</div>';
			}
			code += '</div></div>';
		}
		jQuery("#forumlistdiv").html(code);
        jQuery('[name=fmdiv]').click(function(){
		    var fid = jQuery(this).data('fid');
			require('common/location').forumdisplay(fid);
		});
	};

	var o={};
	o.open = function(animate) {
		init();
		require('common/backtop').init(50);
	};
	return o;
});
