/* 发表主题 */
define(function(require){
	var common_header = require('common/header');
    var ajax=require('ajax');
	var forumData = require('data/forum');
	var h5page,fid,form;
	var callback; //!< 发帖成功后的回调函数
	var attachnew={};
	
	function init() {
		form = new MWT.Form();
		form.addField('subject', new MWT.TextField({
            render: 'titlediv',
            value: '',
            placeholder: '标题',
            errmsg: '标题不能超过35个字符',
			style: 'width:'+(dz.bodyWidth-50)+'px',
            checkfun: function(v){return v.length<=35;}
        }));
		form.addField('message', new MWT.TextField({
			type:'textarea',
			render: 'contentdiv',
            style: 'width:100%;height:170px;',
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
            render: 'page-forum-'+fid,
            header: common_header.createHeader({ items:[
				{icon:'icon icon-left',iconStyle:'font-size:20px;margin-top:5px;',width:40,handler:function(){
					require("common/location").back("forum.php?forumlist=1");
                }},
				{label:'<h1>发新帖</h1>'},
                {label:'发帖',width:40,handler:o.submit}
			]}),
			bodyStyle: "background-color:#f2f2f2;padding:0;",
			pagebody: '<div class="weui_cells weui_cells_form" style="margin-top:0;">'+
				'<div class="weui_cell weui_cell_select">'+
                  '<div class="weui_cell_bd weui_cell_primary">'+
                    '<select class="weui_select" id="forumsel"></select>'+
                  '</div>'+
                '</div>'+
				'<div class="weui_cell weui_cell_select" id="typeseldiv" style="display:none;">'+
                  '<div class="weui_cell_bd weui_cell_primary">'+
                    '<select class="weui_select" id="typesel"></select>'+
                  '</div>'+
                '</div>'+
				'<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary" id="titlediv"></div></div>'+
				'<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary" id="contentdiv"></div></div>'+
				'<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary">'+
///*
					'<div class="weui_uploader"><div class="weui_uploader_bd">'+
					  '<ul id="attaul" class="weui_uploader_files mwt-imgup-ul" style="display:block;"></ul>'+
					  '<div class="weui_uploader_input_wrp">'+
						'<form method="POST" enctype="multipart/form-data"></form>'+
                          '<input id="picup-newth" name="Filedata" class="weui_uploader_input" type="file" accept="image/jpg,image/jpeg,image/png,image/gif">'+
						'</form>'+
                      '</div>'+
					'</div></div>'+
//*/
				'</div></div>'+
				'<div class="weui_cell weui_vcode" style="display:'+seccode_display+'">'+
					'<div class="weui_cell_bd weui_cell_primary" id="secdiv"></div>'+
					'<div class="weui_cell_ft" id="secimg"></div>'+
				'</div>'+
            '</div>'+
				require('common/copyright').footer()
		});
		h5page.on("open", function(){
			form.create();
			require('common/seccode').create('secimg','width:150px;');
			form.reset();
			query();
			jQuery('#attaul').html();
			jQuery('#picup-newth').change(forumupload);
		});
	};

	// 上传图片附件
	function forumupload() {
		jQuery.ajaxFileUpload({
            url: ajax.getAjaxUrl('version=4&module=forumupload&type=image&inajax=yes&infloat=yes&simple=2'),
            secureuri: false,
            fileElementId: 'picup-newth',
            //dataType: 'json',
		    data: {uid:dz.uid, hash:dz.hash},
            timeout: 30000,
            complete: function(res) {
            	jQuery('#picup-newth').change(forumupload);
            },  
            success: function(res,status) {
			    var text = res.body.innerHTML;
				var arr = text.split("|");
				var imgid = arr[3];
				attachnew[imgid] = {'description':''};
				var imgurl = 'data/attachment/forum/'+arr[5];
				var imgdiv = '<li id="upimg-'+imgid+'">'+
                          '<img src="'+imgurl+'" style="max-width:90px;max-height:90px;">'+
                          '<i name="upimg-del" data-idx="'+arr[3]+'" class="fa fa-minus-circle"></i>'+
                        '</li>';
				jQuery('#attaul').append(imgdiv);
				jQuery('[name="upimg-del"]').unbind('click').click(function(){
					var idx = jQuery(this).data('idx');
					jQuery('#upimg-'+idx).html('');
					delete attachnew[idx];
				});
            },
            error: function (res, status, e) {
			    //alert(e);
            }   
        });
	};

	// 查询论坛板块
    function query() {
		var code = forumData.getForumSelectOptions();
		jQuery("#forumsel").html(code);
		if (fid!=0) {
			set_select_value('forumsel',fid);
		} 
		query_thread_types();
		jQuery('#forumsel').unbind('change').change(query_thread_types);
    };

	// 查询版块的主题分类列表
	function query_thread_types() {
		jQuery('#typesel').html('<option value="0">请选择主题分类</option>');
		var v = get_select_value('forumsel');
		var types = forumData.getForumThreadTypes(v);
		if (types && types.length) {
			var options = '<option value="0">请选择主题分类</option>';
			for (var i=0; i<types.length; ++i) {
				var tim = types[i];
				options += '<option value="'+tim.tid+'">'+tim.name+'</option>';
			}
			jQuery('#typesel').html(options);
			jQuery('#typeseldiv').show();
		} else {
			jQuery('#typesel').html('<option value="0">请选择主题分类</option>');
			jQuery('#typeseldiv').hide();
		}
	}


	var o={};

	o.open = function(animate,_fid,call) {
		if (dz.uid==0) {
			require("member/login").login();
			return;
		}
		if (!h5page) init();
		fid = _fid ? _fid : 0;
		callback = call ? call : null;
		h5page.setAnimate(animate).open();
	};

	o.submit = function() {
		var data = form.getData();
		data.fid = get_select_value('forumsel');
		data.typeid = get_select_value('typesel');
		data.attachnew = attachnew;
		if (data.fid==0) {
			MWT.alert("请选择版块");
			return;
		}
		data.formhash = ajax.getFormHash();
		data.posttime = time();
		data.topicsubmit = 'yes';
		var api = "version=4&module=newthread&extra=&inajax=1";
		ajax.post(api, data, function(res){
			if (res.Message && res.Message.messagestr) {
				if (res.Message.messageval == 'post_newthread_succeed') {
					MWT.toast({msg:'发帖成功'},function(){
						//h5page.close();
						//if (callback) callback();
						require("common/location").forumdisplay(data.fid);
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
