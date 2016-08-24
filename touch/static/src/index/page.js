/* 首页 */
define(function(require){
	var loc = require("common/location");
	var IndexTab=require("./index_tab");
    var ajax=require('ajax');
	var o={};
	var tab;
	var allfids;

	function init() {
		var pagebody = '<div style="margin:40px 0 45px;background-color:#f2f2f2;">'+
				'<div id="indexbannerdiv" style="width:100%;height:160px;background:#eee;"></div>'+
				'<div id="indexhotdiv" style="background:#fff;"></div>'+
				'<div id="herad-div"></div>'+
				'<div id="indexbodydiv" style="margin-top:10px;"></div>'+
				require('common/copyright').footer()+
			'</div>'+
			'<div id="headdiv" style="position:fixed;top:0;left:0;right:0;"></div>';
		
		jQuery("body").append(pagebody).css('background','#f2f2f2');
		
		var topbar = require("common/header").createHeader({
			render: 'headdiv',
			items:[
				'uc',
				{label:'<h1>'+dz.bbname+'</h1>'},
				'search'
			]
		});
		topbar.create();

		init_banner();
		allfids = require('data/forum').getAllForumIds();
		tab = new IndexTab('indexbodydiv',query);
		tab.init();
		init_hot_forum();

		////////////////////////
		require('ad/global_full_ad').init();
		require('ad/horizontal_ad').init('herad-div');
	};

	// 初始化banner区
	function init_banner() {
		var images = [];
		for (var i=0; i<bigstyle_conf.banners.length; ++i) {
			var bn = bigstyle_conf.banners[i];
			images.push({
				url: bn.image,
				handler: function(idx){window.location=bigstyle_conf.banners[idx].href;}
			});
		}
		var slide=new MWT.Slide({
            render: 'indexbannerdiv',
            autoplay: 0,
            images: images
        });
        slide.create();
	}

	// 初始化热门版块区
	function init_hot_forum() {
		var hotforums = require('data/forum').getHotForums();
		if (hotforums.length==0) return;
		//console.log(hotforums);
		var code = '<div class="weui_cells_title mwt-border-bottom" style="margin:0;">热门版块</div>'+
			'<div id="indexhotdiv-f"></div>';
		jQuery('#indexhotdiv').html(code);

		var n = hotforums.length<4 ? hotforums.length : 4;
		var list = [];
		for (var i=0; i<n; ++i) {
			var fim = hotforums[i];
			var code = '<div name="ffsasdw" data-fid="'+fim.fid+'"><img src="'+fim.icon+'" style="width:30px;height:30px;">'+
					'<br><span style="font-size:14px;">'+fim.name+'</span></div>';
			list.push({html:code});
		}
		var tabbox = new MWT.TabBox({
			render: 'indexhotdiv-f',
			size: '1x'+n,
			border: false,
			cellStyle: 'text-align:center;padding:5px 0;line-height:20px;',
			items: list
		});
		tabbox.on('show',function(){
			jQuery('[name=ffsasdw]').click(function(){
				var fid = jQuery(this).data('fid');
				loc.forumdisplay(fid);
			});
		});
		tabbox.show();
	}

    function query(idx,page) {
		//alert(idx+" - "+page); return;
		var api = 'version=4';
		var limit = 20; //!< 最新帖子每页大小
		switch (idx) {
			case 1: 
				var start = (page-1) * limit;
				api += '&module=newthreads&fids='+allfids.join(',')+"&start="+start+"&limit="+limit; break;
			case 2: api += '&module=hotthread'; break;
			default: return;
		}
		MWT.show_loading();
		ajax.post(api,{},function(res){
			MWT.hide_loading();
			var pageSize = idx==1 ? limit : parseInt(res.Variables.perpage);
			tab.show_list(res, page, pageSize);
		});
    };

	o.open = function(animate) {
		init();
		require('common/backtop').init(50);
	};

	return o;
});
