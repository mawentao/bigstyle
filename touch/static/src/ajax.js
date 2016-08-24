/* ajax封装 */
define(function(require){
    var _cache = {};
    var o = {};
	var formhash='';

    o.getAjaxUrl = function(module) {
        return dz.mobileapi+"?"+module;
    };

	o.getFormHash = function() {
		return formhash;
	};

    o.ajaxrequest=function(method, url, params, callbackfun, sync) {
        //if(!noanimation) show_loading();
        jQuery.ajax({
            url: url,
            type: method,
            dataType: "json",
            data: params,
            async : sync ? false : true,
            complete: function(res) {
                //if(!noanimation) hide_loading();
            },
            success: function(res) {
				if (res.Variables && res.Variables.formhash) formhash = res.Variables.formhash;
                callbackfun(res);
                //else {
                //    MWT.alert({msg:res.retmsg});
                //}
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var errmsg = "Error("+XMLHttpRequest.readyState+") : "+textStatus;
				console.log(errmsg);
				MWT.alert("啊哦~~页面发生了错误，刷新下看看~~");
            }
        });
    };

	// POST方式提交Ajax请求(disucz原生接口)
    o.post3 = function(url,params,callbackfun,sync) {
        jQuery.ajax({
            url: url,
            type: 'post',
            dataType: "xml",
            data: params,
            async : sync ? false : true,
            complete: function(res) {
            },
            success: function(res) {
				callbackfun(res);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var errmsg = "Error("+XMLHttpRequest.readyState+") : "+textStatus;
				console.log(errmsg);
				MWT.alert("啊哦~~页面发生了错误，刷新下看看~~");
            }
        });
	};

	// POST方式提交Ajax请求(bigstyle_api接口)
	o.post2 = function(cachekey, params, callbackfun, noanimation) {
		if (!bigstyle_api) {
			MWT.alert("请安装BigStyle模板配套插件");
		}
		var url = bigstyle_api+cachekey;
        o.ajaxrequest("post", url, params, callbackfun, noanimation);
	};

    // POST方式提交Ajax请求
	o.post = function(cachekey, params, callbackfun, noanimation) {
        var url = o.getAjaxUrl(cachekey);
        o.ajaxrequest("post", url, params, callbackfun, noanimation);
    };

    // GET方式提交Ajax请求
    o.get = function(method, cachekey, params, callbackfun, noanimation) {
        var url = o.getAjaxUrl(cachekey);
        o.ajaxrequest("get", url, params, callbackfun, noanimation);
    };

    // 读取缓存，如果缓存不存在再ajax请求
    o.loadcache = function(cachekey, callbackfun, noanimation) {
        if (_cache[cachekey]) {
	        callbackfun(_cache[cachekey]);
        } else {
            this.post(cachekey, {}, function(res){
                _cache[cachekey] = res;
                callbackfun(res);
            }, noanimation);
        }
    };

    // 根据cachekey清除缓存
    o.unsetcache = function(cachekey) {
        _cache[cachekey] = null;
    };

    // 清除所有缓存
    o.clearcache = function() {
        _cache = {};
    };

    return o;
});
