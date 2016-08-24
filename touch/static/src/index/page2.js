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
		init_hot_forum();

		//
		var panel1 = new MWT.TabPanel({
            title: '最新帖子',
            body: '<div id="new_thread_list_div" class="weui_cells" style="margin:0;"></div>'
        });
        panel1.on('show',function(){
			var div = document.getElementById('thread_div_0');
            if (div && div.innerHTML!='') {
				jQuery('#new_thread_list_div').html(div.innerHTML);
				div.innerHTML='';
			}
        });

        var panel2 = new MWT.TabPanel({
            title: '热门帖子',
            body: '<div id="hot_thread_list_div" class="weui_cells" style="margin:0;"></div>'
        });
        panel2.on('show',function(){
			var div = document.getElementById('thread_div_1');
            if (div && div.innerHTML!='') {
				jQuery('#hot_thread_list_div').html(div.innerHTML);
				div.innerHTML='';
			}
        });
        
        var panel3 = new MWT.TabPanel({
            title: '精华帖子',
            body: '<div id="best_thread_list_div" class="weui_cells" style="margin:0;"></div>'
        });
        panel3.on('show',function(){
			var div = document.getElementById('thread_div_2');
            if (div && div.innerHTML!='') {
				jQuery('#best_thread_list_div').html(div.innerHTML);
				div.innerHTML='';
			}
        });
		var widget = new MWT.TabWidget({
            render: 'indexbodydiv',
            panels: [panel1,panel2,panel3],
            border: false,
            justify: true,
            style: 'border-radius:4px;',
            headerStyle: ''
        });
		widget.show().active(0);
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

	o.open = function(animate) {
		init();
		require('common/backtop').init(50);
		require('ad/global_full_ad').init();
		require('ad/horizontal_ad').init('herad-div');
	};

	return o;
});
