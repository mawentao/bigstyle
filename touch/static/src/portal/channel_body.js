/* 频道选择panel */
define(function(require){
	var exmsg = require('common/exmsg');
	var ajax=require('ajax');
    var panel;
    var o={};
	var initedmap = {};

	// 显示文章列表
	function show_article_list(cid,list,page,total,perpage)
	{
		page = parseInt(page);
		total = parseInt(total);
		perpage = parseInt(perpage);
		var codelist = [];
		for (var i=0; i<list.length; ++i) {
			var im = list[i];
			var pic = (im.pic!='') ? im.pic : bigstyle_conf.portal.default_pic;
			var code = '<div name="articlebk-'+cid+'" data-aid="'+im.aid+'" class="weui_cell" style="display:block;">'+
                '<table class="articletab">'+
					'<tr><td rowspan="3" width="100"><img src="'+pic+'"></td>'+
						'<td><div class="title">'+im.title+'</div></td></tr>'+
					'<tr><td><div class="summary">'+im.summary+'</div></td></tr>'+
					'<tr><td align="right"><span class="date">'+im.dateline+'</span></td></tr>'+
				'</table>'+
			'</div>';
			codelist.push(code);
		}
		var code = '<div class="weui_cells" style="margin:0;">'+codelist.join('')+'</div>';
		// 下一页
		var totalPage = Math.ceil(total/perpage);
		if (page<totalPage) {
			var npage = page+1;
			code += '<div id="articlelist-'+cid+'-'+npage+'">'+
				'<button id="artlist-nbtn-'+cid+'" data-page="'+npage+'" class="nextbtn">点击加载下一页</button>'+
			'</div>';
		} else {
			code += '<p align="center" style="font-size:12px;color:#999;padding:10px 0;">没有更多文章了</p>';
		}
		jQuery('#articlelist-'+cid+'-'+page).html(code);
		// event
		jQuery('[name=articlebk-'+cid+']').unbind('click').click(function(){
			var aid = jQuery(this).data('aid');
			require('common/location').viewarticle(aid);
		});
		if (page<totalPage) {
			jQuery('#artlist-nbtn-'+cid).unbind('click').click(function(){
				var p = jQuery(this).data('page');
				MWT.show_loading();
				ajax.post2('portal&action=articlelist&catid='+cid,{page:p},function(res){
					MWT.hide_loading();
					if (res.retcode!=0) {
						MWT.alert(res.retmsg);
						return;
					}
					show_article_list(cid, res.data.root, res.data.page, res.data.totalProperty, res.data.perpage);
				});
			});
		}
	}

	// 显示第一页文章
	function show_first_page(cid,list,bannernum,total,perpage)
	{
		// 一部分以banner形式显示（有封面），其他的以列表形式显示
		var banners = [];
		var articlelist = [];
        for (var i=0; i<list.length; ++i) {
            var im = list[i];
			if (im.pic!='' && bannernum>0) {
				banners.push({
					url: im.pic,
					title: im.title,
					href: 'portal.php?mod=view&aid='+im.aid+'&mobile=2'
				});
				--bannernum;
			} else {
				articlelist.push(im);
			}
        }
		// 显示banner
		if (banners.length>0) {
			var code = '<div id="banner-'+cid+'" style="height:180px;"></div><div id="articlelist-'+cid+'-1"></div><div style="height:50px;"></div>';
			jQuery('#channelbodydiv-'+cid).html(code);
        	var slide=new MWT.Slide({
            	render: 'banner-'+cid,
            	autoplay: 0,
            	images: banners
        	}); 
        	slide.create();
		} else {
			jQuery('#channelbodydiv-'+cid).html('<div id="articlelist-'+cid+'-1"></div><div style="height:60px;"></div>');
		}
		// show article list
		show_article_list(cid,articlelist,1,total,perpage);
	}

	function init_channel_body(channelid)
	{
		var jbody = jQuery('#channelbodydiv-'+channelid);
		MWT.show_loading();
		ajax.post2('portal&action=articlelist&catid='+channelid,{},function(res){
			MWT.hide_loading();
            if (res.retcode!=0) {
				jbody.html(exmsg.error(res.retmsg));
				return;
			}
			if (res.data.root.length==0) {
				jbody.html('<p align="center" style="color:#999;padding-top:10px;">该频道下没有您可看的文章</p>');
				return;
			}
			show_first_page(channelid, res.data.root, 3, res.data.totalProperty, res.data.perpage);
		});		
	}

	o.show_channel=function(channelid){
		jQuery('[name=channelbodydiv]').hide();
		jQuery('#channelbodydiv-'+channelid).show();
		if (!initedmap[channelid]) {
			init_channel_body(channelid);
			initedmap[channelid] = true;
		}
	};

	return o;
});
