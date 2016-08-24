/* 回到顶部 */
define(function(require){
	var o={};
	o.init = function(bottom) {
		var bth = bottom ? bottom : 10;
		var dv=MWT.create_div('mwt-backtop-div');
		var code = '<a href="javascript:;" id="bktopbtn" '+
            'style="display:block;border-radius:400px;width:30px;height:30px;line-height:30px;'+
              'text-align:center;background:rgba(0,0,0,0.4)">'+
			    '<i class="icon icon-up" style="color:#fff;font-size:16px;"></i></a>';
		jQuery('#'+dv).html(code).
			css({position:'fixed',bottom:bth+'px',right:'10px',display:'none'});

		jQuery(window).scroll(function() {
			if (jQuery(this).scrollTop() != 0) {
                jQuery('#'+dv).fadeIn('fast');
			} else {
                jQuery('#'+dv).fadeOut('fast');
            }
        });

		jQuery('#bktopbtn').click(function(){
			jQuery('body,html').animate({ scrollTop: 0 }, 500);
		});
	};
	return o;
});
