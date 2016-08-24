/* 查看文章 */
define(function(require){
	var exmsg = require('common/exmsg');
	var ajax=require('ajax');
	var aid;

	function show_title(art)
	{
		var code = '<p style="font-size:20px;padding:0 10px;">'+art.title+'</p>'+
			'<span style="font-size:13px;color:#999;">'+date('Y-m-d',art.dateline)+"&nbsp;&nbsp;"+art.author+'</span>';
		jQuery('#article-title').html(code);
	}

	function show_content(list)
	{
		var code = '';
		for (var i=0;i<list.length;++i) {
			code += list[i].content;
		}
		jQuery('#article-content').html(code);
	}

	function show_related_articles(list)
	{
		if (list.length==0) return;
		var code = '<div class="weui_cells_title"><span class="blocktitle" style="margin-left:5px;">相关阅读</span></div><div class="weui_cells">';
		for (var i=0;i<list.length;++i) {
			var im=list[i];
			var pic = (im.pic!='') ? im.pic : bigstyle_conf.portal.default_pic;
			code += '<div class="weui_cell" name="relatedart" data-aid="'+im.aid+'">'+
				'<div class="weui_cell_hd"><img src="'+pic+'" style="width:40px;height:30px;margin-right:10px;"></div>'+
				'<div class="weui_cell_bd weui_cell_primary" style="font-size:15px;color:#333;">'+im.title+
					'<span style="font-size:13px;color:#999;display:inline-block;">'+date('Y-m-d',im.dateline)+'</span>'+
				'</div>'+
			'</div>';
		}
		code += '</div>';
		jQuery('#article-related').html(code);
		jQuery('[name=relatedart]').unbind('click').click(function(){
			var aid = jQuery(this).data('aid');
			window.location = 'portal.php?mod=view&aid='+aid+'&mobile=2';
		});
	}

	function init() {
		var pagebody = '<div id="viewarticle-div" style="margin:40px 0 40px;">'+
			'<div id="article-title" style="text-align:center;padding:10px 0;background:#fff" class="mwt-border-bottom"></div>'+
			'<div id="article-content" style="background:#fff;"></div>'+
			'<div id="article-related"></div>'+
			'<div class="weui_cells_title"><span class="blocktitle" style="margin-left:5px;">文章评论</span></div>'+
			'<div class="weui_cells">'+
			  '<div id="article-comment-1"></div>'+
			'</div>'+
		'</div>'+
		'<div id="headdiv" style="position:fixed;top:0;left:0;right:0;"></div>'+
		'<div id="footdiv" style="position:fixed;bottom:0;left:0;right:0;"></div>';
		jQuery("body").append(pagebody);

		var topbar = require("common/header").createHeader({
			render: 'headdiv',
			items:[
				'back',
				'home',
				{label:'<h1>查看文章</h1>'},
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
				{icon:'icon icon-comment',label:'评论',handler:function(){
					MWT.prompt({title:'评论文章',top:50,multiLine:true},postcomment);
				}}/*,
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
						}}*/
			]
		});
		if (bigstyle_conf.plugin_version>=1.8) {
			footer.create();
		}

		MWT.show_loading();
		ajax.post2('portal&action=viewarticle',{aid:aid},function(res){
			MWT.hide_loading();
			if (res.retcode!=0) {
				jQuery('#viewarticle-div').html(exmsg.error(res.retmsg));
			} else {
				show_title(res.data.article);
				show_content(res.data.contents);
				show_related_articles(res.data.related_articles);
				require('./comment').query(aid,1);
			}
		});
	}

	// 发表评论
	function postcomment(msg) {
		ajax.post2('portal&action=comment',{aid:aid,message:msg},function(res){
			if (res.retcode!=0) {
				MWT.alert(res.retmsg);
			} else {
				MWT.toast({msg:"评论成功",time:1500},function(){
        		});
				require('./comment').query(aid,1);
			}
		});
	}

	var o={};
	o.open=function(animate,_aid){
		aid=_aid;
		init();
		require('common/backtop').init();
	};
	return o;
});
