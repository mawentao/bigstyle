/* 消息列表 */
define(function(require){
	//require('pages/forum/newthread');
	//var frame=require('frame');
	var ajax=require('ajax');
	var h5page;
	
	function init() {
		h5page = new MWT.H5Page({
            //render: frame.getRender(),
            header: require("common/header").createHeader({ items:[
				{label:'<h1>消息</h1>'}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div id="mynotelistdiv"></div>'+
				require('common/copyright').footer()
		});
		h5page.on("open",showlist)
	};

    function showlist() {
		var list = require('data/notice').getlist();
		if (list==0) {
			jQuery('#mynotelistdiv').html("暂无消息");
			return;
		}
		var code = '<div class="weui_cells" style="margin-top:0;">';
		for (var i=0; i<list.length; ++i) {
			var item = list[i];
			if (item.notevar && item.notevar.tid) {
				//var txt = strip_tags(item.note);
				var txt = '<b>'+item.notevar.actorusername+"</b> 回复了您的帖子 "+item.notevar.subject+'';
				code += '<div name="topthread" data-tid="'+item.notevar.tid+'" class="weui_cell">'+
                	'<div class="weui_cell_bd weui_cell_primary">'+
                    	'<p><i class="fa fa-circle" style="font-size:11px;color:#666;width:18px;"></i>'+txt+'</p>'+
              	  '</div>'+
            	'</div>';
			}
		}
		code += '</div>';
		jQuery('#mynotelistdiv').html(code);

		jQuery('[name=topthread]').unbind('click').click(function(){
				var tid = jQuery(this).data('tid');
				window.location = "forum.php?mod=viewthread&tid="+tid;
				//require('pages/forum/viewthread').open(tid,'slideRight');
			});

    };

	var o={};
	o.open = function(animate) {
		if (!h5page) init();
		h5page.setAnimate(animate).open();
	};
	return o;
});
