/* 表情包 */
define(function(require){
	var txtobj;
	var inserted_smiles = [];
	var bottombar;
	var keys = [];

	/*
	// 在光标之后添加str
	function insertText(obj,str) {  
		if (document.selection) {  
			var sel = document.selection.createRange();  
			sel.text = str;  
		} else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {  
			var startPos = obj.selectionStart,  
			endPos = obj.selectionEnd,  
			cursorPos = startPos,  
			tmpStr = obj.value;  
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);  
			cursorPos += str.length;  
			obj.selectionStart = obj.selectionEnd = cursorPos;  
		} else {  
			obj.value += str;  
		}  
	}

	// 在光标之后删除str
	function removeText(obj,str) {
		if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {  
			var startPos = obj.selectionStart,  
			endPos = obj.selectionEnd,  
			cursorPos = startPos,  
			tmpStr = obj.value;  
			obj.value = tmpStr.substring(0, startPos-str.length) + tmpStr.substring(endPos, tmpStr.length);  
			cursorPos -= str.length;  
			obj.selectionStart = obj.selectionEnd = cursorPos;  
		} else {  
			var n = obj.value.length - str.length;
			var v = obj.value.substring(0, n);
			obj.value = v;
		}
	}

 	// 添加表情代码
	function addsmiley(smilecode) {
		insertText(txtobj,smilecode);
		//txtobj.value += smilecode;
		inserted_smiles.push(smilecode);
	}

	// 删除表情代码
	function popsmiley() {
		var code = inserted_smiles.pop();
		if (code) {
			removeText(txtobj,code);
		}
	}*/

	// 显示一个表情包
	function getsmileyoftype(idx) {
		var typeim = smilies_type['_'+idx];
		var urlroot = smileyroot+'/'+typeim[1];
		var list = smilies_array[idx][1];
		var code = '';
		for (var i=0; i<list.length;++i) {
			var im = list[i];
			code += '<img src="'+urlroot+'/'+im[2]+'" style="width:20px;height:20px;padding:10px;"'+
                    ' name="smileybtn" data-code="'+im[1]+'"/>';
		}
		return code;
	}

	// 切换表情包
	function switchsmilies(idx) {
		var k = keys[idx];
		var idx = k.substr(1);
		var typeim = smilies_type['_'+idx];
		var urlroot = smileyroot+'/'+typeim[1];
		var list = smilies_array[idx][1];
        var cols = 9;
		var width = (100/cols)+'%';
		var code = '<table style="windth:100%"><tr>';
		for (var i=0; i<list.length;++i) {
			var im = list[i];
			var img = '<img src="'+urlroot+'/'+im[2]+'" style="width:20px;height:20px;padding:10px;"'+
                    ' name="smileybtn" data-code="'+im[1]+'"/>';
			if (i>0 && i%cols==0) code += '</tr><tr>';
			code += '<td width="'+width+'" align="center">'+img+'</td>';
		}
		while (i%cols) {code+='<td width="'+width+'"></td>'; ++i;}
		code += '</tr></table>';
		jQuery('#smiley-panel-div').html(code);
		// 表情点击事件
		jQuery('[name=smileybtn]').unbind('click').click(function(){
			var code = jQuery(this).data('code');
			//addsmiley(code);
			txtobj.value+=code;
		});
	} 

	function initpanel() {
/*
		jQuery('#smileydelbtn').click(function(){
			//popsmiley();
		});
*/
		var items = [];
		for (var k in smilies_type) {
			var typeim = smilies_type[k];
			if (typeim.length==2) {
				items.push({label:'<span style="padding:0 3px;">'+typeim[0]+'</span>',width:'auto;',handler:switchsmilies});
				keys.push(k);
			}
		}
		var bar = new MWT.ScrollBar({
			render: 'smiley-bar-div',
			items: items
		});
		bar.create();
		bar.active(0);
	}

    var o={};
	o.open = function(txtid) {
		if (bigstyle_conf.plugin_type==0) {
			mwt.alert('未安装或未启用模板配套插件');
			return;
		}

		//$txt = jQuery('#'+txtid);
		txtobj = mwt.$(txtid);
		if (!bottombar) {
			bottombar = new MWT.SideBar({
        		render: 'siderbottom',
        		position: 'bottom',
        		height: '240px',
        		bodyStyle: "background-color:#fff;padding:0;",
        		pagebody: '<div id="smiley-bar-div" class="mwt-border-bottom" style="padding:0 5px;"></div>'+
					"<div id='smiley-panel-div'></div>"
    		});
			bottombar.on('open',initpanel);
		}
		bottombar.open();
		//addsmiley(':lol');
	};
	return o;
});
