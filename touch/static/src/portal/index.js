/* 门户首页 */
define(function(require){
	var exmsg = require('common/exmsg');
	var loc = require("common/location");
	var channel_panel = require('./channel_panel');
	var ajax=require('ajax');
	var channellist=[];
	var channelbar;
	var catid=0;

	function query_channel(idx) {
		var im = channellist[idx];
		//print_r(im);
		require('./channel_body').show_channel(im.catid);
	}

	function init_channellist(list)
	{
		channellist=[];
		var bodydivs = [];
		var activeidx=0;
		for (var i=0;i<list.length;++i) {
			var im=list[i];
			var width=10+15*(im.catname.length);
			channellist.push({
				catid: im.catid,
				label: im.catname,
				width: width,
				handler:query_channel
			});
			bodydivs.push('<div name="channelbodydiv" id="channelbodydiv-'+im.catid+'"></div>');
			if (im.catid==catid) activeidx=i;
		}
		jQuery('#portal-div').html(bodydivs.join(''));
		channelbar = new MWT.ScrollBar({
			render: 'channelbar-div',
			items: channellist
		});
		channelbar.create();
		channel_panel.init(channellist);
		o.active_channel(activeidx);
	}

	function init() {
		var pagebody = '<div id="channelbar-div" '+
			  'style="position:fixed;top:40px;left:0;right:45px;height:35px;background:#fff;" class="mwt-border-bottom"></div>'+
			'<div id="downbtndiv" class="mwt-border-bottom"'+
              'style="position:fixed;top:40px;right:0;width:45px;height:35px;line-height:35px;text-align:center;background:#fff;">'+
				'<i class="icon icon-down" style="color:#666;" id="channellistdownbtn"></i>'+
            '</div>'+
            '<div id="portal-div" style="margin-top:75px;position:relative;">'+
			'</div>';
		jQuery("body").append(pagebody);

		jQuery('#channellistdownbtn').click(function(){
			channel_panel.open();
		});

		var topbar = require("common/header").createHeader({
			render: 'headdiv',
			items:[
				'uc',
				{label:'<h1>'+bigstyle_conf.portal.title+'</h1>'},
				'search'
			]
		});
		topbar.create();

		if (bigstyle_conf.plugin_type<2) {
			var code = exmsg.portal_disable();
			jQuery('#channelbar-div').hide();
			jQuery('#downbtndiv').hide();
			jQuery('#portal-div').html(code);
		} else {
			ajax.post2('portal&action=channellist',{},function(res){
				if (res.retcode!=0) {
					jQuery('#channelbar-div').hide();
					jQuery('#downbtndiv').hide();
					jQuery('#portal-div').html(exmsg.error(res.retmsg));
				} else {
					init_channellist(res.data);
				}
			});
		}
	}

	var o={};
	o.active_channel=function(idx) {
		channelbar.active(idx);
	};
	o.open=function(animate,_catid){
		catid=_catid
		init();
		//////////////////////
		require('ad/global_full_ad').init();
		require('common/backtop').init(50);
	};
	return o;
});
