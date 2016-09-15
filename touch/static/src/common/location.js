/* 网页跳转 */
define(function(require){
    var o={};

	// 返回(如果有history)
	o.back = function(defaultUrl) {
		if (window.history.length>1) {
            window.history.back();
        } else if (defaultUrl) {
            window.location = defaultUrl;
        }
	};

	// 显示论坛
	o.forumdisplay = function(fid) {
		if (dz.diylink) {
			window.location = "forum.php?forumdisplay=1&fid="+fid+"&mobile=2";
		} else {
			window.location = "forum.php?mod=forumdisplay&fid="+fid+"&mobile=2";
		}
	};

	// 查看帖子(主题)
	o.viewthread = function(tid) {
		if (dz.diylink) {
			window.location = "forum.php?viewthread=1&tid="+tid+"&mobile=2";
		} else {
			window.location = "forum.php?mod=viewthread&tid="+tid+"&mobile=2";
		}
	};

	// 查看文章
	o.viewarticle = function(aid) {
		if (dz.diylink) {
			window.location = "forum.php?viewarticle=1&aid="+aid+"&mobile=2";
		} else {
			window.location = "portal.php?mod=view&aid="+aid+"&mobile=2";
		}
	};

	return o;
});

