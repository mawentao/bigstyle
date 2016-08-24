/* 主题列表tab组件 */
define(function(require){
    var ThreadTab = function(render,callfun) {
        var curtabidx;

		function change_page(page) {
		    if (callfun) callfun(curtabidx,page);
		};

		this.init = function() {
			var panel1 = new MWT.TabPanel({
                title: '全部',
                body: '<div id="'+render+'-tabbody-1"></div>'
            });
			panel1.on('show',function(){curtabidx=1; change_page(1);});

            var panel2 = new MWT.TabPanel({
                title: '最新',
                body: '<div id="'+render+'-tabbody-2"></div>'
            });
			panel2.on('show',function(){curtabidx=2; change_page(1);});
        
        	var panel3 = new MWT.TabPanel({
            	title: '精华',
            	body: '<div id="'+render+'-tabbody-3"></div>'
        	});
        	panel3.on('show',function(){curtabidx=3; change_page(1);});

        	var panel4 = new MWT.TabPanel({
            	title: '热门',
            	body: '<div id="'+render+'-tabbody-4"></div>'
        	});
        	panel4.on('show',function(){curtabidx=4; change_page(1);});

        	var widget = new MWT.TabWidget({
            	render: render,
            	panels: [panel1,panel2,panel3,panel4],
            	headerStyle: ''
        	});
        	widget.show().active(0);
		};
		
		this.show_list = function(data) {
			var list = [];
			var title_max_width = dz.bodyWidth - 80;
			var currentPageSize = data.Variables.forum_threadlist.length;  //!< 本页个数
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
			var page = parseInt(data.Variables.page);
            var basediv = render+'-tabbody-'+curtabidx;
			var rd = page==1 ? basediv : basediv+'-'+page;
			var code = '<div style="background:#fff;">'+
						'<div class="weui_cells" style="margin:0;">'+list.join('')+'</div></div>';
			if (has_next_page(page, data.Variables.forum.threads, data.Variables.tpp, currentPageSize)) {
				var nextpage = page+1;
				code += '<div id="'+basediv+'-'+nextpage+'">'+
					'<button id="'+basediv+'-nbtn" data-page="'+nextpage+'" class="nextbtn">点击加载下一页</button>'+
				'</div>';
			}
			jQuery('#'+rd).html(code);
			jQuery('#'+basediv+'-nbtn').unbind('click').click(function(){
				var pg = jQuery(this).data('page');
				change_page(pg);
			});
			jQuery('[name=topthread]').unbind('click').click(function(){
				var tid = jQuery(this).data('tid');
				require('common/location').viewthread(tid);
			});
		};
	};
	return ThreadTab;
});
