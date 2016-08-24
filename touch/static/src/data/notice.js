/* 消息 */
define('data/notice',function(){
	var ajax=require('ajax');
	var o={};
	var msglist = [];

	function sync() {
		var api = 'version=4&module=mynotelist';
		ajax.post(api,{},function(res){
			msglist = res.Variables.list;
		},true);
	}

	// 获取消息列表
	o.getlist = function() {
		if (msglist.length==0) {
			sync();
		}
		return msglist;
	};

	return o;
});
