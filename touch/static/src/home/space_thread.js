/* 我的主题 */
define(function(require){
	var loc = require("common/location");
	var header = require('common/header');
    var ajax=require('ajax');
	var h5page,totalThreads=0;
	
	function init() {
		h5page = new MWT.H5Page({
            render: 'uc-mythread',
            header: header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					loc.back("forum.php?forumlist=1");
				}},
				{label:'<h1 id="mythreadtitle">我的帖子</h1>'},
                {label:'',width:40}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div class="weui_cells" id="uc-mythreads-div" style="margin-top:0;"></div>'
		});
		h5page.on("open", function(){
			var api = 'version=4&module=profile';
			ajax.post(api,{},function(res){
				totalThreads = res.Variables.space.threads;
				jQuery('#mythreadtitle').html("我的帖子("+totalThreads+")");
				query(1);
			});
		});
    };

	function query(page) {
		var api = 'version=4&module=mythread&page='+page;
		ajax.post(api,{},function(res){
			show_list(res, page);
		});
	};

	function getcell(im) {
		var avatar = dz_avatar(im['authorid']);
		var code = '<div name="topthread" data-tid="'+im.tid+'" class="weui_cell" style="display:block;">'+
					 '<div style="font-size:12px;">'+
						'<img src="'+avatar+'" style="border-radius:300px;width:30px;height:30px;vertical-align:top">'+
						'<span style="margin:0 8px;display:inline-block;font-size:12px;color:#333;">'+im.author+'<br>'+
                        '<span style="float:left;font-size:11px;color:#999;">'+im.dateline+'</span></span>'+
                     '</div>'+
                     '<div class="weui_cell_bd weui_cell_primary">'+
                       im.subject+
                     '</div>'+
                     '<div class="weui_cell_ft" style="font-size:13px;">'+
						'<i class="icon icon-comment"></i> '+im.replies+'&nbsp;&nbsp;&nbsp;'+
						'<i class="icon icon-preview"></i> '+im.views+
					 '</div>'+
                '</div>';
		return code;
	}

	// 显示帖子列表
	function show_list(data, page) {
		var list = [];
        var currentPageSize = data.Variables.data.length;
		for (var i=0; i<currentPageSize; ++i) {
			list.push(getcell(data.Variables.data[i]));
		}
		var basediv = 'uc-mythreads-div';
		var rd = page==1 ? basediv : basediv+'-'+page;
		var code = list.join('');
		if (has_next_page(page, totalThreads, data.Variables.perpage, currentPageSize)) {
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
		jQuery('[name=topthread]').unbind('click').click(function(){
			var tid = jQuery(this).data('tid');
			loc.viewthread(tid);			
		});
	};

	var o={};
	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
	};
	return o;
});

