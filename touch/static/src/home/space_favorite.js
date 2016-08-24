/* 我的收藏 */
define(function(require){
	var loc = require("common/location");
	var header = require('common/header');
    var ajax=require('ajax');
	var h5page,totalThreads=0;
	var curtabidx;
	
	function init_tab() {
		var render = 'uc-mythreads-div';
		var panel1 = new MWT.TabPanel({
            title: '帖子收藏',
            body: '<div id="myfav-tab-1"></div>'
        });
		panel1.on('show',function(){curtabidx=1; query(1);});

		var panel2 = new MWT.TabPanel({
            title: '版块收藏',
            body: '<div id="myfav-tab-2"></div>'
		});
		panel2.on('show',function(){curtabidx=2; query(1);});

		var widget = new MWT.TabWidget({
			render: render,
            panels: [panel1,panel2],
            headerStyle: ''
        });
        widget.show().active(0);
	}

	function init() {
		h5page = new MWT.H5Page({
            render: 'uc-myfavor',
            header: header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					loc.back("forum.php?forumlist=1");
                }},
				{label:'<h1 id="myfavtitle">我的收藏</h1>'},
                {label:'',width:40}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div class="weui_cells" id="uc-mythreads-div" style="margin-top:0;"></div>'
		});
		h5page.on("open", function(){
			init_tab();
		});
    };

	function query(page) {
		var api = '';
		switch (curtabidx) {
			case 1: api = 'version=4&module=myfavthread&page='+page; break;
			case 2: api = 'version=4&module=myfavforum&page='+page; break;
		}
		ajax.post(api,{},function(res){
			show_list(res, page);
		});
	};

	// 主题
	function get_thread_cell(im) {
		var avatar = dz_avatar(im['authorid']);
		var dateline = date("Y-m-d H:i",im.dateline);
		var code = '<div name="topthread" data-tid="'+im.id+'" class="weui_cell" style="display:block;">'+
					 '<div style="font-size:12px;">'+
						'<img src="'+avatar+'" style="border-radius:300px;width:30px;height:30px;vertical-align:top">'+
						'<span style="margin:0 8px;display:inline-block;font-size:12px;color:#333;">'+im.author+'<br>'+
                        '<span style="float:left;font-size:11px;color:#999;">'+dateline+'</span></span>'+
                     '</div>'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       im.title+
                     '</div>'+
                     '<div class="weui_cell_ft" style="font-size:13px;">'+
						'<i class="icon icon-comment"></i> '+im.replies+/*'&nbsp;&nbsp;&nbsp;'+
						'<i class="icon icon-preview"></i> '+im.views+*/
					 '</div>'+
                '</div>';
		return code;
	}

	// 版块
	function get_forum_cell(im) {
		var code = '<div name="fmdiv" data-fid="'+im.id+'" class="weui_cell">'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       ''+im.title+'<br>'+
                       '<span style="font-size:13px;">主题:'+im.threads+' | 帖子:'+im.posts+'</span>'+
                     '</div>'+
                     '<div class="weui_cell_ft">'+
                       '<span style="border-radius:300px;background:#666;color:#fff;font-size:12px;padding:5px 10px;">'+
                         '今日: '+im.todayposts+'</span></div>'+
                '</div>';
		return code;	
	}

	// 显示列表
	function show_list(data, page) {
		var list = [];
        var currentPageSize = data.Variables.list.length;
		switch (curtabidx) {
			case 1:
				for (var i=0; i<currentPageSize; ++i) {
					list.push(get_thread_cell(data.Variables.list[i]));
				}
				break;
			case 2:
				for (var i=0; i<currentPageSize; ++i) {
					list.push(get_forum_cell(data.Variables.list[i]));
				}
				break;
		}
		var basediv = 'myfav-tab-'+curtabidx;
		var rd = page==1 ? basediv : basediv+'-'+page;
		var code = list.join('');
		if (has_next_page(page, data.Variables.count, data.Variables.perpage, currentPageSize)) {
			var nextpage = page+1;
			code += '<div id="'+basediv+'-'+nextpage+'">'+
					'<button id="'+basediv+'-nbtn" data-page="'+nextpage+'" class="nextbtn">点击加载下一页</button>'+
				'</div>';
		}
		jQuery('#'+rd).html(code);
		jQuery('#'+basediv+'-nbtn').unbind('click').click(function(){
			var pg = jQuery(this).data('page');
			query(pg);
		});
		// 点击事件
		// 点击帖子
		jQuery('[name=topthread]').unbind('click').click(function(){
			var tid = jQuery(this).data('tid');
			loc.viewthread(tid);
		});
		// 点击版块
		jQuery('[name=fmdiv]').unbind('click').click(function(){
			var fid = jQuery(this).data('fid');
			loc.forumdisplay(fid);
		});
	};

	var o={};
	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
		//require('common/backtop').init();
	};
	return o;
});
