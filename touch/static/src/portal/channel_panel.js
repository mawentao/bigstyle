/* 频道选择panel */
define(function(require){
    var panel;
    var o={};

	o.init = function(channellist) {
		panel = new MWT.H5Page({
        	render: 'channelfpdiv',
           	animate: 'slideTop',
		   	header: new MWT.H5Navbar({
            	position: 'top',
            	cls: 'float_pannel mwt-border-bottom',
            	//bordered: true,
            	bodyStyle: 'background:#fff',
            	height: 40,
            	items: [
					{label:'<span style="font-size:16px;">选择频道</span>',width:100},
               		{label:''},
               		{icon:'icon icon-delete',iconStyle:'font-size:16px;',width:40,handler:function(){panel.close();}}
           		]
        	}),
        	bodyStyle: "background-color:#fff;padding:0;",
        	pagebody: "<div id='channelfp-bodydiv'></div>"
    	});

		var items = [];
		for (var i=0;i<channellist.length;++i) {
			var im=channellist[i];
			items.push({
				html:'<table class="tablay"><tr><td style="height:80px;vertical-align:middle;padding:0 5px;">'+
                     im.label+'</td></tr></table>',
				handler:function(idx) {
					panel.close();
					require('./index').active_channel(idx);
				}
			});
		}
		var cols = 4;
		var rows = Math.ceil(channellist.length/cols);

		var tabbox = new MWT.TabBox({
			render: 'channelfp-bodydiv',
			size: rows+'x'+cols,
			border: true,
			cellStyle: 'text-align:center;',
			items: items
		});
		panel.on('open',function(){
			tabbox.show();		
		});
	};
	o.open=function(){
		panel.open();
	};
	return o;
});
