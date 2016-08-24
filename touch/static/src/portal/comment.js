/* 文章评论 */
define(function(require){
	var ajax=require('ajax'); 
	var aid;

	// 显示文章评论列表
	function show_comments(list,page,total,perpage)
	{
		page = parseInt(page);
		total = parseInt(total);
		perpage = parseInt(perpage);
		var codelist = [];
		for (var i=0; i<list.length; ++i) {
			var im = list[i];
			var avatar = dz_avatar(im.uid);
			var uname = im.uid=='0' ? '游客('+im.postip+')' : im.username;
			var code = '<div class="weui_cell" style="display:block;">'+
                '<table class="tablay">'+
					'<tr><td width="40" rowspan="2" style="vertical-align:top;">'+
							'<img src="'+avatar+'" style="width:30px;height:30px;border-radius:300px;"></td>'+
						'<td><span style="color:#0e90d2;font-size:13px;">'+uname+'</span>'+
                            '<span style="color:#999;font-size:12px;float:right;">'+date('Y-m-d H:i',im.dateline)+'</span></td></tr>'+
					'<tr><td style="color:#000;font-size:15px;">'+im.message+'</td></tr>'+
				'</table>'+
			'</div>';
			codelist.push(code);
		}
		var code = codelist.join('');
		// 下一页
		var totalPage = Math.ceil(total/perpage);
		if (page<totalPage) {
			var npage = page+1;
			code += '<div id="article-comment-'+npage+'">'+
				'<button id="comments-nbtn" data-page="'+npage+'" class="nextbtn">点击查看更多</button>'+
			'</div>';
		}
		jQuery('#article-comment-'+page).html(code);
		// event
		if (page<totalPage) {
			jQuery('#comments-nbtn').unbind('click').click(function(){
				var p = jQuery(this).data('page');
				MWT.show_loading();
				ajax.post2('portal&action=comments',{aid:aid,page:p},function(res){
					MWT.hide_loading();
					show_comments(res.data.root, res.data.page, res.data.totalProperty, res.data.perpage);
				});
			});
		}
	}



	var o={};
	o.query = function(_aid,page) {
		aid=_aid;
		ajax.post2('portal&action=comments',{aid:aid,page:page},function(res){
			if (res.data.root.length==0 && page==1) {
				var code="<p align='center' style='font-size:13px;color:#999;line-height:50px;'>还没有人评论哦~~<p>";
				jQuery('#article-comment-1').html(code);
			} else {
				show_comments(res.data.root, res.data.page, res.data.totalProperty, res.data.perpage);
			}
		});
	};
	return o;
});
