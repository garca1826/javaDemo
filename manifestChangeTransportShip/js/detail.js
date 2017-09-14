var Global={};
$(function(){
	var tab=[];
	var head_tab={
		table:$('#headDiv'),	
		form:$('#headForm'),
		initElement:function(){
			NfhaValidateBuild.build({disabled:true,must:false,ignore:['id'],validateList:Manifest_8104_2,search:"Manifest-Declaration",$table:this.table,elementConfig:{notes:{opt:{height:70}},customsCode:getBaseDataOpt('CUSTOMS_CODE')}});
			var num=2;
			$.messager.progress();
			var _form=this.form;
			$.get('manifestChangeTransportShip!getSingleByAjax.action',{id:manifestId},function(data){
				data=data.message;
				_form.find('.textbox-value').each(function(){
					_form.find('#'+$(this).attr('name')).textbox('setValue',data[$(this).attr('name')]);//设置表单数据
				});
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
		},
		load:function(){
			if(!this.init){
				this.init=1;
				this.initElement();
			}
		}
	};
	
	var tempate_tab={
		initGrid:function(){
			var _this=this;
			var options={border:true,fit:true,fitColumns:true,rownumbers:true,singleSelect:true,method:'get',pagination:true,loadMsg:'正在加载数据....',url:this.action+"!getPagingByAjax.action",queryParams:{manifestId:manifestId},onClickRow:function(index,data){
				var $form=_this.form;
				if(data.rows){
					data=data.rows;
				}
				$form.find('.textbox-value').each(function(){
					var $element=$form.find('#'+$(this).attr('name'));
					if($element.hasClass('combo-f')){
						$element.combobox('setValue',data[$(this).attr('name')]);
					}else{
						$element.textbox('setValue',data[$(this).attr('name')]);//设置表单数据
					}
				});
			},onLoadSuccess:function(){
				_this.form.form('reset');
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
	var bill_tab={
		table:$('#billDiv'),form:$('#billForm'),grid:$('#billTable'),action:'manifestChangeList',queryForm:$('#billConditionForm'),
		initElement:function(){
			NfhaValidateBuild.build({disabled:true,must:false,ignore:['id','manifestId','gNo'],validateList:Manifest_8104_2,search:"Manifest-Declaration-billList",$table:this.table});
			$('<div class="cbec-th" style="width:30%"></div>').insertBefore(this.table.children('.cbec-th:eq(2)'));
			var _this=this;
			$('#link_bill_search').click(function(){
				_this.query();
			});
		},
		gridOptions:{
			toolbar:'#tb_bill',title:'提运单列表',columns:[columns]
		}
	}
	$.extend(bill_tab,tempate_tab);
	
	tab[0]=head_tab;
	tab[1]=bill_tab;
	
	var $tab=$('#div_tab');
	$tab.tabs({
		onSelect:function(title,index){
			if(index&&!manifestId){
				$.messager.alert('提示','请先保存表头信息！','warning');
				$tab.tabs('select',0);
				return;
			}
			tab[index].load();
		}
	});
	tab[0].load();
});