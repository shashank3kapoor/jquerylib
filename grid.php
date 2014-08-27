<?php
/*	Modification History
	******************************************************************************************************
	Date			05 Aug 2014
	By		        Shashank Kapoor
	Description		IT Request Register
	******************************************************************************************************
*/
session_start();

  include "db_con.php";
  include "checkstatus.php";
  include_once "incl_funcs.php";
?>

<!DOCTYPE HTML>
    <html>
	<head>
	  <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	  <title>IT Request Register</title>
	  <link href="../css/styles.css" media="screen" rel="stylesheet" />
	  <link href="itwrstyles.css" media="screen" rel="stylesheet" />
          <link href="global.css" media="screen" rel="stylesheet" />
	  <link href="it_req_reg.css" media="screen" rel="stylesheet" />
	  <link rel="stylesheet" href="../jQuery1.10.1/themes/base/jquery-ui.css" />
	  <script src="../jQuery1.10.1/jquery-1.9.1.js"></script>
	  <script src="../jQuery1.10.1/ui/minified/jquery-ui.custom.min.js"></script>
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
    $wr_status = 1;
    
    $sql = " INSERT INTO app_work_request(wr_date,wr_rqstr_id,wr_title,wr_objective,wr_it_staff_id,wr_exptd_date_completion,wr_stake_hldr_id,wr_stake_hldr_status,wr_doc_path,wr_status) ";
    $sql.= " VALUES(?,?,?,?,?,?,?,?,?) ";
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
        $stmt->bind_param( "sissisiss", $wr_date, $wr_rqstr_id, $wr_title, $wr_objective, $wr_it_staff_id, $wr_exptd_date_completion, $wr_stake_hldr_id, $wr_stake_hldr_status, $wr_doc_path, $wr_status );
        $reslt = $stmt->execute();
	if( !$reslt ) {
	    die($mysqli->error);
	}
        $stmt->close();
	
	$sql = " SELECT MAX(wr_id) AS id FROM app_work_request ";
	
	if( $result = $mysqli->query( $sql ) ) {
	  
	  while( $obj = $result->fetch_object() ) {
	    
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
		    $stmt->bind_param( "ii", $id, $val, $es_status );
		    $reslt = $stmt->execute();
		    if( !$reslt ) {
			die($mysqli->error);
		    }
		    $stmt->close();
		  }
		}
	      }
	    }
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
	  </div>
	  
<!--  End of Div Templates	  -->
          <script language="Javascript">
	  $(document).ready( function() {
	    
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
	      exParams: { sortCol: 'wr_date', sortOrder: 'asc' }
	    });
	    lv_grdReqRegDataStore.load();
	    
	      //Grid
		lv_grdPnlReqReg = new gridPanel({
		    id: "grdPnlReqReg",
		    height: 343,
		    width: 843,
		    container_id: "divReqReg",
		    store: lv_grdReqRegDataStore,
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
		    ]
		});
		lv_grdPnlReqReg.render();
	      
	      //For Status Select option
	      var lv_status_data = [
		{ "id": 2, "text": "Approved" },
		{ "id": 4, "text": "Completed" },
		{ "id": 1, "text": "For Approval" }
	      ];
	      
	      var lv_status_data_json = JSON.stringify( lv_status_data );
	      
	      var lv_cmbStatus = new comboBox({
		id: "cmbStatus",
		width: 143,
		container_id: "divstatus",
		valueField: "id",
		textField: "text",
		defaultSelectedValue: 1,
		data: lv_status_data_json
	      });
	      
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
	      fn_refreshReqGrid();
	      
	      //Search button Click event
	      $( "#btnsearch" ).on( 'click', fn_refreshReqGrid );
	      
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
	      
	      fn_saveProcessStatus = function() {
		
	      }
	      
	      fn_processRequest = function() {
		var lv_processReqWin = new windowPanel({
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
	      
	      lv_grdPnlReqReg.on( 'dblclick', fn_viewRequestDetails );
	      
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
		    
		    //Commented out but in future Stake Holder might Approve / Reject requests ****Do not delete****
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
			  var lv_user_data = {};
			  lv_user_data = fn_search_array_by_val( lv_data, gv_user_id );
			  
		      //As per Authorization approve Request
			  
			  if( lv_user_data ) {
			    if( lv_user_data.ex_status != '1' ) {
			      fn_alert( "Information!", "You have already processed this Request! <br>Request Status: " + lv_user_data.es_status );
			    }
			    else {
			      fn_alert( "Information!", "Request Status: " + lv_user_data.es_status );
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
		var lv_assign_req_check = "<?php echo $_SESSION['usr_auth_assign_req']; ?>";
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    if ( lv_assign_req_check == "1" ) {
		      fn_alert( "Information!", "Success!" );
		    }
		    else {
		      fn_alert( "Information!", "You are NOT authorized to assign requests!" );
		    }
		  }
		}
	      });
	  });
	</script>
        </body>
    </html>
