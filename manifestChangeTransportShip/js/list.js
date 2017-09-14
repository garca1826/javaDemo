function operate_callback(isDetail){
	if(!isDetail){
		$('#table_paging').datagrid('reload');
	}
	$('#win').window('close');
}
$(function(){
	var $table=$('#table_paging');
	initTable($table,'manifestChangeTransportShip!getPagingByAjax.action');
	
    $('#link_search').bind('click',function(){
    	var startDate=$('#startDate').datebox('getValue');
		var endDate=$('#endDate').datebox('getValue');
		if(endDate<startDate){
			$.messager.alert('提示','结束日期不能小于开始日期!','error');
			return;
		}
    	$table.datagrid('load', serializeForm($('#conditionForm')));
    });  
    
    $('#tb_sysInfo').find('input').bind('keyup',function(event){
    	if(event.keyCode==13){
    		$('#link_search').click();
    	}
    });
});

function del(id){
	$.messager.confirm('提示','确定删除选中的记录？',function(data){
		if(!data){
			return;
		}
		$.messager.progress();
		$.post('manifestChangeTransportShip!delete.action',{id:id},function(result){
			$.messager.progress('close');
			$.messager.alert('提示','操作成功!','info',function(){
				$('#table_paging').datagrid('reload');
			});
		},'json');
	});
}
function upd(id){
	main_tab.add('直接改配-编辑','/biz/manifestChangeTransportShip!create.action?id='+id);
}
function detail(id){
	main_tab.add('直接改配-查看详情','/biz/manifestChangeTransportShip!detail.action?id='+id);
}

function ftOperate(value, data){
	var array=[];
	if(authority.detail){
		array.push('<img title="查看" class="icon-cls" src="'+basePath+'/common/img/detail.png" onclick="detail(\'',data.id,'\')" />');
	}
	if(permiCheck(data,Constants.EditPermi.head[data.functionCode])&&authority.upd){
		array.push('<img title="编辑" class="icon-cls" src="'+basePath+'/common/img/edit.png" onclick="upd(\'',data.id,'\',\'',data.functionCode,'\')" />');
	}
	if(data.reservation1!='1'&&permiCheck(data,Constants.DelPermi.head[data.functionCode])&&authority.del){
		array.push('<img title="删除暂存" class="icon-cls" src="'+basePath+'/common/img/delete.png" onclick="del(\'',data.id,'\')" />');
	}
	if(data.responseTypeCode==Constants.RecStatus_Temp&&data.reservation1=='1'){
		array.push('<img title="撤销" class="icon-cls" src="'+basePath+'/common/img/undo.png" onclick="undo(\'',data.id,'\')" />');
	}
	return array.join('');
}
function undo(id){
	$.messager.confirm('提示','确定撤销选中的记录？',function(data){
		if(!data){
			return;
		}
		$.messager.progress();
		$.post('manifestChangeTransportShip!undo.action',{id:id},function(result){
			$.messager.progress('close');
			if(result.status) {
				$.messager.alert('提示','操作成功!','info',function(){
					$('#table_paging').datagrid('reload');
				});
			}
		},'json');
	});
}

function queryResponse(id,messageId){
	main_tab.add('直接改配-回执列表','/biz/manifestResponse!list.action?manifestId='+id+'&messageId='+messageId);
}

function formatTime(value, row, index) {
//	if (!value) {
//		return value;
//	}
//	return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
	return value;
}
function serializeForm(form){
	var obj = {};
	$.each(form.serializeArray(),function(index){
		if(obj[this['name']]){
			obj[this['name']] = obj[this['name']] + ','+encodeURI(this['value']);
		} else {
			obj[this['name']] =encodeURI(this['value']);
		}
	});
	return obj;
}
function fileChange(){
	var value=$('#file').filebox('getValue');
	if(!value){
		return;
	}
	if(!/.*\.xml?$/.test(value)){
		$.messager.alert('提示','文件格式不正确!必须是xml文件!','warning');
		$('#file').filebox('setValue','');
		return;
	}
	upload();
}
function upload(){
	$('#uploadForm').form('submit',{
		onSubmit:function(){
			$.messager.progress();
    	},
    	success: function(data){
    		$.messager.progress('close');
    		if(/msie 9/.test(navigator.userAgent.toLowerCase())){
				$('#file').filebox({onChange:function(){return false;}});
				$('#file').filebox('setValue','');
				$('#file').filebox({onChange:fileChange});
			}else{
				$('#file').filebox('setValue','');
			}
    		var result=$.parseJSON(data);
    		if(result.status){
    			$.messager.alert('提示','导入成功','info',function(){
    				$('#pagingTable').datagrid('reload');
    			});
    		}else{
    			alertByMaxHeight(result.message.replace(new RegExp(NfhaValidate.split,'g'),'<br/>'));return;
//    			$.messager.alert('提示','<font color="red">'+result.message+'</font>','warning');
    		}
		}
	});
}