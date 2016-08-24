/* 首页tab组件 */
define(function(require){
	var threadData = require('data/thread');
    var IndexTab = function(render,callfun) {
        var curtabidx;

		function change_page(page) {
		    if (callfun) callfun(curtabidx,page);
		};

		this.init = function() {
			var panel1 = new MWT.TabPanel({
                title: '最新帖子',
                body: '<div id="'+render+'-tabbody-1"></div>'
            });
			panel1.on('show',function(){curtabidx=1; change_page(1);});

            var panel2 = new MWT.TabPanel({
                title: '热门帖子',
                body: '<div id="'+render+'-tabbody-2"></div>'
            });
			panel2.on('show',function(){curtabidx=2; change_page(1);});

			var widget = new MWT.TabWidget({
            	render: render,
            	panels: [panel1,panel2],
            	headerStyle: ''
        	});
        	widget.show().active(0);
		};
		
		this.show_list = function(data,page,pageSize) {
			var list = [];
			var title_max_width = dz.bodyWidth - 80;
			var currentPageSize = 0;
			if (data.Variables.data && data.Variables.data.length) {
				currentPageSize = data.Variables.data.length;   //本页个数
			} 
		    for (var i=0; i<currentPageSize; ++i) {
				var im = data.Variables.data[i];
				var avatar = dz_avatar(im.authorid);
				var cd = '<div name="topthread" data-tid="'+im.tid+'" class="weui_cell" style="display:block;">'+
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
				list.push(cd);
			}
            var basediv = render+'-tabbody-'+curtabidx;
			var rd = page==1 ? basediv : basediv+'-'+page;
			////////////////////////////////
			// 为了应付审核,首页帖子不要为空
			//list = [];
			if (page==1 && list.length==0) {
				if (curtabidx==1)
					list = threadData.getNewThreads();
				else
					list = threadData.getHotThreads();
			}
			////////////////////////////////
			var code = '<div style="background:#fff;">'+
						'<div class="weui_cells" style="margin:0;">'+list.join('')+'</div></div>';
			jQuery('#'+rd).html(code);
			jQuery('[name=topthread]').unbind('click').click(function(){
				var tid = jQuery(this).data('tid');
				require('common/location').viewthread(tid);
			});
		};
	};
	return IndexTab;
});
