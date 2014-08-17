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
    $wr_status = 1;
    
    $sql = " INSERT INTO app_work_request(wr_date,wr_rqstr_id,wr_title,wr_objective,wr_it_staff_id,wr_exptd_date_completion,wr_stake_hldr_id,wr_doc_path,wr_status) ";
    $sql.= " VALUES(?,?,?,?,?,?,?,?,?) ";
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
        $stmt->bind_param( "sissisiss", $wr_date, $wr_rqstr_id, $wr_title, $wr_objective, $wr_it_staff_id, $wr_exptd_date_completion, $wr_stake_hldr_id, $wr_doc_path, $wr_status );
        $reslt = $stmt->execute();
	if( !$reslt ) {
	    die($mysqli->error);
	}
        $stmt->close();
    }
    else {
        echo "\nERROR: could not prepare SQL statement: ";
    }
 }
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
		      <div class="clstblelmsTop clslabelbg">Stakeholder Sign Off</div>
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
		  <td style="width: 100%; float: right;">
		    <input type="button" id="btnclose" name="btnclose" value="Close" onclick="fn_close_details();" />
		  </td>
		</tr>
		
	      </table>
	  </div>
	  
<!--  End of Div Templates	  -->
          <script language="Javascript">
	  $(document).ready( function() {
	    $( "#txtrqdate" ).datepicker( {dateFormat : "dd/mm/yy" });
	    $( "#txtexpcompdate" ).datepicker( {dateFormat : "dd/mm/yy" });
            var lv_grdPnlReqReg = "";
	    var lv_detailsWin = "";
	    
	      //Populate 
	      $.post(
		"ajax_funcs.php",
		{
                  method: "get_wkrq_list"
                },
		function ( v_data, v_status ) {
                  var lv_data = $.parseJSON( v_data );
                  var lv_data_json = JSON.stringify( lv_data.items );
                  
		    lv_grdPnlReqReg = new gridPanel({
                        id: "grdPnlReqReg",
                        height: 343,
			width: 843,
                        container_id: "divReqReg",
                        headers:  [{
                            headerText: 'Request ID',
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
                        data: lv_data_json
                    });
		}
	      );
	      
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
	      lv_cmbStatus.render();
	      
	      //Refresh Grid
	      fn_refreshReqGrid = function() {
		  $.post(
		    "ajax_funcs.php",
		    {
		      method: "get_wkrq_list",
		      params: {
			wr_id: $( "#txtrqid" ).val(),
			wr_date: $( "#txtrqdate" ).val(),
			wr_exptd_date_completion: $( "#txtexpcompdate" ).val(),
			rqstr_name: $( "#txtcreatedby" ).val(),
			wr_title: $( "#txttitle" ).val(),
			wr_status: $( "#cmbStatus" ).val()
		      }
		    },
		    function ( v_data, v_status ) {
		      var lv_data = $.parseJSON( v_data );
		      var lv_data_json = JSON.stringify( lv_data.items );
		      if( lv_grdPnlReqReg != "" ) {
			lv_grdPnlReqReg.refreshGrid( lv_data_json );
		      }
		      
		    }
		  ); 
	      }
	      fn_refreshReqGrid();
	      
	      //Search button Click event
	      $( "#btnsearch" ).on( 'click', fn_refreshReqGrid );
	      
	      //Get Details of Selected Row
	      $( "#btnViewDetails" ).on( 'click', function() {
		var lv_selectedRow = null;
		if( lv_grdPnlReqReg != "" ) {
		  lv_selectedRow = lv_grdPnlReqReg.getSelectedRow();
		  
		  if ( lv_selectedRow == null ) {
		    fn_alert( "Information!", "Please select at least one record." );
		  }
		  else {
		    lv_detailsWin = new windowPanel({
		      id: 'winDetails',
		      width: 820,
		      data: lv_selectedRow,
		      elementsDiv_id: "divDetailsWin",
		      title: "Details",
		      masked: true
		    });
		    lv_detailsWin.render();
		    lv_detailsWin.show();
		  }
		}
	      });
	      
	      fn_close_details = function() {
		lv_detailsWin.hide();
	      }
	  });
	</script>
        </body>
    </html>
