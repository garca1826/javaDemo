<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>直接改配新增与编辑</title>
		<%@include file="/common/jsp/include.jsp"%>
		<style type="text/css">.panel{padding: 2px;}.datagrid{padding: 0px;}</style>
	</head>
	<body class="easyui-layout">
	    <div data-options="region:'center',border:false">
	    	<div id="div_tab" data-options="fit:true,border:false" class="easyui-tabs">   
			    <div title="表头">
			    	<div class="easyui-panel" data-options="title:'编辑表头',height:150">
				    	<form id="headForm" method="post" class="easyui-form" data-options="novalidate:true">
							<input type="hidden" name="id" id="id">
							<div class="cbec-table" id="headDiv"></div>
						</form>
				    </div>
			    </div>   
			    <div title="提运单">
		    		<div class="easyui-layout" style="height:100%;">
			    		<div data-options="region:'center',border:false,split:true">
			    			<div id="tb_bill" style="overflow: hidden;padding-bottom: 10px;">
								<form id="billConditionForm" class="easyui-form">
									<div class="cbec-table" >
										<div class="cbec-tr">
											<div class="cbec-block">
												<div class="cbec-th">新总提运单号：</div>
												<div class="cbec-td" style="width: 200px;"><input type="text" name="transportContractDocumentId" class="easyui-textbox"></div>
											</div>
											<div class="cbec-block">
												<div class="cbec-th">新分提运单号：</div>
												<div class="cbec-td" style="width: 200px;"><input type="text" name="associatedTransportId" class="easyui-textbox"></div>
											</div>
											<div class="cbec-block">
												<div class="cbec-td" style="width: 200px;">
													<a id="link_bill_search" class="easyui-linkbutton" iconCls="icon-search">查询</a>
													<a class="easyui-linkbutton" iconCls="icon-redo" onclick="$('#billConditionForm').form('reset')">重置</a>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
			    			<table id="billTable"></table>
			    		</div>   
						<div data-options="region:'south',title:'提运单编辑'" style="height: 200px;">
							<form id="billForm" method="post" class="easyui-form">
								<div class="cbec-table" id="billDiv"></div>
							</form>
						</div>
					</div>
			    </div>   
			</div> 
	    </div>  
		<script type="text/javascript">var manifestId='${param.id}';</script>
		<script type="text/javascript" src="${path}/biz/manifestChangeTransportShip/js/detail.js"></script>
		<script type="text/javascript" src="${path}/validate/validate.js"></script>
		<script type="text/javascript" src="${path}/validate.js?v=1.0&p=Manifest_8104_2"></script>
		<script type="text/javascript" src="${path}/baseData.js"></script>
	</body>
</html>