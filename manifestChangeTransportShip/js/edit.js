var Global={};
var responseTypeCode;
$(function(){
	var tab=[];
	var head_tab={
		table:$('#headDiv'),	
		form:$('#headForm'),
		initElement:function(){
			NfhaValidateBuild.build({must:false,ignore:['id'],validateList:Manifest_8104_2,search:"Manifest-Declaration",$table:this.table,elementConfig:{notes:{opt:{height:70}},customsCode:getBaseDataOpt('CUSTOMS_CODE')}});
		},
		//增加表头控制编辑新增控制  By Zcs
		doDisable:function(isHide,rowData,$form){
			if (rowData.rows) {rowData = rowData.rows;}
			$form.children('#id').val(rowData.id);
			$form.find('.textbox-value').each(	function() {
				var name = $(this).attr('name'), $element = $form.find('#' + name);
				if(name=='gNo'||(responseTypeCode!=Constants.RecStatus_Temp&&(name=='bordertransportmeansId'||name=='journeyId')))
					$element.textbox({	disabled: isHide});			
				if($element.hasClass('textbox-f')) {
					$element.textbox({value:rowData[name]});// 设置表单数据	
				}
			});
			if(isHide){
				$form.children('div:last').children('a').hide();
			}else{
				$form.children('div:last').children('a').show();
			}
		},
		initForm:function(){
			var _form=this.form;
			var options={getUrl:function(){return manifestId?'manifestChangeTransportShip!update.action?id='+manifestId:'manifestChangeTransportShip!save.action'},getData:function(){
				var data=_form.serializeObject();
				data.id=manifestId;
				return data;
			},callback:function(result){
				if(result.message){
					manifestId=result.message;
				}
			}};
			appendLink(_form, options);
			if(manifestId){
				var num=2;
				$.messager.progress();
				$.get('manifestChangeTransportShip!getSingleByAjax.action',{id:manifestId},function(data){
					responseTypeCode=data.message.responseTypeCode;
					//head_tab.doDisable(permiCheck(data,Constants.AddEditPermi.head),data,_form);
					var flag=data.message.responseTypeCode!=Constants.RecStatus_Temp||data.message.reservation1=='1';
					head_tab.doDisable(flag,data.message,_form);
					if(--num==0){
						$.messager.progress('close');
					}
				},'json');
				$.get('manifestChangeList!getSimpleList.action',{manifestId:manifestId},function(list){
					Global.billList=list;
					if(--num==0){
						$.messager.progress('close');
					}
				},'json');
			}else{
				Global.billList=[];
			}
		},
		load:function(){
			if(!this.init){
				this.init=1;
				this.initElement();
				this.initForm();
			}
		}
	};
	
	var tempate_tab={
		initForm:function(){
			var _this=this,_form=this.form;
			_form.append('<input type="hidden" name="id" id="id" />');
			var $link_add=$('<a style="margin-left:50px;margin-top:-5px;" class="formBtn"></a>');
			_form.parent().prev().children('.panel-title').append($link_add);
			$link_add.linkbutton({text:'新增',iconCls:'icon-link-add',plain:true}).click(function(){
				head_tab.doDisable(false, {}, _form);
				_form.find('#id').val('');
				_form.form('reset');
			});
			var options={getUrl:function(){return _this.action+(_form.find('#id').val()?'!update.action':'!save.action')},getData:function(){
				if(_this.getParam){return _this.getParam();}
				var data=_form.serializeObject()
				data.manifestId=manifestId;
				data.gNo=_this.getGNo?_this.getGNo():'';
				return data;
			},callback:function(result, param){
				if(_this.saveCallback){
					_this.saveCallback(result, param);
				}
				_this.grid.datagrid('reload');
			}};
			appendLink(_form, options);
		},
		initGrid:function(){
			var _this=this;
			var options={border:true,fit:true,fitColumns:true,rownumbers:true,singleSelect:true,method:'get',pagination:true,loadMsg:'正在加载数据....',url:this.action+"!getPagingByAjax.action",queryParams:{manifestId:manifestId},onClickRow:function(index,data){
				var $form=_this.form;
				if(data.rows){
					data=data.rows;
				}
				$form.children('#id').val(data.id);
				$form.find('.textbox-value').each(function(){
					var name=$(this).attr('name'),$element=$form.find('#'+name);
					if($element.hasClass('combo-f')){
						$element.combobox('select',data[name]);
					}else{
						$element.textbox('setValue',data[name]);//设置表单数据
					}
				});
				
				//提单复制粘贴
				appendPasteButton($form);
				
			},onLoadSuccess:function(){
				_this.form.form('reset').form('disableValidation').find('#id').val('');
				//提单复制
				$('.hide').each(function(){
					var jsonstr=$(this).val();
					var json=eval('(' + jsonstr + ')');
					$(this).next().on('click',function(e){
						for(var name in json){
							copy_data[name]=json[name];
						}
						appendPasteButton(_this.form);
						e.stopPropagation();
					});
				});
			}};
			$.extend(options, this.gridOptions||{});
			this.grid.datagrid(options);
			initPaging(this.grid);
		},
		load:function(){
			if(!this.init){
				this.init=1;
				this.initElement();
				this.initGrid();
				this.initForm();
			}
		},
		query:function(){
			var data=this.queryForm.serializeObject();
			data.manifestId=manifestId;
			this.grid.datagrid("load",data);
		}
	}
	
	var columns=NfhaValidateBuild.getColumns({validateList:Manifest_8104_2, search:"Manifest-Declaration-billList",ignore:['id','manifestId']});
	columns.push({
		field:'functionCode',title:'功能代码',align:'center',width:60,
		formatter:function(value, data){
			return Constants.ManifestCode[value];
		}
	});
	columns.push({
		field:'responseTypeCode',title:'回执状态',align:'center',width:60,
		formatter:function(value, data){
			return Constants.RecStatus[value];
		},
	});	
	addOperateColumn(columns, 0);
	var bill_tab={
		table:$('#billDiv'),form:$('#billForm'),grid:$('#billTable'),action:'manifestChangeList',queryForm:$('#billConditionForm'),
		getGNo:function(){
			if(this.form.find('#id').val()){return null;}
			return Global.billList.length?Global.billList[Global.billList.length-1].gNo+1:1;
		},
		initElement:function(){
			NfhaValidateBuild.build({must:false,ignore:['id','manifestId','gNo'],validateList:Manifest_8104_2,search:"Manifest-Declaration-billList",$table:this.table});
			$('<div class="cbec-th" style="width:30%"></div>').insertBefore(this.table.children('.cbec-th:eq(2)'));
			var _this=this;
			$('#link_bill_search').click(function(){
				_this.query();
			});
		},
		gridOptions:{
			toolbar:'#tb_bill',title:'提运单列表',columns:[columns],onSelect:function(index,data){
				head_tab.doDisable(!permiCheck(data,Constants.EditPermi.bill[data.functionCode]),index, bill_tab.form);
			}
		},
		saveCallback:function(result){
			if(result.message){
				Global.billList.push({id:result.message,gNo:this.getGNo()});
			}
			else{
				var reset=false;
				for(var i=0;i<Global.billList.length;i++){
					var row=Global.billList[i];
					if(row.id==data.id){
						reset=row.transportContractDocumentId!=data.transportContractDocumentId||row.associatedTransportId!=data.associatedTransportId;//提运单与分提运单是否有修改
						row.transportContractDocumentId=data.transportContractDocumentId;
						row.associatedTransportId=data.associatedTransportId;
						break;
					}
				}
				if(reset){
					for(var i=0;i<2;i++){
						var tab=i==0?goods_tab:conta_tab;
						if(tab.init){
							var rows=tab.grid.datagrid('getRows');
							for(var j=0;j<rows.length;j++){
								tab.grid.datagrid('refreshRow',j);
							}
						}
					}
				}
			}
		}
	}
	$.extend(bill_tab,tempate_tab);
	
	tab[0]=head_tab;
	tab[1]=bill_tab;
	//tab[2]=goods_tab;
	//tab[3]=conta_tab;
	
	function appendLink($form,options){
		var div=$('<div style="padding-top:25px;float: left;width: 100%;padding-bottom: 5px;text-align: center;"><a></a><a style="margin-left:10px;"></a></div>');
		var $link_save=$('<a style="margin-left:10px;margin-top:-5px;" class="formBtn submitBtn"></a>');
		var $link_reset=$('<a style="margin-left:10px;margin-top:-5px;" class="formBtn submitBtn"></a>');
		if($form.parent().prev().children('.panel-title').children('a').length==0){
			$form.parent().prev().children('.panel-title').append('<a href="javascript:void(0)" class="formBtn submitBtn" style="margin-left:40px;margin-top:-5px;"></a>');
		}else{
			$form.parent().prev().children('.panel-title').append('<a href="javascript:void(0)" class="formBtnSplit submitBtn" style="margin-left:10px;margin-top:-5px;">|</a>');
		}
		$form.parent().prev().children('.panel-title').append($link_save);
		$form.parent().prev().children('.panel-title').append('<a href="javascript:void(0)" class="formBtnSplit submitBtn" style="margin-left:10px;margin-top:-5px;">|</a>');
		$form.parent().prev().children('.panel-title').append($link_reset);
		
		$link_save.linkbutton({text:'保存',iconCls:'icon-link-save',plain:true}).click(function(){
			var isValidate=$form.form('enableValidation').form('validate');
			if(!isValidate){
				return;
			}
			$.messager.progress();
			var data=options.getData();
			$.post(options.getUrl(),{data:JSON.stringify(data)},function(result){
				$.messager.progress("close");
				if(result.status){
					if($form.attr('id')=='headForm'){
						responseTypeCode=Constants.RecStatus_Temp;
					}
					$.messager.alert('提示','操作成功！','info',function(){
						options.callback(result, data);
					});
				}
				else{
					$.messager.alert('提示',result.message,'warning');
				}
			},'json');
		});
		
		$link_reset.linkbutton({text:'重置',iconCls:'icon-link-undo',plain:true}).click(function(){
			$form.form('reset').form('disableValidation').find('#id').val('');
			var index = $tab.tabs('getTabIndex',$tab.tabs('getSelected'));
			if(index){
				var data=tab[index].grid.datagrid('getSelected');
				if(!data){
					return;
				}
				tab[index].grid.datagrid('options').onClickRow(tab[index].grid.datagrid('getRowIndex',data),data);
			}
			if(!$.isEmptyObject(copy_data)&&$form.attr('id')=='billForm'){
				$('#paste').show();
			}
		});
		$form.append(div);
	}
	
	function addOperateColumn(columns,type){
		columns.push({
			field:'op',
			width:80,
			title:'操作栏',
			align:'center',
			formatter:function(value,rowData,rowIndex){
				var array=[];
				var jsonstr = JSON.stringify(rowData);
				jsonstr = jsonstr.replace(/"/gm, "'");
				array.push('<input class="hide" type="hidden" value="'+jsonstr+'" /><a href="javascript:void(0)">复制</a>');
				if(permiCheck(rowData,Constants.DelPermi.bill[rowData.functionCode])){
					array.push('<a href="javascript:void(0)" onclick="Global.delRow(\''+rowData.id+'\','+type+','+rowIndex+')">删除</a>');
				}
				return array.join('&nbsp;&nbsp;');
			}
		});
	}
	
	Global.delRow=function(id, type, rowIndex){
		$.messager.confirm('提示','确定删除选中的记录？',function(data){
			if(!data){
				return;
			}
			var url,callback;
			switch (type) {
				case 0:
					url='manifestChangeList!delete.action';
					callback=function(rowIndex,id){
						bill_tab.grid.datagrid('reload');
						for(var i=0;i<Global.billList.length;i++){
							if(Global.billList[i].id==id){
								Global.billList.splice(i,1);break;
							}
						}
					}
					break;
			}
			$.messager.progress();
			$.post(url,{id:id},function(result){
				$.messager.progress("close");
				if(result.status){
					callback(rowIndex,id);
				}
			},'json');
		});
		getEvent().stopPropagation();
	}
	var $tab=$('#div_tab');
	$tab.tabs({
		onSelect:function(title,index){
			if(index&&(!manifestId||!(responseTypeCode&&responseTypeCode==Constants.RecStatus_Temp))){
				$.messager.alert('提示','请先保存表头信息！','warning');
				$tab.tabs('select',0);
				return;
			}
			tab[index].load();
		}
	});
	tab[0].load();
	
	var conta_number_cache={};
});

function declare(){
	if(!manifestId){
		$.messager.alert('提示','请先保存表头信息！','warning');return;
	}
	$.messager.progress();
	$.post('manifestChangeTransportShip!declare.action',{id:manifestId},function(result){
		$.messager.progress('close');
		if(!result.status){
			alertByMaxHeight(result.message.replace(new RegExp(NfhaValidate.split,'g'),'<br/>'));return;
		}else{
			$.messager.alert('提示','申报成功!','info',function(){
				main_tab.change("直接改配列表", "/biz/manifestChangeTransportShip!list.action");
			});
		}
	},'json');
}

function appendPasteButton($form){
	if(!$.isEmptyObject(copy_data)&&$form.attr('id')=='billForm'){
		var $link_paste=$('<a id="paste" style="margin-left:10px;margin-top:-5px;" class="formBtn submitBtn"></a>');
		var len=$form.parent().prev().children('.panel-title').find('#paste').length;
		if(!len){
			$form.parent().prev().children('.panel-title').append($link_paste);
		}else{
			$('#paste').show();
		}
		$link_paste.linkbutton({iconCls:'icon-link-save',text:'粘贴',plain:true}).click(function(){
			$form.find('#id').val('');
			$form.form('reset');
			$form.find('.textbox-value').each(function(){
				var $element=$form.find('#'+$(this).attr('name'));
				if($element.hasClass('datetimebox-f')){
					$element.datetimebox('setValue',copy_data[$(this).attr('name')]);
					$element.combobox('enable');
				}else if($element.hasClass('combo-f')){
					$element.combobox('setValue',copy_data[$(this).attr('name')]);
					$element.combobox('enable');
				}else{
					$element.textbox('setValue',copy_data[$(this).attr('name')]);
					$element.combobox('enable');
				}
			});
			$form.parent().prev().find('.submitBtn').each(function(){
				$(this).show();
			});
		});
	}
}

function getEvent(){if(document.all)return window.event;for(func=getEvent.caller;null!=func;){var a=func.arguments[0];if(a&&(a.constructor==Event||a.constructor==MouseEvent||"object"==typeof a&&a.preventDefault&&a.stopPropagation))return a;func=func.caller}return null};