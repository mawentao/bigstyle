/* 版块帖子列表 */
define(function(require){
    var loc=require('common/location');
	var header = require('common/header');
	var iconstyle = header.getHeaderIconStyle();
    var ajax=require('ajax');
    var ThreadTab = require("./thread_tab");

	var h5page,fid,firstquery=true;
	var threadtab;

	function init() {
		var pagebody = '<div style="margin:40px 0 45px;">'+
			'<div id="ad-div"></div>'+
			'<div id="forumlist-topdiv-'+fid+'"></div>'+
			'<div id="formtabdiv-'+fid+'" style="margin-top:.77em;"></div>'+
			require('common/copyright').footer()+
		'</div>';
		jQuery("body").append(pagebody).css("background","#f2f2f2");

		var topbar = require("common/header").createHeader({
			items: [
				'back',
				'home',
				{label:'<h1 id="forumpagetitle-'+fid+'">论坛</h1>'},
				{width:40},
				{icon:'icon icon-ask',iconStyle:iconstyle,width:40,handler:function(){
					window.location = "forum.php?mod=post&action=newthread&fid="+fid;
				}}
			]
		});
		topbar.create();

		firstquery = true;
		threadtab = new ThreadTab("formtabdiv-"+fid,query);
		threadtab.init();
		
		// 广告
		require('ad/horizontal_ad').init('ad-div');
	};

		// idx: 1-全部,2-最新,3-精华,4-热门
		function query(idx,page) {
        	var api = 'version=4&module=forumdisplay&fid='+fid+'&page='+page;
			switch (idx) {
				case 2: api += "&filter=lastpost&orderby=lastpost"; break;
				case 3: api += "&filter=digest&digest=1"; break;
				case 4: api += "&filter=heat&orderby=heats"; break;
			};
        	MWT.show_loading();
        	ajax.post(api,{},function(res){
				MWT.hide_loading();
				if (firstquery) {
					firstquery = false;
					renderSummary(res);
				}
				threadtab.show_list(res);
			});
    	};

		// 显示顶部
		function renderSummary(data) {
			var fim = data.Variables.forum;
			jQuery("#forumpagetitle-"+fid).html(fim.name);
			var icon = fim.icon ? fim.icon : bigstyle_conf.default_forum_icon;
			var code = '<div name="fmdiv" data-fname="'+fim.name+'" class="weui_cell">'+
                     '<div class="weui_cell_hd"><img src="'+icon+'" style="width:40px;height:40px;margin-right:10px;display:block"></div>'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       ''+fim.name+'<br>'+
                       '<span style="font-size:13px;">主题:'+fim.threads+' | 帖子:'+fim.posts+'</span>'+
                     '</div>'+
                     '<div class="weui_cell_ft">'+
                       '<span name="fav-forum-btn" data-fid="'+fid+'" '+
                         'style="border-radius:300px;background:#f1f1f1;color:#DA5D0C;font-size:12px;padding:5px 10px;">'+
                         '<i class="icon icon-favor"></i> 收藏</span>'+
					'</div>'+
                '</div>';
        	// 子版块
			if (data.Variables.sublist.length>0) {
				var sublist = [];
				var title_max_width = dz.bodyWidth - 120;
				for (var i=0; i<data.Variables.sublist.length; ++i) {
					var im = data.Variables.sublist[i];
					var cd = '<div name="subforum" data-fid="'+im.fid+'" class="weui_cell">'+
                    	 '<div class="weui_cell_bd weui_cell_primary">'+
                       		'<span class="text-block-nowrap" style="width:'+title_max_width+'px">'+im.name+'</span>'+
                     	'</div>'+
                     	'<div class="weui_cell_ft" style="font-size:13px;">'+
							//'<i class="icon icon-preview"></i> '+im.todayposts+
                        	'<span style="font-size:12px;">今日: '+im.todayposts+'</span>'+
					 	'</div>'+
                	'</div>';
					sublist.push(cd);
				}
				code += '<div style="background:#fff;">'+
					'<div class="weui_cells_title mwt-border-bottom">子版块</div>'+
					'<div class="weui_cells">'+sublist.join('')+'</div>'+
				'</div>';
			}
		
			// 置顶贴
			if (data.Variables.forum_threadlist.length>0) {
		    	var top_threads = [];
            	var title_max_width = dz.bodyWidth - 80;
		    	for (var i=0; i<data.Variables.forum_threadlist.length; ++i) {
					var im = data.Variables.forum_threadlist[i];
					if (im.displayorder==0) continue;
					var cd = '<div name="topthread" data-tid="'+im.tid+'" class="weui_cell">'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       '<span class="text-block-nowrap" style="width:'+title_max_width+'px">'+im.subject+'</span>'+
                     '</div>'+
                     '<div class="weui_cell_ft" style="font-size:13px;">'+
						'<i class="icon icon-preview"></i> '+im.views+
					 '</div>'+
                	'</div>';
					top_threads.push(cd);
				}
				if (top_threads.length>0) {
					code += '<div style="background:#fff;">'+
                    	'<div class="weui_cells_title mwt-border-bottom">置顶</div>'+
						'<div class="weui_cells">'+top_threads.join('')+'</div></div></div>';
				}
			}

			jQuery('#forumlist-topdiv-'+fid).html(code);
		
			// 绑定事件
			if (data.Variables.sublist.length>0) {
				jQuery("[name=subforum]").click(function(){
					var subfid = jQuery(this).data('fid');
					loc.forumdisplay(subfid);
				});
			}

			// 收藏版块
			jQuery('[name=fav-forum-btn]').click(function(){
				var fid = jQuery(this).data('fid');
				var api = 'version=4&module=favforum&id='+fid+'&formhash='+ajax.getFormHash();
				ajax.post(api,{},function(res){
					if (res.Message && res.Message.messageval=="favorite_do_success") {
						MWT.toast({msg:"已收藏"});
					} else if (res.Message.messageval=="favorite_repeat") {
						// 取消收藏
						//api = 'version=4&module=favforum&op=delete&favid='+fid+'&formhash='+ajax.getFormHash(); 
						//ajax.post(api,{},function(res){
						//	print_r(res);
						//});
						MWT.toast({msg:"已收藏"});
					} else {
						MWT.alert({msg:res.Message.messagestr});
					}
				});
			});
		}

	var o={};
	o.open = function(animate,_fid) {
		fid=_fid;
		init();
		require('common/backtop').init(10);
	};
	return o;
});
