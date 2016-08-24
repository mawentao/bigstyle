/* 论坛版块数据 */
define(function(require){
	var ajax=require('ajax');
	var o={};
	var forumMap;              //!< 版块id到版块详情映射表
	var forumSelectOptions;    //!< 版块选择项(select options)
	var forumThreadTypesMap;   //!< 版块id到主题分类映射表

	// 调用掌上论坛API接口,获取版块列表数据
	function load_forum_map() {
		ajax.loadcache('version=4&module=forumindex',function(res){
			forumMap = {};
			for (var i=0; i<res.Variables.forumlist.length; ++i) {
				var fm = res.Variables.forumlist[i];
				forumMap[fm.fid] = {
					fid: fm.fid,
					name: fm.name,
					threads: fm.threads,
					posts: fm.posts,
					todayposts: fm.todayposts,
					icon: fm.icon ? fm.icon : bigstyle_conf.default_forum_icon
				};
				if (fm.sublist && fm.sublist.length>0) {
					forumMap[fm.fid]['sublist'] = [];
					for (var k=0; k<fm.sublist.length; ++k) {
						var fsm = fm.sublist[k];
						forumMap[fm.fid]['sublist'].push(fsm.fid);
						forumMap[fsm.fid] = {
							fid: fsm.fid,
							name: fsm.name,
							threads: fsm.threads,
							posts: fsm.posts,
							todayposts: fsm.todayposts,
							icon: fsm.icon ? fsm.icon : bigstyle_conf.default_forum_icon
						};
					}
				}
			}
			create_forum_select_options(res);
		},true);
		//console.log(forumSelectOptions);
	}

	// 创建版块选择项
	function create_forum_select_options(res) {
		forumSelectOptions = '<option value="0">请选择版块</option>';
		if (!res || !res.Variables.catlist) return;
		// 遍历分区
		for (var i=0; i<res.Variables.catlist.length; ++i) {
			var catitem = res.Variables.catlist[i];
			if (!catitem.forums || !catitem.forums.length) continue;
			forumSelectOptions += '<optgroup label="'+catitem.name+'">';
			// 遍历版块
			for (var m=0; m<catitem.forums.length; ++m) {
				var forumid = catitem.forums[m];
				var foruminfo = forumMap[forumid];
				if (foruminfo) {
					forumSelectOptions += '<option value="'+foruminfo.fid+'">'+foruminfo.name+'</option>';
					if (foruminfo.sublist && foruminfo.sublist.length>0) {
						// 遍历子版块
						for (var n=0; n<foruminfo.sublist.length; ++n) {
							var sfid = foruminfo.sublist[n];
							var sfinfo = forumMap[sfid];
							if (sfinfo) {
								forumSelectOptions += '<option value="'+sfinfo.fid+'">&nbsp;&nbsp;&nbsp;&nbsp;'+sfinfo.name+'</option>';
							}
						}
					}
				}
			}
		}
	}

	// 加载版块主题分类
	function load_forum_thread_types() {
		ajax.loadcache('version=4&module=forumnav',function(res){
			forumThreadTypesMap = {};
			if (!res.Variables.forums) return;
			for (var i=0; i<res.Variables.forums.length; ++i) {
				var fm = res.Variables.forums[i];
				forumThreadTypesMap[fm.fid] = [];
				if (fm.threadtypes && fm.threadtypes.types) {
					for (var tid in fm.threadtypes.types) {
						var typeitem = {tid:tid,name:fm.threadtypes.types[tid]};
						forumThreadTypesMap[fm.fid].push(typeitem);
					}
				}
			}
		},true);
	}

	// 获取论坛版块详情(注意:隐藏版块是获取不到详情的)
	o.getForumInfo = function(fid) {
		if (!forumMap) {
			load_forum_map();
		}
		return forumMap[fid];
	};

	// 获取热门版块列表(如果为空,则从所有版块中拉几个)
	o.getHotForums = function() {
		var list = [];
		var forumids = [];
		//1. 如果指定了热门版块
		var hotforumconf = bigstyle_conf.hotforums;
		if (hotforumconf.source==0 && hotforumconf.forums && hotforumconf.forums.length>0) {
			forumids = hotforumconf.forums;
		}
		//2. 使用掌上论坛热门版块接口数据
		else {
		    var api = "version=4&module=hotforum";
		    ajax.loadcache(api,function(res){
			    if (!res.Variables.data || !res.Variables.data.length) return;
			    for (var i=0; i<res.Variables.data.length; ++i) {
				    var im = res.Variables.data[i];
					forumids.push(im.fid); 
			    }
		    },true);
		}
		//3. 附上版块的基础信息
		for (var i=0; i<forumids.length; ++i) {
			var fid = forumids[i];
			var finfo = o.getForumInfo(fid);
			if (finfo && finfo.icon) {
				//im.icon = finfo.icon;
				list.push(finfo);
			}
		}
		// for audit: no hot forum
        if (list.length==0) {
			for (var fid in forumMap) {
				list.push(forumMap[fid]);
				if (list.length>2) break;
			}
		}
		return list;
	};

	// 获取所有版块ID(不包括被隐藏的版块)
	o.getAllForumIds = function() {
		var list = [];
		if (!forumMap) load_forum_map();
		for (var fid in forumMap) list.push(fid);
		return list;
	};

	// 获取版块选择项(字符串)
	o.getForumSelectOptions = function() {
		if (!forumSelectOptions) load_forum_map();
		return forumSelectOptions;
	};

	// 获取版块主题分类
    o.getForumThreadTypes = function(fid) {
		if (!forumThreadTypesMap) load_forum_thread_types();
		if (forumThreadTypesMap[fid]) return forumThreadTypesMap[fid];
		return [];
	};

	// 获取所有版块map
	o.getForumMap = function() {
		if (!forumMap) load_forum_map();
		return forumMap;
	};

	return o;
});
