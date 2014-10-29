<?php

session_start();

?>

<!DOCTYPE HTML>
    <html>
	<head>
	  <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	  <title>IT Request Register</title>
	  <link href="/css/styles.css" media="screen" rel="stylesheet" />
	  <link href="itwrstyles.css" media="screen" rel="stylesheet" />
          <link href="global.css" media="screen" rel="stylesheet" />
	  <link href="it_req_reg.css" media="screen" rel="stylesheet" />
	  <link rel="stylesheet" href="/jQuery1.10.1/themes/base/jquery-ui.css" />
	  <script src="/jQuery1.10.1/jquery-1.9.1.js"></script>
	  <script src="/jQuery1.10.1/ui/minified/jquery-ui.custom.min.js"></script>
          <script src="global.js"></script>
	</head>
	
	<body>
	
<?php
 if( !empty( $_POST ) ) {
    global $mysqli;
    
    $wr_rqstr_id = $_SESSION["UserId"];
    $wr_title = $_POST['txttitleworkreq'];
    $wr_date = date( 'Y-m-d' );
    $wr_exptd_date_completion = fn_date_user_to_db_format( $_POST['txtcompdate'] );
    $wr_objective = $_POST['txtreqobjective'];
    $wr_doc_path = $_POST['txtfilelink'];
    $wr_it_staff_id = $_POST['cmbItPer'];
    $wr_stake_hldr_id = $_POST['cmbStkHldr'];
    $wr_stake_hldr_status = 1;
    $es_excu_arry = $_POST['cmbExcu'];
    $es_excu_list = implode( ",", $es_excu_arry );
    $wr_status = 1;
    
    $sql = " INSERT INTO app_work_request(wr_date,wr_rqstr_id,wr_title,wr_objective,wr_it_staff_id,wr_exptd_date_completion,wr_stake_hldr_id,wr_stake_hldr_status,wr_doc_path,wr_status) ";
    $sql.= " VALUES(?,?,?,?,?,?,?,?,?,?) ";
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
        $stmt->bind_param( "sissisissi", $wr_date, $wr_rqstr_id, $wr_title, $wr_objective, $wr_it_staff_id, $wr_exptd_date_completion, $wr_stake_hldr_id, $wr_stake_hldr_status, $wr_doc_path, $wr_status );
        $reslt = $stmt->execute();
	if( !$reslt ) {
	    die($mysqli->error);
	}
        $stmt->close();
	
	$sql = " SELECT MAX(wr_id) AS id FROM app_work_request ";
	
	if( $result = $mysqli->query( $sql ) ) {
	  
	  if( $obj = $result->fetch_object() ) {
	    
	    $id = $obj->id; //Get the new Id
	    $es_status = 1;
	    echo "<script language='javascript'>";
	    echo "var gv_new_req_id = '".$id."';";
	    echo "</script>";
	    
	    //Create records for the Excutives' SignOff
	    if( !empty( $es_excu_arry ) && isset( $es_excu_arry ) ) {
	      foreach( $es_excu_arry AS $key=>$val ) {
		if( $val ) {
		  $sql = " INSERT INTO app_executive_signoff(es_wr_id,es_excu_id,es_status) ";
		  $sql.= " VALUES(?,?,?) ";
		  if( $stmt = $mysqli->prepare( $sql ) ) {
		    $stmt->bind_param( "iii", $id, $val, $es_status );
		    $reslt = $stmt->execute();
		    if( !$reslt ) {
			die($mysqli->error);
		    }
		    $stmt->close();
		  }
		}
	      }
	    }
	    
	    //Email concerned Executive
	    if( $es_excu_list ) {
	      $sql = " SELECT ld.name, ld.email, ld.id, es.es_status, es.es_status AS ex_status FROM app_executive_signoff es ";
	      $sql.= " LEFT OUTER JOIN app_login_details ld ON ld.id = es.es_excu_id ";
	      $sql.= " WHERE es.es_wr_id = ".intval( $id );
	      $sql.= " AND es.es_excu_id IN ( ".$es_excu_list." )";
	      
	      if( $excu_result = $mysqli->query( $sql ) ) {
		
		while( $obj = $excu_result->fetch_object() ) {
		
		  if( isset( $obj->email ) && ( $obj->email ) ) {
		    
		    $Address = $obj->email;
		    
		    $Subject = "Action Required: Request # ".$id." has been created.";
		    
		    $Body = "Dear ".$obj->name.",<br><br><br>";
		    $Body.= "Request # ".$id." has been created and you have been mentioned as the Executive approver!.<br><br>";
		    $Body.= "Please select the request from the request register grid and click 'Process Request' button to approve/reject the request.<br><br>";
		    $Body.= "Click below link to open 'Request Register'.<br>";
		    $Body.= "<a href='https://".$_SERVER['SERVER_NAME']."/itwr/it_req_reg.php?wr_id=".$id."'>--->Proceed to Request Register<---</a><br><br><br><br>";
		    $Body.= "Regards,<br><br>";
		    $Body.= "IT Work Request Team";
		    
		    $From = "IT_Work_Request@dinersclub.co.nz";
		    $FromName = "IT Work Request";
		    
		    $Headers = 'MIME-Version: 1:0'."\r\n".'Content-type: text/html; charset=iso8859-1'."\r\n".'From: '.$From."\r\n".'FromName: '.$FromName;
		    
		    mail($Address, $Subject, $Body, $Headers);
		  }
		  
		}
		  
	      }
	      $excu_result->close();
	    }
	    
	    //Email concerned Stake Holder
	    if( $wr_stake_hldr_id ) {
	      $sql = " SELECT ld.name, ld.email, ld.id FROM app_login_details ld ";
	      $sql.= " WHERE id = ".intval( $wr_stake_hldr_id );
	      
	      if( $stake_hldr_result = $mysqli->query( $sql ) ) {
		
		while( $obj = $stake_hldr_result->fetch_object() ) {
		
		  if( isset( $obj->email ) && ( $obj->email ) ) {
		    
		    $Address = $obj->email;
		    
		    $Subject = "FYI: Request # ".$id." has been created.";
		    
		    $Body = "Dear ".$obj->name.",<br><br><br>";
		    $Body.= "Request # ".$id." has been created and you have been mentioned as the Stake Holder!.<br><br>";
		    $Body.= "Please select the request from the request register grid and click 'View Details' button for checking the details.<br><br>";
		    $Body.= "Click below link to open 'Request Register' for details.<br>";
		    $Body.= "<a href='https://".$_SERVER['SERVER_NAME']."/itwr/it_req_reg.php?wr_id=".$id."'>--->Proceed to Request Register<---</a><br><br><br><br>";
		    $Body.= "Regards,<br><br>";
		    $Body.= "IT Work Request Team";
		    
		    $From = "IT_Work_Request@dinersclub.co.nz";
		    $FromName = "IT Work Request";
		    
		    $Headers = 'MIME-Version: 1:0'."\r\n".'Content-type: text/html; charset=iso8859-1'."\r\n".'From: '.$From."\r\n".'FromName: '.$FromName;
		    
		    mail($Address, $Subject, $Body, $Headers);
		  }
		  
		}
		  
	      }
	      $stake_hldr_result->close();
	    }
	    
	    //Email Authorized IT person 
	      $sql = " SELECT ld.name, ld.id, ld.email FROM app_usr_auth ua ";
	      $sql.= " INNER JOIN app_login_details ld ON ld.id = ua.ua_user_id ";
	      $sql.= " WHERE ua.ua_assign_req = 1 ";
	      
	      if( $it_result = $mysqli->query( $sql ) ) {
		
		while( $obj = $it_result->fetch_object() ) {
		  
		  if( isset( $obj->email ) && ( $obj->email ) ) {
		    
		    $Address = $obj->email;
		    
		    $Subject = "FYI: Request # ".$id." has been created.";
		    
		    $Body = "Dear ".$obj->name.",<br><br><br>";
		    $Body.= "Request # ".$id." has been created.<br><br>";
		    $Body.= "Click below link to open 'Request Register'.<br>";
		    $Body.= "<a href='https://".$_SERVER['SERVER_NAME']."/itwr/it_req_reg.php?wr_id=".$id."'>--->Proceed to Request Register<---</a><br><br><br><br>";
		    $Body.= "Regards,<br><br>";
		    $Body.= "IT Work Request Team";
		    
		    $From = "IT_Work_Request@dinersclub.co.nz";
		    $FromName = "IT Work Request";
		    
		    $Headers = 'MIME-Version: 1:0'."\r\n".'Content-type: text/html; charset=iso8859-1'."\r\n".'From: '.$From."\r\n".'FromName: '.$FromName;
		    
		    mail($Address, $Subject, $Body, $Headers);
		  }
		  
		}
		  
	      }
	      $it_result->close();
	  }
	  $result->close();
	  
	}
	
    }
    else {
        echo "\nERROR: could not prepare SQL statement: ";
    }
 }
 else {
    echo "<script language='javascript'>";
    echo "var gv_new_req_id = '';";
    echo "</script>";
 }
?>
	  <div class="form_container container_12" id="divheadtitle">
	    <br><br>
	    <center>
	      <span style="color: #106bad;font-size: 28px;height: 36px;vertical-align: middle;">IT Work Request Register</span>
	    </center>
	    <br>
	  </div>
	  
	  <div id="divsrchfltr">
	    <fieldset>
	      <legend>Search Filter</legend>
	      <table>
		<tr>
		  <td>Request ID</td>
		  <td>Request Date</td>
		  <td>Exp. Comp. Date</td>
		  <td>Created By</td>
		  <td>Title</td>
		  <td>Status</td>
		</tr>
		<tr>
		  <td><input type="text" id="txtrqid" name="txtrqid" /></td>
		  <td><input type="text" id="txtrqdate" name="txtrqdate" /> </td>
		  <td><input type="text" id="txtexpcompdate" name="txtexpcompdate" /></td>
		  <td><input type="text" id="txtcreatedby" name="txtcreatedby" /></td>
		  <td><input type="text" id="txttitle" name="txttitle" /></td>
		  <td><div id="divstatus"></div></td>
		</tr>
		<tr>
		  <td colspan="6" style="text-align: center;">
		    <input type="button" id="btnsearch" name="btnsearch" value="Search" />
		  </td>
		</tr>
	      </table>
	    </fieldset>
	  </div>
	  
	  <div id="divactions">
	    <table>
		<tr>
		  <td>
		    <input type="button" id="btnViewDetails" name="btnViewDetails" value="View Details" />
		  </td>
		  <td>
		    <input type="button" id="btnprocessreq" name="btnprocessreq" value="Process Request" />
		  </td>
		  <td>
		    <input type="button" id="btnassignreq" name="btnassignreq" value="Assign Request" />
		  </td>
		  <td>
		    <input type="button" id="btnupdatereq" name="btnupdatereq" value="Update Request" />
		  </td>
		</tr>
	    </table>
	  </div>
	  
          <div id="divgridcont"><div id="divReqReg"></div></div>
	  
	  
<!--  Div Templates	  -->

	  <div id="divDetailsWin" style="display: none;">   <!--Div for displaying details of the record selected-->
	    <table>
		
		<tr>
		  <td>
			  <table class="clstblelmsTop">
			    <tr>
			      <td>
				<div class="divfst labelheading">Request #:</div>
				<div class="divnxt"><div id="wr_id"></div></div>
			      </td>
			    </tr>
			    <tr>
			      <td>
				<div class="divfst labelheading">Department Name:</div>
				<div class="divnxt"><div id="dept_name"></div></div>
				
				<div class="divrgtalgd">
				  <div class="divnxt labelheading">Date: </div>
				  <div class="divnxt"><div id="wr_date"></div></div>
				</div>
			      </td>
			    </tr>
			  </table>
		  </td>
		</tr>
		
		<tr>
		  <td>
			  <table class="clstblelms">
			    <tr>
			      <td>1.</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Title of the Work Request: </div></td>
			      <td><div id="wr_title"></div></td>
			    </tr>
			    <tr>
			      <td>2.</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Requestor Name: </div></td>
			      <td><div id="rqstr_name"></td>
			    </tr>
			    <tr>
			      <td>3.</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Date by which the request must be completed (DD/MM/YYYY): </div></td>
			      <td><div id="wr_exptd_date_completion"></div></td>
			    </tr>
			    <tr>
			      <td>4.</td>
			      <td class="clstdlblsbhd">
				<div class="labelsubheading">Objective of this request: </div>
			      </td>
			      <td><div id="wr_objective"></div></td>
			    </tr>
			    <tr>
			      <td>5.</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Please attach any detailed requirements and/or scope to this form. (<span class="clsitlaic">Paste Link to the Shared Folder</span>): </div></td>
			      <td><div id="wr_doc_path"></div></td>
			    </tr>
			    <tr>
			      <td>6.</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">IT Staff with whom the below request/requirement has been discussed: </div></td>
			      <td>
				<div id="it_staff_name"></div>
			      </td>
			    </tr>
			  </table>
		  </td>
		</tr>
		
		<tr>
		  <td>
		      <div class="clstblelmsTop clslabelbg">Stakeholder</div>
			  <table class="clstblelms">
			    
			    <tr>
			      <td>&nbsp;&nbsp;</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Stakeholder Name: </div></td>
			      <td>
				<div id="stake_hldr_name"></div>
			      </td>
			    </tr>
			    
			  </table>
		  </td>
		</tr>
		
		<tr class="clsbdrbtm"> <td> &nbsp; </td> </tr>
		
		<tr>
		  <td>
		      <div class="clstblelmsTop clslabelbg">Executives</div>
			  <table class="clstblelms">
			    
			    <tr>
			      <td>&nbsp;&nbsp;</td>
			      <td class="clstdlblsbhd"><div class="labelsubheading">Executives: </div></td>
			      <td>
				<div id="executives" name="executives"></div>
			      </td>
			    </tr>
			    
			  </table>
		  </td>
		</tr>
		
		<tr class="clsbdrbtm"> <td> &nbsp; </td> </tr>
		
	      </table>
	  </div>    <!--End of Div for Displaying-details-->
	  
	  <div id="divProcessReqWin" style="display: none;">   <!--Div for processing the request-->
	    <form action="" id="frmprocessreq" name="frmprocessreq" method="POST">
	      <table>
		<tr id="sttus">
		  <td class="labelheading">Select Status: </td>
		  <td><div id="divprcrqstatus"></div></td>
		</tr>
		<tr> <td colspan="2" class="labelheading">Comments:</td> </tr>
		<tr id="txtarea"> <td colspan="2"><textarea id="txtprcrqcmts" name="txtprcrqcmts" style="height: 143px; width: 243px;"></textarea></td></tr>
	      </table>
	    </form>
	  </div>
	  
	  <div id="divAssigneeReqWin" style="display: none;">   <!--Div for assigning the request-->
	    <form action="" id="frmassigneereq" name="frmassigneereq" method="POST">
	      <table>
		<tr>
		  <td class="labelheading">Select Assignee: </td>
		  <td><div id="divselassignee"></div></td>
		</tr>
		<tr> <td colspan="2" class="labelheading">Comments:</td> </tr>
		<tr id="txtarea"> <td colspan="2"><textarea id="txtassignedcmts" name="txtassignedcmts" style="height: 143px; width: 243px;"></textarea></td></tr>
	      </table>
	    </form>
	  </div>
	  
	  <div id="divReProcessReqWin" style="display: none;">   <!--Div for reprocessing and updating the request status-->
	    <form action="" id="frmreprocessreq" name="frmreprocessreq" method="POST">
	      <table>
		<tr id="sttus">
		  <td class="labelheading">Select Status: </td>
		  <td><div id="divreprcstatus"></div></td>
		</tr>
		<tr> <td colspan="2" class="labelheading">Comments:</td> </tr>
		<tr id="txtarea"> <td colspan="2"><textarea id="txtreprccmts" name="txtreprccmts" style="height: 143px; width: 243px;"></textarea></td></tr>
	      </table>
	    </form>
	  </div>
	  
<!--  End of Div Templates	  -->
          <script language="Javascript">
	  $(document).ready( function() {
	    
	    if( !gv_new_req_id ) {
	      gv_new_req_id = "<?php if( isset( $_GET['wr_id'] ) && ( $_GET['wr_id'] ) ) echo $_GET['wr_id']; ?>";
	    }
	    
	    var lv_assign_req_check = "<?php echo $_SESSION['usr_auth_assign_req']; ?>";
	    
	    if ( gv_new_req_id != undefined ) {
	      document.getElementById('txtrqid').value = gv_new_req_id;
	    }
	    
	    var gv_user_id = "<?php echo $_SESSION["UserId"]; ?>";
	    
	    $( "#txtrqdate" ).datepicker( {dateFormat : "dd/mm/yy" });
	    $( "#txtexpcompdate" ).datepicker( {dateFormat : "dd/mm/yy" });
            var lv_grdPnlReqReg = "";
	    var lv_detailsWin = "";
	    
	    var lv_grdReqRegDataStore = new dataStore({
	      url: '/itwr/ajax_funcs/get_wkrq_list',
	      root: 'items',
	      fields: ['wr_id','wr_date','wr_exptd_date_completion','rqstr_name','wr_title','it_staff_name','wr_status'],
	      exParams: { sortCol: 'wr_date', sortOrder: 'desc' },
	      totalProperty: 'totalCount'
	    });
	      
	      fn_viewRequestDetails = function() {
		var lv_selectedRow = null;
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    //Get Executives
		    var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		    $.post(
		      "ajax_funcs.php",
		      {
			method: "getExecutiveList",
			params: { wr_id: lv_selectedRow_arry.wr_id }
		      },
		      function ( v_data, v_status ) {
			var lv_data = $.parseJSON( v_data );
			var lv_excu_names_arry = [];
			var lv_excu_ids_arry = [];
			$.each( lv_data.items, function( v_idx, v_val ){
			  lv_excu_names_arry.push( v_val.name );
			  lv_excu_ids_arry.push( v_val.id );
			});
			var lv_excu_names = '';
			lv_excu_names = lv_excu_names_arry.join(", ");
			var lv_excu_ids = '';
			lv_excu_ids = JSON.stringify( lv_excu_ids_arry );
			fn_setCookie( 'excu_ids', lv_excu_ids );
			var lv_executives = $("#executives").html( lv_excu_names );
		    
		    //Prepare Window to be displayed with Details
			  lv_detailsWin = new windowPanel({
			    id: 'winDetails',
			    width: 820,
			    data: lv_selectedRow,
			    elementsDiv_id: 'divDetailsWin',
			    title: 'Details',
			    masked: true,
			    buttons: [{
			      id: 'btnclosedetails',
			      text: 'Close',
			      handler: function() {
				lv_detailsWin.hide();
			      }
			    }]
			  });
			  lv_detailsWin.render();
			  lv_detailsWin.show();
		      }
		    );
		  }
		}
	      }
	    
	      //Grid
		lv_grdPnlReqReg = new gridPanel({
		    id: "grdPnlReqReg",
		    height: 343,
		    width: 843,
		    container_id: "divReqReg",
		    store: lv_grdReqRegDataStore,
		    paging: true,
		    pageSize: 20,
		    headers:  [{
			headerText: 'Req. #',
			width: 43,
			dataIndex: 'wr_id'
		      },{
			headerText: 'Request Date',
			width: 73,
			dataIndex: 'wr_date'
		      },{
			headerText: 'Exp. Comp. Date',
			width: 83,
			dataIndex: 'wr_exptd_date_completion'
		      },{
			headerText: 'Created By',
			width: 83,
			dataIndex: 'rqstr_name'
		      },{
			headerText: 'Titile',
			width: 93,
			dataIndex: 'wr_title'
		      },{
			headerText: 'IT Staff Consulted',
			width: 83,
			dataIndex: 'it_staff_name'
		      },{
			headerText: 'Status',
			width: 83,
			dataIndex: 'wr_status'
		      }
		    ],
		    listeners: {
		      dblclick: fn_viewRequestDetails
		    }
		});
		lv_grdPnlReqReg.render();
	      
	      //For Status Select option
	      var lv_status_data = [
		{ "id": 2, "text": "Approved" },
		{ "id": 3, "text": "Assigned" },
		{ "id": 4, "text": "Completed" },
		{ "id": 1, "text": "For Approval" }
	      ];
	      
	      var lv_status_data_json = JSON.stringify( lv_status_data );
	      
	      var lv_srch_req_status = "<?php if( isset( $_GET['wr_status'] ) && ( $_GET['wr_status'] ) ) echo $_GET['wr_status']; ?>";
	      
	      if( !lv_srch_req_status ) {
		lv_srch_req_status = 1;
	      }
	      
	      var lv_cmbStatus = new comboBox({
		id: "cmbStatus",
		width: 143,
		container_id: "divstatus",
		valueField: "id",
		textField: "text",
		defaultSelectedValue: lv_srch_req_status,
		data: lv_status_data_json
	      });
	      lv_cmbStatus.render();
	      
	      //For Processing Request => Status Select option
	      lv_status_data = [
		{ "id": 2, "text": "Approve" },
		{ "id": 5, "text": "Reject" }
	      ];
	      
	      lv_status_data_json = JSON.stringify( lv_status_data );
	      
	      var lv_cmbPrRqStatus = new comboBox({
		id: "cmbPrRqStatus",
		width: 143,
		container_id: "divprcrqstatus",
		valueField: "id",
		textField: "text",
		data: lv_status_data_json
	      });
	      lv_cmbPrRqStatus.render();
	      
	      //IT Person
	      var lv_comboReqAssignee = "";
	      $.post(
		"ajax_funcs.php",
		{
                  method: "get_people_by_department",
                  params: { dept_name: "IT" }
                },
		function ( v_data, v_status ) {
		    var lv_data = $.parseJSON( v_data );
                    var lv_data_json = JSON.stringify( lv_data.items );
		    
		    if( lv_data.success ) {
		      lv_comboReqAssignee = new comboBox({
                          id: "cmbReqAssignee",
                          width: 143,
                          container_id: "divselassignee",
                          valueField: "id",
                          textField: "name",
                          data: lv_data_json
                      });
                      lv_comboReqAssignee.render();
		    }
		}
	      );
	      
	      //For reProcessing Request => Status Select option
	      if ( parseInt( lv_assign_req_check ) == 1 ) {
		lv_status_data = [
		  { "id": 2, "text": "Reset Status back to Approved" },
		  { "id": 3, "text": "Set to Assigned" }
		];
	      }
	      else {
		lv_status_data = [
		  { "id": 3, "text": "Reset to Assigned" },
		  { "id": 4, "text": "Completed" }
		];
	      }
	      
	      lv_status_data_json = JSON.stringify( lv_status_data );
	      
	      var lv_cmbRePrRqStatus = new comboBox({
		id: "cmbReqStatus",
		width: 143,
		container_id: "divreprcstatus",
		valueField: "id",
		textField: "text",
		data: lv_status_data_json
	      });
	      lv_cmbRePrRqStatus.render();
	      
	      //Refresh Grid
	      fn_refreshReqGrid = function() {
		
		  lv_grdPnlReqReg.store.baseParams = {
			wr_id: $( "#txtrqid" ).val(),
			wr_date: $( "#txtrqdate" ).val(),
			wr_exptd_date_completion: $( "#txtexpcompdate" ).val(),
			rqstr_name: $( "#txtcreatedby" ).val(),
			wr_title: $( "#txttitle" ).val(),
			wr_status: $( "#cmbStatus" ).val()
		  };
		  lv_grdPnlReqReg.refreshGrid();
	      }
	      
	      //Search button Click event
	      $( "#btnsearch" ).on( 'click', fn_refreshReqGrid );
	      
	      //Code related to Request processing
	      var lv_processReqWin = {};
	      
	      fn_saveProcessStatus = function() {
		var lv_params = lv_processReqWin.getFormVals();
		
		var lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		lv_params["wr_id"] = lv_selectedRow_arry.wr_id;
		lv_params = JSON.stringify( lv_params );
		
		$.post(
		  "ajax_funcs.php",
		  {
		    method: "processReq",
		    params: lv_params
		  },
		  function ( v_data, v_status ) {
		    var lv_data = $.parseJSON( v_data );
		    if( lv_data.success ) {
		      fn_alert( "Success!", "Request Processed Successfully!" );
		    }
		    else {
		      fn_alert( "Error!", lv_data.error );
		    }
		    lv_processReqWin.hide();
		    fn_refreshReqGrid();
		  }
		);
	      }
	      
	      fn_processRequest = function() {
		lv_processReqWin = new windowPanel({
		  id: 'processReqWinId',
		  width: 343,
		  elementsDiv_id: 'divProcessReqWin',
		  title: 'Process Request',
		  masked: true,
		  buttons: [{
		    id: 'btnsaveprstatus',
		    text: 'Save',
		    handler: function() {
		      fn_saveProcessStatus();
		    }
		  },{
		    id: 'btncancelprsave',
		    text: 'Cancel',
		    handler: function() {
		      lv_processReqWin.hide();
		    }
		  }]
		});
		lv_processReqWin.render();
		lv_processReqWin.show();
	      }
	      //End of code related to Request processing
	      
	      
	      //Code related to Assignment
	      var lv_assignReqWin = {};
	      
	      fn_assignRequest = function() {
		var lv_params = lv_assignReqWin.getFormVals();
		
		var lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		lv_params["wr_id"] = lv_selectedRow_arry.wr_id;
		lv_params = JSON.stringify( lv_params );
		
		$.post(
		  "ajax_funcs.php",
		  {
		    method: "assignReq",
		    params: lv_params
		  },
		  function ( v_data, v_status ) {
		    var lv_data = $.parseJSON( v_data );
		    if( lv_data.success ) {
		      fn_alert( "Success!", "Request Assigned Successfully!" );
		    }
		    else {
		      fn_alert( "Error!", lv_data.error );
		    }
		    lv_assignReqWin.hide();
		    fn_refreshReqGrid();
		  }
		);
	      }
	      
	      fn_processAssignment = function() {
		lv_assignReqWin = new windowPanel({
		  id: 'assignReqWinId',
		  width: 343,
		  elementsDiv_id: 'divAssigneeReqWin',
		  title: 'Assign Request',
		  masked: true,
		  buttons: [{
		    id: 'btnassignreq',
		    text: 'Assign',
		    handler: function() {
		      fn_assignRequest();
		    }
		  },{
		    id: 'btncancelassign',
		    text: 'Cancel',
		    handler: function() {
		      lv_assignReqWin.hide();
		    }
		  }]
		});
		lv_assignReqWin.render();
		lv_assignReqWin.show();
	      }
	      //End of code related to Assignment
	      
	      //Code related to ReProcessing / Updating Request
	      var lv_reprcReqWin = {};
	      
	      fn_reprcRequest = function() {
		var lv_params = lv_reprcReqWin.getFormVals();
		
		var lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		lv_params["wr_id"] = lv_selectedRow_arry.wr_id;
		lv_params = JSON.stringify( lv_params );
		
		$.post(
		  "ajax_funcs.php",
		  {
		    method: "updateReqStatus",
		    params: lv_params
		  },
		  function ( v_data, v_status ) {
		    var lv_data = $.parseJSON( v_data );
		    if( lv_data.success ) {
		      fn_alert( "Success!", "Request Updated Successfully!" );
		    }
		    else {
		      fn_alert( "Error!", lv_data.error );
		    }
		    lv_reprcReqWin.hide();
		    fn_refreshReqGrid();
		  }
		);
	      }
	      
	      fn_updateAssignment = function() {
		lv_reprcReqWin = new windowPanel({
		  id: 'reprcReqWinId',
		  width: 343,
		  elementsDiv_id: 'divReProcessReqWin',
		  title: 'Process Request',
		  masked: true,
		  buttons: [{
		    id: 'btnreprcreq',
		    text: 'Update',
		    handler: function() {
		      fn_reprcRequest();
		    }
		  },{
		    id: 'btncancelreprc',
		    text: 'Cancel',
		    handler: function() {
		      lv_reprcReqWin.hide();
		    }
		  }]
		});
		lv_reprcReqWin.render();
		lv_reprcReqWin.show();
	      }
	      //End of code related to ReProcessing / Updating Request
	      
	      //Get Details of Selected Row
	      $( "#btnViewDetails" ).on( 'click', function() {
		fn_viewRequestDetails();
	      });
	      
	      $( "#btnprocessreq" ).on( 'click', function() {
		var lv_selectedRow = null;
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    
		    //Get Executives
		    var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		    
		    //Commented out but, in future, Stake Holder might Approve / Reject requests ****Do not delete****
		//    if( ( lv_selectedRow_arry.wr_stake_hldr_id ) && ( lv_selectedRow_arry.wr_stake_hldr_id == gv_user_id ) ) {
		//	if( lv_selectedRow_arry.stake_hldr_status != '1' ) {
		//	  fn_alert( "Information!", "You have already processed this Request! <br>Request Status: " + lv_selectedRow_arry.wr_stake_hldr_status );
		//	}
		//	else {
		//	  fn_alert( "Information!", "Request Status: " + lv_selectedRow_arry.wr_stake_hldr_status );
		//	}
		//    }
		//    else {
		      $.post(
			"ajax_funcs.php",
			{
			  method: "getExecutiveList",
			  params: { wr_id: lv_selectedRow_arry.wr_id, usr_id: true }
			},
			function ( v_data, v_status ) {
			  var lv_data = $.parseJSON( v_data );
			  var lv_user_chk = false;
			  
			  $.each( lv_data.items, function( v_idx, v_val ) {
			    if( parseInt( v_val.id ) == parseInt( gv_user_id ) ) {
			      lv_user_chk = true;
			      return;
			    }
			  });
			  
		      //As per Authorization Process Request
			  if( lv_user_chk ) {
			    if( parseInt( lv_data.items[0].ex_status ) != 1 ) {
			      fn_alert( "Information!", "You have already processed this Request! <br>Request Status: " + lv_data.items[0].es_status );
			    }
			    else {
			      //Open Window to Process Request
			      fn_processRequest();
			    }
			  }
			  else {
			    fn_alert( "Information!", "You are NOT authorized to process this request!" );
			  }
			}
		      );
		    //}
		  }
		}
	      });
	      
	      $( "#btnassignreq" ).on( 'click', function() {
		var lv_selectedRow = null;
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    if ( parseInt( lv_assign_req_check ) == 1 ) {
		      
		      if( parseInt( lv_selectedRow_arry.req_status ) != 2 ) {
			fn_alert( "Information!", "Request not approved or is already processed." );
		      }
		      else {
		      //Open Window to Assign Request
			fn_processAssignment();
		      }
		    }
		    else {
		      fn_alert( "Information!", "You are NOT authorized to assign requests!" );
		    }
		  }
		}
	      });
	      
	      $( "#btnupdatereq" ).on( 'click', function() {
		var lv_selectedRow = null;
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  var lv_selectedRow_arry = $.parseJSON( lv_selectedRow );
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    
		    if ( parseInt( lv_assign_req_check ) == 1 ) {
		      
		      if( parseInt( lv_selectedRow_arry.req_status ) == 1 ) {
			fn_alert( "Information!", "Request not approved." );
		      }
		      else {
		      //Open Window to Assign Request
			fn_updateAssignment();
		      }
		    }
		    else {
		      
		      $.post(
			"ajax_funcs.php",
			{
			  method: "getAssignedList",
			  params: { wr_id: lv_selectedRow_arry.wr_id }
			},
			function ( v_data, v_status ) {
			  var lv_data = $.parseJSON( v_data );
			  var lv_user_chk = false;
			  
			  $.each( lv_data.items, function( v_idx, v_val ) {
			    if( parseInt( v_val.id ) == parseInt( gv_user_id ) ) {
			      lv_user_chk = true;
			      return;
			    }
			  });
			  
		      //As per Authorization Update Request
			  
			  if( lv_user_chk ) {
			    if( ( parseInt( lv_data.items[0].x_status ) != 3 ) && ( parseInt( lv_data.items[0].x_status ) != 4 ) ) {
			      fn_alert( "Information!", "You are NOT authorized to process this request!" );
			    }
			    else {
			      //Open Window to Process Request
			      fn_updateAssignment();
			    }
			  }
			  else {
			    fn_alert( "Information!", "You are NOT authorized to process this request!" );
			  }
			}
		      );
		    }
		  }
		}
	      });
	      
	  });
	</script>
        </body>
    </html>
