/* 查看主题,主题的帖子列表 */
define(function(require){
	var header = require('common/header');
	var iconstyle = header.getHeaderIconStyle();
    var ajax=require('ajax');
	var tid;
	var firstquery=true,formhash;

    // 删除主题
    function delthread(fid)
	{
		var api = dz.siteurl+"/forum.php?mod=topicadmin&action=moderate&optgroup=3&modsubmit=yes&mobile=2&handlekey=moderateform&inajax=1";
		var params = {
			frommodcp:'',
			formhash: ajax.getFormHash(),
			fid: fid,
			reason: '手机版主题操作',
			'moderate[]': tid,
			'operations[]':'delete',
		};
        ajax.post3(api,params,function(xml){
			var html = jQuery("root",xml).text();
			//var msg = "已删除";
			MWT.alert(html,function(){
				window.location = "forum.php?mod=forumdisplay&fid="+fid+"&mobile=2";
			});
		});
	}

		function init() {
			var pagebody = '<div style="line-height:40px;">&nbsp;</div>'+
				'<div id="ad-div"></div>'+
				'<div id="vth-topdiv-'+tid+'" style="background:#fff;"></div>'+
                '<div style="background:#fff;margin-bottom:5px;">'+
				    '<div class="weui_cells_title mwt-border-bottom">相关回复</div>'+
                    '<div id="vthdiv-'+tid+'" style="min-height:50px;"></div>'+
				'</div>'+
				require('common/copyright').footer()+
				'<div style="line-height:45px;">&nbsp;</div>'+
				'<div id="headdiv" style="position:fixed;top:0;left:0;right:0;"></div>'+
				'<div id="footdiv" style="position:fixed;bottom:0;left:0;right:0;">';
			jQuery("body").append(pagebody).css('background','#f2f2f2');

			var topbar = header.createHeader({
				render: 'headdiv',
				items:[
					'back',
					'home',
					{label:'<h1 id="threadtitle'+tid+'">查看帖子</h1>'},
					{label:'',width:40},
					{label:'',width:40}
				]
			});
			topbar.create();

			var footer = new MWT.H5Navbar({
				render: 'footdiv',
				position: 'bottom',
				cls: 'footbar mwt-border-top',
				height: 45,
				items: [
					{icon:'icon icon-comment',label:'回复',handler:function(){
						require('./sendreply').open('slideRight',tid,formhash,function(){
                            query(1);
                        });
					}},
						{icon:'icon icon-favor',label:'收藏',handler:function(){
							var api = 'version=4&module=favthread&id='+tid+'&formhash='+ajax.getFormHash();
							ajax.post(api,{},function(res){
								if (res.Message && (res.Message.messageval=="favorite_do_success" || res.Message.messageval=="favorite_repeat")
								){
									MWT.toast({msg:"已收藏"});
								} else {
									MWT.alert({msg:res.Message.messagestr});
								}
							});
						}}
					]
			});
			footer.create();

			firstquery=true;
			query(1);

			// 广告
			require('ad/horizontal_ad').init('ad-div');
		};

		function query(page) {
			var api = 'version=4&module=viewthread&tid='+tid+"&page="+page;
			MWT.show_loading();
			ajax.post(api,{},function(res){
				formhash = res.Variables.formhash;
				MWT.hide_loading();
				if (firstquery) {
					firstquery = false;
					renderSummary(res);
				}
				show_list(res, page);
			});
		};
	
		// 显示顶部
		function renderSummary(data) {
			var tim = data.Variables.thread;
			var code = '<div class="mwt-border-bottom">'+
				'<table class="tablay"><tr>'+
				  '<td style="padding:2px 5px;">'+
					'<span style="font-size:18px;color:#333;">'+tim.subject+'</span><br>'+
					'<span style="float:right;display:block;color:#aaa;font-size:12px;padding-right:5px;">'+
						'<i class="icon icon-preview"></i> '+tim.views+'&nbsp;&nbsp;&nbsp;'+
						'<i class="icon icon-comment"></i> '+tim.replies+
					'</span>'+
				'</tr></table></div>';
			// 第1楼
			var post = data.Variables.postlist[0];
			var avatar = dz_avatar(post['authorid']);
			var attachments = [];
			var attachfiles = [];
			if (post.attachments) {
				for (var i in post.attachments) {
					var am = post.attachments[i];
					if (!am.url) continue;
					if (am.isimage=='1') {
						var img = '<img src="'+am.url+am.attachment+'">';
						attachments.push(img);
					} else {
						var fname = am.filename;
						if (fname=='Untitled') fname="点击下载附件";
						var dwn = '<a href="'+am.url+am.attachment+'" '+
                            'style="color:#2366A8;text-decoration:underline;font-size:13px;">'+fname+
                            ' ('+am.attachsize+', 下载: '+am.downloads+')</a>';
						attachfiles.push(dwn);
					}
				}
			}
            var delbtn = '';
            if (dz.groupid==1) {
				delbtn = '<br><a href="javascript:;" name="threaddel" data-fid="'+data.Variables.fid+'">删除</a>';
			}
			code += '<div>'+
					'<div class="weui_cell" style="padding:5px;">'+
                      '<div class="weui_cell_hd">'+
						'<img src="'+avatar+'" style="border-radius:300px;width:30px;height:30px;vertical-align:top;">'+
					  '</div>'+
					  '<div class="weui_cell_bd weui_cell_primary">'+
						'<span style="margin:0 8px;display:inline-block;font-size:12px;color:#333;">'+post.author+'<br>'+
                        '<span style="float:left;font-size:11px;color:#999;">'+post.dateline+'</span></span>'+
				      '</div>'+
                      '<div class="weui_cell_ft" style="font-size:11px;color:#aaa">1楼'+
                        delbtn+
                      '</div>'+
					'</div>'+
					'<div style="padding:5px;word-break:break-all;" class="content-div">'+
					  '<div id="submessage">'+post.message+'</div><br>'+attachments.join("")+''+attachfiles.join("<br>")+'</div>'+
				'</div>';
			jQuery('#vth-topdiv-'+tid).html(code);
			//////////////////////////////////////////////
			var oripaper = jQuery('#oripaper').html();
			if (oripaper!='') {
				jQuery('#submessage').html(oripaper);
			}
			//////////////////////////////////////////////
			//event
			jQuery("[name=threaddel]").click(function(){
				var fid = jQuery(this).data('fid');
				MWT.confirm({msg:"确定删除该主题吗？"},function(){
					delthread(fid);
				});
			});
		}	

		function getcell(post) {
			var avatar = dz_avatar(post['authorid']);
			var code = '<div class="mwt-border-bottom">'+
					'<div class="weui_cell" style="padding:5px;">'+
                      '<div class="weui_cell_hd">'+
						'<img src="'+avatar+'" style="border-radius:300px;width:30px;height:30px;vertical-align:top;">'+
					  '</div>'+
					  '<div class="weui_cell_bd weui_cell_primary">'+
						'<span style="margin:0 8px;display:inline-block;font-size:12px;color:#333;">'+post.author+'<br>'+
                        '<span style="float:left;font-size:11px;color:#999;">'+post.dateline+'</span></span>'+
				      '</div>'+
                      '<div class="weui_cell_ft" style="font-size:11px;color:#aaa">'+post.number+'楼</div>'+
					'</div>'+
					'<div style="padding:5px;" class="content-div">'+post.message+'</div>'+
				'</div>';
			return code;
		}

		// 显示回帖列表
		function show_list(data, page) {
			var list = [];
            var currentPageSize = data.Variables.postlist.length;
			for (var i=0; i<currentPageSize; ++i) {
				var post = data.Variables.postlist[i];
				if (post.number==1) continue;
				list.push(getcell(post));
			}
            var basediv = 'vthdiv-'+tid;
			var rd = page==1 ? basediv : basediv+'-'+page;
			var code = list.join('');
			if (has_next_page(page, data.Variables.thread.replies, data.Variables.ppp, currentPageSize)) {
				var nextpage = page+1;
				code += '<div id="'+basediv+'-'+nextpage+'">'+
					'<button id="'+basediv+'-nbtn" data-page="'+nextpage+'" class="nextbtn">点击加载下一页</button>'+
				'</div>';
			}
			if (page==1 && code=='') {
				code = '<p align="center" style="color:#aaa;font-size:13px;margin-top:5px;">暂无回复</p>';
			}
			jQuery('#'+rd).html(code);
			jQuery('#'+basediv+'-nbtn').unbind('click').click(function(){
				var pg = jQuery(this).data('page');
				query(pg);
			});
		};

	var o={};
	o.open = function(animate,_tid) {
		tid=_tid;
		init();
		require('common/backtop').init(50);
	};
	return o;
});
