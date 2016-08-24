/* 用户登录&注销 */
define(function(require){
	var ajax=require('ajax');
	var o={};

	o.login = function() {
		window.location = dz.loginurl;
	};

	o.logout = function() {
		var formhash = ajax.getFormHash();
		if (!formhash || formhash=='') {
			ajax.post('version=4&module=profile',{},function(res){
				formhash = res.Variables.formhash;
			},true);
		}
		var api = 'version=4&module=login&action=logout&formhash='+formhash;
		ajax.post(api,{},function(res){
			MWT.toast({msg:'您已退出登录'},function(){
				window.location = "forum.php?uc=1";
				//window.location.reload();
			});
		});
	};

	return o;
});
