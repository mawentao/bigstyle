define(function(require){
    var o={}; 
	// 创建headerbar(保持统一风格)
    o.createHeader = function(opts) {
		opts['position'] = 'top';
		opts['cls'] = 'headbar';
        if (!opts.height) opts['height'] = 40;
		var items = [];
		for (var i=0;i<opts.items.length;++i) {
			var im=opts.items[i];
			switch (im) {
				case 'back':
					items.push({
						type:'back',width:40,style:"font-size:20px;margin-top:5px;display:inline-block;"
					});
					break;
				case 'home':
					items.push({
			        	icon:'icon icon-home',width:40,iconStyle:'font-size:18px;margin-top:5px;display:inline-block;',handler:function(){
							window.location="forum.php?mobile=2";
						}
					});
					break;
				case 'search':
					items.push({
						icon:'icon icon-search',width:40,iconStyle:'font-size:18px;margin-top:5px;display:inline-block;',handler:function(){
							window.location="search.php?mod=forum&mobile=2";
						}
					});
					break;
				case 'uc':
					items.push({
						icon:'icon icon-user',width:40,iconStyle:'font-size:18px;margin-top:5px;display:inline-block;',handler:function(){
							require('common/sidebar').open();
						}
					});
					break;
				default:
					items.push(im);
					break;
			}
/*
			if (im=='back') {
				items.push({
					type:'back',width:40,style:"font-size:20px;margin-top:5px;display:inline-block;"
				});
			}
			else if (im=='home') {
				items.push({
			        icon:'icon icon-home',width:40,iconStyle:'font-size:18px;margin-top:5px;display:inline-block;',handler:function(){
						window.location="forum.php?mobile=2";
					}
				});
			}
			else if (im=='search') {
				items.push({
			        icon:'icon icon-search',width:40,iconStyle:'font-size:18px;margin-top:5px;display:inline-block;',handler:function(){
						window.location="search.php?mod=forum&mobile=2";
					}
				});
			} 
			else items.push(im);
*/
		}
		opts.items=items;
		return new MWT.H5Navbar(opts);
	};
	// 创建headerbar icon(保持统一风格)
	o.getHeaderIconStyle = function() {
		return 'font-size:20px;margin-top:5px;';
	}
	return o;
});
