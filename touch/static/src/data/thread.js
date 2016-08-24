/* 首页帖子数据 */
define(function(require){
	var forumData = require('data/forum');
	var ajax=require('ajax');
	var o={};

	// 获取最新帖子
	o.getNewThreads = function() {
		var forumMap = forumData.getForumMap();
		var fid = 0;
		var maxnum = 0;
		for (var forumid in forumMap) {
			var finfo = forumMap[forumid];
			var tnum = parseInt(finfo.threads);
			if (tnum>maxnum) {
				fid = forumid;
				maxnum = tnum;
			}
		}		
	    return o.getLastPostThreadsOfForum(fid, 1);
	};

	// 获取热门帖子
	o.getHotThreads = function() {
		var forumMap = forumData.getForumMap();
		var fid = 0;
		var maxnum = 0;
		for (var forumid in forumMap) {
			var finfo = forumMap[forumid];
			var tnum = parseInt(finfo.threads);
			if (tnum>maxnum) {
				fid = forumid;
				maxnum = tnum;
			}
		}		
	    return o.getHotThreadsOfForum(fid, 1);
	};

	// 获取某版块下的最新帖子列表
    o.getLastPostThreadsOfForum = function(fid, page) {
		var list = [];
		var api = 'version=4&module=forumdisplay&fid='+fid+'&page='+page+'&filter=lastpost&orderby=lastpost';
		MWT.show_loading();
		ajax.post(api,{},function(res){
			MWT.hide_loading();
			list = o.getParseThreadRes(res);
		},true);
		return list;
	};

	// 获取某版块下的热门帖子列表
	o.getHotThreadsOfForum = function(fid, page) {
		var list = [];
		var api = 'version=4&module=forumdisplay&fid='+fid+'&page='+page+'&filter=heat&orderby=heats';
		MWT.show_loading();
		ajax.post(api,{},function(res){
			MWT.hide_loading();
			list = o.getParseThreadRes(res);
		},true);
		return list;
	};

	// 解析帖子列表
	o.getParseThreadRes = function(data) {
		var list = [];
		if (!data.Variables.forum_threadlist.length) return list;
		var currentPageSize = data.Variables.forum_threadlist.length;
		for (var i=0; i<currentPageSize; ++i) { 
			var im = data.Variables.forum_threadlist[i];
			if (im.displayorder>0) continue;
			var avatar = dz_avatar(im.authorid);
			var cd = '<div name="topthread" data-tid="'+im.tid+'" class="weui_cell" style="display:block;">'+
					 '<div style="font-size:12px;">'+
						'<img src="'+avatar+'" style="border-radius:300px;width:30px;height:30px;vertical-align:top">'+
						'<span style="margin:0 8px;display:inline-block;font-size:12px;color:#333;">'+im.author+'<br>'+
                        '<span style="float:left;font-size:11px;color:#999;">'+im.lastpost+'</span></span>'+
                     '</div>'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       im.subject+
                     '</div>'+
                     '<div class="weui_cell_ft" style="font-size:13px;">'+
						'<i class="icon icon-comment"></i> '+im.replies+'&nbsp;&nbsp;&nbsp;'+
						'<i class="icon icon-preview"></i> '+im.views+
					 '</div>'+
                '</div>';
				list.push(cd);
		}
		return list;
	};

	return o;
});

