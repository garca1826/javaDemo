<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>直接改配分页列表</title>
		<%@include file="/common/jsp/include.jsp"%>
	</head>
	<body>
		<div id="tb_sysInfo" style="overflow: hidden;padding-bottom: 10px;">
			<form id="conditionForm" class="easyui-form" method="post" data-options="novalidate:true">
				<div class="cbec-table" style="padding: 0px; margin: 0px;height:100%;">
					<div class="cbec-tr">
						<div class="cbec-block">
							<div class="cbec-th">原航次航班编号：</div>
							<div class="cbec-td" style="width: 200px;"><input type="text" name="journeyId" class="easyui-textbox"></div>
						</div>
						<div class="cbec-block">
							<div class="cbec-th">原运输工具代码:</div>
							<div class="cbec-td" style="width: 200px;">
								<input type="text" class="easyui-textbox" name="bordertransportmeansId" >
							</div>
						</div>
						<div class="cbec-block">
							<div class="cbec-th">新航次航班编号：</div>
							<div class="cbec-td" style="width: 200px;"><input type="text" name="cJourneyId" class="easyui-textbox"></div>
						</div>
						<div class="cbec-block">
							<div class="cbec-th">新运输工具代码:</div>
							<div class="cbec-td" style="width: 200px;">
								<input type="text" class="easyui-textbox" name="cBordertransportmeansId" >
							</div>
						</div>
						<div class="cbec-block" style="width: 600px;">
							<div class="cbec-th">更新时间:</div>
							<div class="cbec-td" style="width: 200px;">
								<input id="startDate" name="startDate" type="text" class="easyui-datebox">
							</div>
							&nbsp;至&nbsp;
							<div class="cbec-td" style="width: 200px;">
								<input id="endDate" name="endDate" type="text" class="easyui-datebox">
							</div>
						</div>
						<div class="cbec-block">
							<div class="cbec-th">舱单状态:</div>
							<div class="cbec-td" style="width: 200px;">
							 <input name="responseTypeCode" class="easyui-combobox" 
							 	data-options="data:BASE_DATA.RESPONSE_TYPE,loadFilter:Combo.filter,onHidePanel:Combo.hide" >
							</div>
						</div>
						<div class="cbec-block">
							<!-- <div class="cbec-td" style="width: 100px;">
								<form id="uploadForm" action="manifestChangeTransportShip!importXml.action"
									method="post" enctype="multipart/form-data"
									style="margin-left:23px;float:left;width:54px">
									<input class="easyui-filebox"
										data-options="buttonText:'导入数据',buttonAlign:'right',prompt:'请选择excel文件...',onChange:fileChange"
										id="file" name="file" style="height: 26px;" />
								</form>
							</div> -->
							<div class="cbec-td" style="width: 200px;">
								<a id="link_search" class="easyui-linkbutton" iconCls="icon-search">查询</a>
								<a id="link_reset" class="easyui-linkbutton" iconCls="icon-redo" onclick="$('#conditionForm').form('reset')">重置</a>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
		<table title="直接改配分页列表" id="table_paging"
			data-options="border:false,fit:true,fitColumns:true,rownumbers:true,singleSelect:true,method:'get',toolbar:'#tb_sysInfo',pagination:true,loadMsg:'正在加载数据....'">
			<thead>
				<tr>
					<th data-options="field:'senderId',align:'center'" width="50">申报企业海关备案代码</th>
					<th data-options="field:'journeyId',align:'center'" width="50">原航次航班编号</th>
					<th data-options="field:'bordertransportmeansId',align:'center'" width="50">原运输工具代码</th>
					<th data-options="field:'cJourneyId',align:'center'" width="50">新航次航班编号</th>
					<th data-options="field:'cBordertransportmeansId',align:'center'" width="50">新运输工具代码</th>
					<th data-options="field:'responseTypeCode',align:'center',formatter:ftStatus" width="50">状态</th>
					<th data-options="field:'updateTime',align:'center',formatter:formatTime"	width="50">更新时间</th>
					<th data-options="field:'sendMsgDate',align:'center',formatter:formatTime"	width="50">申报时间</th>
					<th data-options="field:'operate',align:'center',formatter:ftOperate" width="50">操作栏</th>
				</tr>
			</thead>
		</table>
		<script type="text/javascript">var authority={upd:<s:property value="validate('/biz/manifestOffLoadHead!edit.action')"/>,del:<s:property value="validate('/biz/manifestOffLoadHead!delete.action')"/>,detail:<s:property value="validate('/biz/manifestOffLoadHead!detail.action')"/>}</script>
		<script type="text/javascript" src="${path}/biz/manifestChangeTransportShip/js/list.js"></script>
		<script type="text/javascript" src="${path}/common/js/jquery.easyui.expand.js"></script>
		<script type="text/javascript"  src="${path}/baseData.js"></script>
		<div id="win" style="font-size:0"></div>
	</body>
</html>