/* 发表回复 */
define(function(require){
	var header = require('common/header');
    var ajax=require('ajax');
	var h5page,tid,form,formhash;
	var callback; //!< 发帖成功后的回调函数
	
	function init() {
		form = new MWT.Form();
		form.addField('message', new MWT.TextField({
			type:'textarea',
			render: 'contentdiv',
            style: 'width:100%;height:200px;',
			value: '',
			placeholder: '说点什么吧~',
			errmsg: '内容不能超过1000个字符',
			checkfun: function(v){return v.length<=1024;}
		}));
		var seccode_display = 'none';
		if (dz.postseccheck!='0') {
			seccode_display = 'flex';
		    form.addField('seccodeverify', new MWT.TextField({
			    render: 'secdiv',
				value: '',
				placeholder: '验证码',
				style: 'width:120px;',
				errmsg: '内容不能超过1000个字符',
				checkfun: function(v){return v.length<=1024;}
		    }));
		}

		h5page = new MWT.H5Page({
            render: 'page-reply-'+tid, 
            header: header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					//require("common/location").back("forum.php?forumlist=1");
					h5page.close();
				}},
				{label:'<h1>发表回复</h1>'},
                {label:'回复',width:40,handler:o.submit}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div class="weui_cells weui_cells_form">'+
				'<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary" id="contentdiv"></div></div>'+
				'<div class="weui_cell weui_vcode" style="display:'+seccode_display+'">'+
					'<div class="weui_cell_bd weui_cell_primary" id="secdiv"></div>'+
					'<div class="weui_cell_ft" id="secimg"></div>'+
				'</div>'+
            '</div>'
		});
		h5page.on("open", function(){
			form.create();
			require('common/seccode').create('secimg','width:150px;');
			form.reset();
		});
    };

	var o={};

	o.open = function(animate,_tid,_formhash,call) {
		tid = _tid ? _tid : 0;
		formhash = _formhash;
		if (tid==0) return;
		if (!h5page) init();
		callback = call ? call : null;
		h5page.setAnimate(animate).open();
	};

	o.submit = function() {
		var data = form.getData();
		//data.tid = tid;
		//data.fid = 42;
		data.formhash = formhash;
		//data.posttime = time();
		var api = "version=4&module=sendreply&replysubmit=yes&extra=&inajax=1&tid="+tid;
		ajax.post(api, data, function(res){
			if (res.Message && res.Message.messagestr) {
				if (res.Message.messageval == 'post_reply_succeed') {
					MWT.toast({msg:'回复成功'},function(){
						h5page.close();
						if (callback) callback();
					});
					return;
				}
				MWT.alert({msg:res.Message.messagestr});
				return;
			}
			MWT.alert("服务端异常,请刷新页面重试");
			console.log(res);
		});
	};

	return o;
});
