/**
 * TblSelectJs
 * 
 * @note
 * Make the TABLE element like a SELECT element.
 * 
 * @param param
 * - tbl_rap_slt : Wrapper element of TABLE element.
 * - fields : The class and name attribute of the value to be obtained from the TR element.
 * - selected_bg_color : Background color when selected.
 */
var TblSelect =function(param){
	
	
	this.param = param;
	
	this.tbl; // TABLE element.(jQuery object)
	
	var self=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		var param = _setParamIfEmpty(this.param);
		
		// Get TABLE element as jQuery object.
		self.tbl = $(param.tbl_rap_slt + ' table');
		
		// Add click event to TR element of TABLE element.
		self.tbl.find('tr').click(function(e){
			
			_clickTr(this);
		});
		
		this.param = param;
			
	}
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
	
		if(param['tbl_rap_slt'] == undefined){
			throw new Error("Please set a 'tbl_rap_slt'");
		}
		
		if(param['selected_bg_color'] == undefined){
			param['selected_bg_color'] = '#e77a72';
		}
		
		if(param['fields'] == undefined){
			param['fields'] = ['value','text'];
		}
		
		return param;
	}
	
	
	/**
	 * Click event of TR element.
	 * @param tr : Clicked TR element.
	 */
	function _clickTr(tr){
		
		var param = self.param;
		tr = $(tr);
		
		// Add "selected" attribute to TR element.
		var selected = tr.attr('selected');
		if(_empty(selected)){
			tr.attr('selected',true);
			tr.css('background-color',param.selected_bg_color);
		}else{
			tr.attr('selected',false);
			tr.css('background-color','');
		}

		
	}
	
	
	
	this.showTblSelect = function(btnElm){
		var form = $(self.param.tbl_rap_slt);

		_showForm(form,btnElm);
	}
	
	
	/**
	 * Selection by value.
	 * @param values : Selection value.Values can be set with array type and primitive type.
	 * @param field : Specify the element to which the value matches.Optional parameter. Default is 'value'.
	 */
	this.doSelect = function(values,field){
		
		if(typeof values != 'object'){
			values = [values];
		}
		
		if(!field){
			field = 'value';
		}
		
		// Loop by TR elements.
		var trs = self.tbl.find("tr");
		trs.each(function(){
			var tr = $(this);
			
			// Get value within TR element by the field.
			var value1 = _getValueByField(tr,field);
			
			// Loop to find matching elements.
			for(var i in values){
				var value2 = values[i];
				if(value1 == value2){
					
					// Make TR element selected.
					_clickTr(tr);
				}
			}
			
		});

	}
	
	
	
	
	
	/**
	 * Get data from the selected TR element.
	 */
	this.getData = function(){
		
		var param = self.param;
		var data = [];
		var fields = param.fields;
		
		// Get TR elements from selected only.
		var trs = self.tbl.find("tr[selected]");
		trs.each(function(){
			var tr = $(this);
			
			// Get entity data  from TR elements.
			var ent = {}; // entity
			for(var i in fields){
				var field = fields[i];
	
				// Get value within TR element by the field.
				var v = _getValueByField(tr,field);
				ent[field] = v
			}
			data.push(ent);
			
		});
		

		return data;
		
	}

	
	
	/**
	 * 行入替フォームを表示する
	 * 
	 * @param object form フォーム要素オブジェクト
	 * @param string triggerElm トリガー要素  ボタンなど
	 */
	function _showForm(form,triggerElm,form_position){
		
		if(!form_position){
			form_position = 'auto';
		}
		
		form.show();
		
		//トリガー要素の右上位置を取得
		triggerElm = $(triggerElm);
		var offset=triggerElm.offset();
		var left = offset.left;
		var top = offset.top;
		
		var ww = $(window).width();// Windowの横幅（ブラウザの横幅）
		var form_width = form.outerWidth();// フォームの横幅
		
		// フォーム位置Yをセット
		var trigger_height = triggerElm.outerHeight();
		var tt_top=top + trigger_height;
		
		var tt_left=0;// フォーム位置X
		
		// フォーム位置の種類毎にフォーム位置Xを算出する。
		switch (form_position) {
		
		case 'left':
			
			// トリガーの左側にフォームを表示する。
			tt_left=left - form_width;
			break;
			
		case 'center':

			// フォームを中央にする。
			tt_left=(ww / 2) - (form_width / 2);
			break;
			
		case 'right':
			
			// トリガーの右側にフォームを表示する
			tt_left=left;
			break;
			

		default:// auto

			// 基本的にトリガーの右側にフォームを表示する。
			// ただし、トリガーが右端付近にある場合、フォームは外側にでないよう左側へ寄せる。
			
			tt_left=left;
			if(tt_left + form_width > ww){
				tt_left = ww - form_width;
			}
			
			break;
		}

		if(tt_left < 0){
			tt_left = 0;
		}

		//フォーム要素に位置をセット
		form.offset({'top':tt_top,'left':tt_left });
	}
	
	
	/**
	 * Get value by the field.
	 * 
	 * @note
	 * Find the element that matches the field from the parent element and get its value.
	 * The field is class attribute or name attribute.
	 * 
	 * @param parElm : parent element.
	 * @param field 
	 * @returns
	 */
	function _getValueByField(parElm,field){
		var v = undefined;
		var elm = _findInParentEx(parElm,field);
		if(elm[0]){
			v = _getValueEx(elm);
		}
		return v;
	}
	
	
	/**
	 * Get value from elements regardless of tag type.
	 * @param elm : Value element.
	 * @returns Value from value element.
	 */
	function _getValueEx(elm){
		
		var v = undefined;
		var tagName = elm.prop("tagName"); 
		
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			
			var typ = elm.attr('type');

			if(typ=='checkbox'){
				
				v = 0;
				if(elm.prop('checked')){
					v = 1;
				}
				
			}
			
			else if(typ=='radio'){
				var opElm = form.find("[name='" + f + "']:checked");
				v = 0;
				if(opElm[0]){
					v = opElm.val();
				}
	
			}
			
			else{
				v = elm.val();

			}
			
		}else{
			v = elm.html();
		}
		return v;
	}
	
	
	
	/**
	 * Search for matched elements from the parent element regardless of class attribute, name attribute, id attribute.
	 * @param parElm : parent element.
	 * @param field : class, or name attribute
	 * @returns element.
	 */
	function _findInParentEx(parElm,field){
		var elm = parElm.find('.' + field);
		if(!elm[0]){
			elm = parElm.find("[name='" + field + "']");
		}else if(!elm[0]){
			elm = parElm.find('#' + field);
		}
		return elm;
	}
	
	
	// Check empty.
	function _empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	

	// call constractor method.
	this.constract();
}