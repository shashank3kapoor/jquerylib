<?php
session_start();

  if( isset( $_SESSION["version"] ) && ( $_SESSION["version"] ) ) {
    $gv_version = $_SESSION["version"];
  }
  else {
    $_SESSION["version"] = "1.4.3k";
    $gv_version = $_SESSION["version"];
  }
  
  if( isset($_SESSION["UserId"]) && ( $_SESSION["UserId"] ) ) {
?>

<!DOCTYPE HTML>
    <html>
	<head>
	  <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	  <title>Person Matcher</title>
	  <link href="/css/styles.css?version=<?php echo $gv_version; ?>" media="screen" rel="stylesheet" />
          <link href="/css/global.css?version=<?php echo $gv_version; ?>" media="screen" rel="stylesheet" />
	  <link rel="stylesheet" href="/jQuery1.10.1/themes/base/jquery-ui.css?version=<?php echo $gv_version; ?>" />
          <link href="personmatcher.css?version=<?php echo $gv_version; ?>" media="screen" rel="stylesheet" />
	  <script src="/jQuery1.10.1/jquery-1.9.1.js?version=<?php echo $gv_version; ?>"></script>
	  <script src="/jQuery1.10.1/ui/minified/jquery-ui.custom.min.js?version=<?php echo $gv_version; ?>"></script>
          <script src="/js/global.js?version=<?php echo $gv_version; ?>"></script>
	</head>
	
	<body>
	  <div id="user" style="margin-top:0px;float:right;margin-right:10px;font-size:12px;FONT-FAMILY: Arial;" > <?php echo $_SESSION["dinersUserID"]?> | <a href="../Login.php"> Log out</a></div>
          <div id="divheadtitle">
	    <br><br>
	    <center>
	      <span style="color: #106bad;font-size: 28px;height: 36px;vertical-align: middle;">Person Matcher</span>
	    </center>
	    <br>
	  </div>
          
	  <div>
	    <fieldset id="fldstsrchperson">
	      <legend>Search & Select Main Account!</legend>
		<div id="divsrchfltr">
		  <fieldset>
		    <legend>Search Filter</legend>
		    <table>
		      <tr>
			<td></td>
			<td>Date of Birth</td>
			<td>Address</td>
		      </tr>
		      <tr>
			<td></td>
			<td><input type="text" id="txtdob" name="txtdob" /> </td>
			<td><input type="text" id="txtaddress" name="txtaddress" /></td>
		      </tr>
		      <tr>
			<td>First Name</td>
			<td>Middle Name</td>
			<td>Last Name</td>
		      </tr>
		      <tr>
			<td><input type="text" id="txtfname" name="txtfname" /></td>
			<td><input type="text" id="txtmname" name="txtmname" /></td>
			<td><input type="text" id="txtlname" name="txtlname" /></td>
		      </tr>
		      <tr>
			<td colspan="3" style="text-align: center;">
			    <div class="clssrchbtns">
			      <table class="clssrchbtnstbl">
				<tr>
				  <td><input type="button" id="btnsearch" name="btnsearch" value="Search" /></td>
				  <td><input type="button" id="btnclear" name="btnclear" value="Clear" /></td>
				</tr>
			      </table>
			    </div>
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
		
		<div id="divgridcont"><div id="divPerMatch"></div></div>
	    </fieldset>
	    
	    <fieldset id="fldstmatchperson">
	      <legend>Search & Link Account(s)!</legend>
		<div id="divsrchfltrm">
		  <fieldset>
		    <legend>Search Filter</legend>
		    <table>
		      <tr>
			<td></td>
			<td>Date of Birth</td>
			<td>Address</td>
		      </tr>
		      <tr>
			<td></td>
			<td><input type="text" id="txtdobm" name="txtdobm" /> </td>
			<td><input type="text" id="txtaddressm" name="txtaddressm" /></td>
		      </tr>
		      <tr>
			<td>First Name</td>
			<td>Middle Name</td>
			<td>Last Name</td>
		      </tr>
		      <tr>
			<td><input type="text" id="txtfnamem" name="txtfnamem" /></td>
			<td><input type="text" id="txtmnamem" name="txtmnamem" /></td>
			<td><input type="text" id="txtlnamem" name="txtlnamem" /></td>
		      </tr>
		      <tr>
			<td colspan="3" style="text-align: center;">
			    <div class="clssrchbtns">
			      <table class="clssrchbtnstbl">
				<tr>
				  <td><input type="button" id="btnsearchm" name="btnsearchm" value="Search" /></td>
				  <td><input type="button" id="btnclearm" name="btnclearm" value="Clear" /></td>
				</tr>
			      </table>
			    </div>
			</td>
		      </tr>
		    </table>
		  </fieldset>
		</div>
		
		<div id="divactionsm">
		  <table>
		      <tr>
			<td>
			  <input type="button" id="btnlinkperson" name="btnlinkperson" value="Link & Save Selected" />
			</td>
		      </tr>
		  </table>
		</div>
		
		<div id="divgridcontm"><div id="divPerMatchM"></div></div>
	    </fieldset>
	    
	    <div id="divlinkedperson">
	      <fieldset id="fldstlinkedperson">
		<legend>Linked Account(s)</legend>
		  
		  <div id="divactionsl">
		    <table>
			<tr>
			  <td>
			    <input type="button" id="btnmaintperson" name="btnmaintperson" value="Maintain Links" />
			  </td>
			</tr>
		    </table>
		  </div>
		  
		  <div id="divgridcontl"><div id="divPerMatchL"></div></div>
	      </fieldset>
	    </div>
	  </div>
          
<!--  Div Templates	  -->

	  <div id="divHPDetailsWin" style="display: none;">   <!--Div for displaying details of the record selected-->
		  <table>
		    <tr>
		      <td class="clstdlblsbhd"><div class="labelsubheading">Customer #: </div></td>
		      <td><div id="customer_iid"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd"><div class="labelsubheading">Name: </div></td>
		      <td><div id="name"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd"><div class="labelsubheading">Date of Birth (DD/MM/YYYY): </div></td>
		      <td><div id="birthday"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd">
			<div class="labelsubheading">Address: </div>
		      </td>
		      <td><div id="address"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd">
			<div class="labelsubheading">Licence #: </div>
		      </td>
		      <td><div id="licence_no"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd">
			<div class="labelsubheading">Licence Version: </div>
		      </td>
		      <td><div id="licence_ver"></div></td>
		    </tr>
		    <tr>
		      <td class="clstdlblsbhd">
			<div class="labelsubheading">Passport #: </div>
		      </td>
		      <td><div id="passport_no"></div></td>
		    </tr>
		  </table>
	  </div> <!--End of Div for displaying details of the record selected-->
	  
	  
        <script language="Javascript">
	  $(document).ready( function() {
            
            $( "#txtdob" ).datepicker( {dateFormat : "dd/mm/yy" });
	    
	    var gv_grdPerMatch = "";
	    var gv_selectedHPRec = null;
	    var gv_selectedIndex = null;
	    var gv_grdPerMatchM = "";
	    var gv_grdPerMatchL = "";
	    
	    //To view the HP details
	    fn_viewHPDetails = function( v_obj, v_rec, v_idx, v_mskElm ) {
	      var  lv_selectedRow = null;
	      if( v_obj != undefined ) {
		lv_selectedRow = v_obj.getSelectedRow();
	      }
	      
	      if( !v_mskElm ) {
		v_mskElm = false;
	      }
	      
	      if( lv_selectedRow ) {
		var lv_loadingMask = new loadingMask({
		  id: 'loadingMask' + v_mskElm,
		  masked: true,
		  maskElementId: v_mskElm
		});
		lv_loadingMask.render();
		lv_loadingMask.show();
		
		$.post(
		      "/PersonMatcher/data.php",
		      {
			method: "getPerMatchData",
			params: { person_id: lv_selectedRow.person_id, oth_rec: true, pp_dl: true }
		      },
		      function ( v_data, v_status ) {
			var lv_data = $.parseJSON( v_data );
			if( lv_data.success ) {
			  
			  var lv_detailsWin = new windowPanel({
			      id: 'winHPDetails' + v_mskElm,
			      width: 543,
			      data: lv_data.items[0],
			      elementsDiv_id: 'divHPDetailsWin',
			      title: 'Details',
			      masked: true,
			      maskElementId: v_mskElm,
			      buttons: [{
				id: 'btnclosehpdetails',
				text: 'Close',
				handler: function() {
				  lv_detailsWin.hide();
				}
			      }]
			    });
			    lv_detailsWin.render();
			    lv_detailsWin.show();
			}
			else {
			  fn_alert( "Error!", lv_data.error );
			}
			lv_loadingMask.hide();
		      }
		);
	      }
	      else {
		fn_alert( "Information!", "Please select a record." );
	      }
	    }
            
            var gv_personMatcherStore = new dataStore({
              url: '/PersonMatcher/data/getPerMatchData',
              root: 'items',
              fields: [ 'customer_iid', 'name', 'birthday', 'address' ],
              exParams: { sortCol: 'name', sortOrder: 'asc' },
	      baseParams: { oth_rec: true },
	      totalProperty: 'totalCount'
            });
            
            gv_grdPerMatch = new gridPanel({
              id: "grdPerMatchId",
              height: 243,
              width: 543,
              container_id: "divPerMatch",
              store: gv_personMatcherStore,
              paging: true,
              pageSize: 20,
	      afterRender: function( v_obj ) {
		v_obj.selectRow( gv_selectedIndex );
	      },
              headers: [{
                  headerText: 'Name',
                  width: 83,
                  dataIndex: 'name'
                },{
                  headerText: 'DOB',
                  width: 63,
                  dataIndex: 'birthday'
                },{
                  headerText: 'Address',
                  width: 143,
                  dataIndex: 'address'
                }],
	      listeners: {
		dblclick: function( v_obj, v_rec, v_idx ) {
		  fn_viewHPDetails( v_obj, v_rec, v_idx, 'divgridcont' );
		},
		click: function( v_obj, v_rec, v_idx ) {
		  gv_selectedHPRec = v_rec;
		  var lv_record = v_rec;
		  gv_selectedIndex = v_obj.getSelectedRowIndex();
		  
		  if( lv_record ) {
		    var lv_cr_group_id = parseInt( lv_record.cr_group_id );
		    var lv_person_id = parseInt( lv_record.person_id );
		    
		    if( lv_cr_group_id ) {
		      //Refresh 'Linking Grid'
		      gv_grdPerMatchM.store.baseParams = {
			    oth_rec: true,
			    customer_iid: $( "#txtcustnom" ).val(),
			    fname: $( "#txtfnamem" ).val(),
			    mname: $( "#txtmnamem" ).val(),
			    lname: $( "#txtlnamem" ).val(),
			    dob: $( "#txtdobm" ).val(),
			    address: $( "#txtaddressm" ).val(),
			    cr_group_id: lv_cr_group_id
		      };
		      gv_grdPerMatchM.refreshGrid();
		      
		      //Refresh 'Linked Grid'
		      gv_grdPerMatchL.store.baseParams = {
			    oth_rec: true,
			    cr_group_id: lv_cr_group_id,
			    exld_person_id: lv_person_id
		      };
		      gv_grdPerMatchL.refreshGrid();
		    }
		    else {
		      //Clear 'Matching Grid'
		      gv_grdPerMatchM.clearData();
		      
		      //Clear 'Linked Grid'
		      gv_grdPerMatchL.clearData();
		    }
		  }
		}
	      }
            });
            
            //Refresh Grid
	      fn_refreshPerMatchGrid = function() {
		//Clear 'Matching Grid'
		gv_grdPerMatchM.clearData();
		
		//Clear 'Linked Grid'
		gv_grdPerMatchL.clearData();
		
		var lv_fname = $( "#txtfname" ).val();
		var lv_mname = $( "#txtmname" ).val();
		var lv_lname = $( "#txtlname" ).val();
		var lv_dob = $( "#txtdob" ).val();
		var lv_address = $( "#txtaddress" ).val();
		
		if( lv_fname || lv_mname || lv_lname || lv_dob || lv_address ) {
		  gv_grdPerMatch.store.baseParams = {
			oth_rec: true,
			fname: lv_fname,
			mname: lv_mname,
			lname: lv_lname,
			dob: lv_dob,
			address: lv_address
		  };
		  gv_grdPerMatch.refreshGrid();
		}
		else {
		  fn_alert( "Message", "All fields cannot be empty while Searching!" );
		}
	      }
	      
	      $( "#txtfname" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGrid();
		  }
	      });
	      
	      $( "#txtmname" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGrid();
		  }
	      });
	      
	      $( "#txtlname" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGrid();
		  }
	      });
	      
	      $( "#txtdob" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGrid();
		  }
	      });
	      
	      $( "#txtaddress" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGrid();
		  }
	      });
	      
	      //Clear fields
	      $( "#btnclear" ).on( 'click', function() { fn_clearElments("divsrchfltr"); });
	      
	      //Search button Click event
	      $( "#btnsearch" ).on( 'click', fn_refreshPerMatchGrid );
            
            $( "#txtdobm" ).datepicker( {dateFormat : "dd/mm/yy" });
            
            var gv_personMatcherStoreM = new dataStore({
              url: '/PersonMatcher/data/getPerMatchData',
              root: 'items',
              fields: [ 'customer_iid', 'name', 'birthday', 'address' ],
              exParams: { sortCol: 'name', sortOrder: 'asc' },
	      baseParams: { oth_rec: true },
	      totalProperty: 'totalCount'
            });
            
            gv_grdPerMatchM = new gridPanelChecked({
              id: "grdPerMatchMId",
              height: 243,
              width: 543,
              container_id: "divPerMatchM",
              store: gv_personMatcherStoreM,
              paging: true,
              pageSize: 20,
	      checkBoxRenderer: function( v_obj, v_rec ) {
		var lv_selectedRow = gv_grdPerMatch.getSelectedRow();
		
		var lv_record = lv_selectedRow;
		  if( lv_record ) {
		    var lv_fst_person_id = parseInt( lv_record.person_id );
		    if( lv_fst_person_id == parseInt( v_rec.person_id ) ) {
		      v_obj.disabled = true;
		      v_obj.title = "This is the main record and will get linked automatically!";
		    }
		  }
		
		return v_obj;
	      },
              headers: [{
                  headerText: 'Name',
                  width: 83,
                  dataIndex: 'name'
                },{
                  headerText: 'DOB',
                  width: 63,
                  dataIndex: 'birthday'
                },{
                  headerText: 'Address',
                  width: 143,
                  dataIndex: 'address'
                },{
		  headerText: 'Linked',
		  width: 43,
		  dataIndex: 'cr_status',
		  renderer: function( v_obj, v_rec, v_val ) {
		    if( parseInt( v_val ) == 1 ) {
		      v_obj.innerHTML = "<img src='/images/tick.png' />";
		    }
		    else {
		      v_obj.innerHTML = "<img src='/images/cross.png' />";
		    }
		    v_obj.style.textAlign = "center";
		    
		    return v_obj;
		  }
		}],
	      listeners: {
		dblclick: function( v_obj, v_rec, v_idx ) {
		  fn_viewHPDetails( v_obj, v_rec, v_idx, 'divgridcontm' );
		}
	      }
            });
	    
	    //Refresh Grid
	      fn_refreshPerMatchGridM = function() {
		
		var lv_fname = $( "#txtfnamem" ).val();
		var lv_mname = $( "#txtmnamem" ).val();
		var lv_lname = $( "#txtlnamem" ).val();
		var lv_dob = $( "#txtdobm" ).val();
		var lv_address = $( "#txtaddressm" ).val();
		
		if( lv_fname || lv_mname || lv_lname || lv_dob || lv_address ) {
		  gv_grdPerMatchM.store.baseParams = {
			oth_rec: true,
			fname: lv_fname,
			mname: lv_mname,
			lname: lv_lname,
			dob: lv_dob,
			address: lv_address
		  };
		  gv_grdPerMatchM.refreshGrid();
		}
		else {
		  fn_alert( "Message", "All fields cannot be empty while Searching!" );
		}
	      }
	      
	      $( "#txtfnamem" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGridM();
		  }
	      });
	      
	      $( "#txtmnamem" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGridM();
		  }
	      });
	      
	      $( "#txtlnamem" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGridM();
		  }
	      });
	      
	      $( "#txtdobm" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGridM();
		  }
	      });
	      
	      $( "#txtaddressm" ).keyup( function(e) {
		  if( e.keyCode == 13 ) {
		    fn_refreshPerMatchGridM();
		  }
	      });
	      
	      //Clear fields
	      $( "#btnclearm" ).on( 'click', function() { fn_clearElments("divsrchfltrm"); });
	    
	    //Search button Click event
	      $( "#btnsearchm" ).on( 'click', fn_refreshPerMatchGridM );
            
	    fn_linkPersonRecords = function() {
	      var lv_selectedRecords =  gv_grdPerMatchM.getSelectedRecords();
	      
	      if( gv_selectedHPRec == null ) {
		fn_alert( "Invalid Action!", "Please select a record, from the 'Main' grid." );
	      }
	      else if( lv_selectedRecords == "{}" ) {
		fn_alert( "Invalid Action!", "Please select record(s) to link, from the 'Links' grid." );
	      }
	      else {
		fn_confirm( "Confirm Linking!", "Are you sure you want to link the selected record(s)?", function( v_obj ) {
		  if( v_obj.yes ) {
		    
		    $.post(
		      "CustomerRelationCtrl.php",
		      {
			method: "matchPersonRecords",
			params: { hp_rec: gv_selectedHPRec, match_recs: lv_selectedRecords }
		      },
		      function ( v_data, v_status ) {
			var lv_data = $.parseJSON( v_data );
			if( lv_data.success ) {
			  fn_alert( "Success!", lv_data.msg );
			  
			  gv_grdPerMatchM.refreshGrid();
			  fn_refreshPerMatchGridL();
			  fn_refreshPerMatchGrid();
			}
			else {
			  fn_alert( "Error!", lv_data.error );
			}
		      }
		    );
		  }
		});
		
	      }
	    }
	    
	    //View Details button Click event
	      $( "#btnViewDetails" ).on( 'click', function() {
		fn_viewHPDetails( gv_grdPerMatch, false, false, 'divgridcont' );
	      });
	    
	    //Link button Click event
	      $( "#btnlinkperson" ).on( 'click', fn_linkPersonRecords );
            
            var gv_personMatcherStoreL = new dataStore({
              url: '/PersonMatcher/data/getPerMatchData',
              root: 'items',
              fields: [ 'customer_iid', 'name', 'birthday', 'address' ],
              exParams: { sortCol: 'name', sortOrder: 'asc' },
	      baseParams: { oth_rec: true },
	      totalProperty: 'totalCount'
            });
            
            gv_grdPerMatchL = new gridPanelChecked({
              id: "grdPerMatchLId",
              height: 243,
              width: 543,
              container_id: "divPerMatchL",
              store: gv_personMatcherStoreL,
              paging: true,
              pageSize: 20,
	      checkBoxRenderer: function( v_obj, v_rec ) {
		if( parseInt( v_rec.cr_status ) == 1 ) {
		  v_obj.checked = true;
		}
		
		return v_obj;
	      },
              headers: [{
                  headerText: 'Name',
                  width: 83,
                  dataIndex: 'name'
                },{
                  headerText: 'DOB',
                  width: 63,
                  dataIndex: 'birthday'
                },{
                  headerText: 'Address',
                  width: 143,
                  dataIndex: 'address'
                },{
		  headerText: 'Linked',
		  width: 43,
		  dataIndex: 'cr_status',
		  renderer: function( v_obj, v_rec, v_val ) {
		    if( parseInt( v_val ) == 1 ) {
		      v_obj.innerHTML = "<img src='/images/tick.png' />";
		    }
		    else {
		      v_obj.innerHTML = "<img src='/images/cross.png' />";
		    }
		    v_obj.style.textAlign = "center";
		    
		    return v_obj;
		  }
		}],
	      listeners: {
		dblclick: function( v_obj, v_rec, v_idx ) {
		  fn_viewHPDetails( v_obj, v_rec, v_idx, 'divgridcontl' );
		}
	      }
            });
	    
	    //Refresh Grid
	      fn_refreshPerMatchGridL = function() {
		var lv_record = gv_selectedHPRec;
		  if( lv_record ) {
		    var lv_cr_group_id = parseInt( lv_record.cr_group_id );
		    var lv_person_id = parseInt( lv_record.person_id );
		    
		    if( lv_cr_group_id ) {
		      gv_grdPerMatchL.store.baseParams = {
			    oth_rec: true,
			    cr_group_id: lv_cr_group_id,
			    exld_person_id: lv_person_id
		      };
		      gv_grdPerMatchL.refreshGrid();
		    }
		  }
	      }
            
	    fn_maintainPersonRecords = function() {
	      var lv_selectedRecords =  gv_grdPerMatchL.getSelectedRecords();
	      
	      if( gv_selectedHPRec == null ) {
		fn_alert( "Invalid Action!", "Please select a record, from the 'Main' grid." );
	      }
	      else {
		fn_confirm( "Confirm Modification!", "Are you sure you want to keep the selected records?", function( v_obj ) {
		  if( v_obj.yes ) {
		    
		    $.post(
		      "CustomerRelationCtrl.php",
		      {
			method: "maintainPersonRecords",
			params: { hp_rec: gv_selectedHPRec, match_recs: lv_selectedRecords }
		      },
		      function ( v_data, v_status ) {
			var lv_data = $.parseJSON( v_data );
			if( lv_data.success ) {
			  fn_alert( "Success!", lv_data.msg );
			  
			  fn_refreshPerMatchGridL();
			  
			  var lv_record = gv_selectedHPRec;
			  if( lv_record ) {
			    var lv_cr_group_id = parseInt( lv_record.cr_group_id );
			    if( lv_cr_group_id ) {
			      //Refresh 'Linking Grid'
			      gv_grdPerMatchM.store.baseParams = {
				    oth_rec: true,
				    fname: $( "#txtfnamem" ).val(),
				    mname: $( "#txtmnamem" ).val(),
				    lname: $( "#txtlnamem" ).val(),
				    dob: $( "#txtdobm" ).val(),
				    address: $( "#txtaddressm" ).val(),
				    cr_group_id: lv_cr_group_id
			      };
			      gv_grdPerMatchM.refreshGrid();
			      fn_refreshPerMatchGrid();
			    }
			  }
			}
			else {
			  fn_alert( "Error!", lv_data.error );
			}
		      }
		    );
		  }
		});
		
	      }
	    }
	    
	    //Link button Click event
	      $( "#btnmaintperson" ).on( 'click', fn_maintainPersonRecords );
	    
          });
            
        </script>
        </body>
    </html>
    
<?php

  }
  else {
    header("Location:../Login.php");
  }
  
?>
