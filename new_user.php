<?php
session_start();
$root = realpath( $_SERVER["DOCUMENT_ROOT"] );
  include "checkstatus.php";
  
  if( $_SESSION['usr_auth_add_user'] == 1 ) {
    
?>

<!DOCTYPE HTML>
    <html>
	<head>
	  <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	  <title>New User</title>
	  <link href="/css/styles.css?version=<?php echo $_SESSION["version"]; ?>" media="screen" rel="stylesheet" />
	  <link href="itwrstyles.css?version=<?php echo $_SESSION["version"]; ?>" media="screen" rel="stylesheet" />
          <link href="/css/global.css?version=<?php echo $_SESSION["version"]; ?>" media="screen" rel="stylesheet" />
	  <link rel="stylesheet" href="/jQuery1.10.1/themes/base/jquery-ui.css?version=<?php echo $_SESSION["version"]; ?>" />
	  <script src="/jQuery1.10.1/jquery-1.9.1.js?version=<?php echo $_SESSION["version"]; ?>"></script>
	  <script src="/jQuery1.10.1/ui/minified/jquery-ui.custom.min.js?version=<?php echo $_SESSION["version"]; ?>"></script>
          <script src="/js/global.js?version=<?php echo $_SESSION["version"]; ?>"></script>
	  <style>
	    div#divInnerContNU table#tblmaincontNU { margin: 0px 0px 0px 43px; height: 243px; padding: 7px; }
	    div#divInnerContNU table#tblmaincontNU td { text-align: right; line-height: 32px; }
            div#divInnerContNU table#tblmaincontNU table td { line-height: 16px; }
	  </style>
	</head>
	
	<body>
          <?php include_once "include_menu.php"; ?>
	  <div class="form_container container_12" id="divheadtitle">
	    <br><br>
	    <center>
	      <span class="clspagetitle">Create New User</span>
	    </center>
	    <br>
	  </div>
          
	  <div id="divMainContNU">
	    <div id="divInnerContNU">
              <table id="tblmaincontNU">
                <tr>
                  <td colspan="3">* All fields are required</td>
                </tr>
                <tr>
                  <td>UserName:</td>
                  <td><input type="text" id="txtusrname" name="txtusrname" /></td>
                </tr>
                <tr>
                  <td>Password:</td>
                  <td><input type="password" id="txtpwd" name="txtpwd" /></td>
                </tr>
                <tr>
                  <td>Confirm Password:</td>
                  <td><input type="password" id="txtcpwd" name="txtcpwd" /></td>
                </tr>
                <tr>
                  <td>First Name:</td>
                  <td><input type="text" id="txtfname" name="txtfname" /></td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td><input type="text" id="txtlname" name="txtlname" /></td>
                </tr>
                <tr>
                  <td>Department:</td>
                  <td><div id="divDept"></div></td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td><input type="text" id="txtemail" name="txtemail" /></td>
                </tr>
                <tr>
                  <td colspan="3"><input type="button" id="btnsubmit" name="btnsubmit" value="Submit" /></td>
                </tr>
              </table>
            </div>
          </div>
          
          <script language="Javascript">
	  $(document).ready( function() {
            
            var gv_chk_errs = [];
            
            var gv_deptStore = new dataStore({
              root: 'items',
              url: '/itwr/ajax_funcs/get_departments',
              fields: [ 'ad_id', 'ad_name' ]
            });
            
            var gv_comboDept = new comboBox({
                id: "cmbDept",
                width: 143,
                container_id: "divDept",
                valueField: "ad_id",
                textField: "ad_name",
                store: gv_deptStore
            });
            gv_comboDept.render();
            
            fn_validate_field = function( v_id ) {
              
              var lv_val = $( "#" + v_id ).val();
              
              var lv_errMsg = new errorMsg({
                id: "errMsgID" + v_id,
                errorFieldId: v_id
              });
              
              var lv_itemOK = new greenCheck({
                id: "itemOKID" + v_id,
                checkFieldId: v_id
              });
              
              if( lv_val ) {
                switch ( v_id ) {
                  case "txtusrname":
                    $.post(
                      "/comcls/UserCtrl.php",
                      { method: "checkUserId", params: { userid: lv_val } },
                      function ( v_data, v_status ) {
                        var lv_data = $.parseJSON( v_data );
                        
                        if( lv_data.result ) {
                          lv_itemOK.remove();
                          lv_errMsg.setErrorText( "UserName unavailable!" );
                          lv_errMsg.render();
                          lv_errMsg.show();
                          gv_chk_errs.push( v_id );
                        }
                        else {
                          lv_errMsg.remove();
                          lv_itemOK.render();
                          lv_itemOK.show();
                          fn_splice_array_elm_by_val( v_id, gv_chk_errs );
                        }
                      }
                    );
                    break;
                  
                  case "txtcpwd":
                    var lv_pwd = $( "#txtpwd" ).val();
                    if( lv_pwd === lv_val ) {
                      lv_errMsg.remove();
                      lv_itemOK.render();
                      lv_itemOK.show();
                      fn_splice_array_elm_by_val( v_id, gv_chk_errs );
                    }
                    else {
                      lv_itemOK.remove();
                      lv_errMsg.setErrorText( "Password & Confirm Password do not match!" );
                      lv_errMsg.render();
                      lv_errMsg.show();
                      gv_chk_errs.push( v_id );
                    }
                    break;
                  
                  case "txtemail":
                    if( fn_validateEmail( lv_val ) ) {
                      lv_errMsg.remove();
                      lv_itemOK.render();
                      lv_itemOK.show();
                      fn_splice_array_elm_by_val( v_id, gv_chk_errs );
                    }
                    else {
                      lv_itemOK.remove();
                      lv_errMsg.setErrorText( "Please enter a valid email!" );
                      lv_errMsg.render();
                      lv_errMsg.show();
                      gv_chk_errs.push( v_id );
                    }
                    break;
                  
                  default:
                    lv_errMsg.remove();
                    lv_itemOK.render();
                    lv_itemOK.show();
                    fn_splice_array_elm_by_val( v_id, gv_chk_errs );
                }
                
              }
              else {
                lv_itemOK.remove();
                lv_errMsg.setErrorText( "Field cannot be empty!" );
                lv_errMsg.render();
                lv_errMsg.show();
                gv_chk_errs.push( v_id );
              }
            }
            
            $( "#txtusrname" ).blur( function() {
              fn_validate_field("txtusrname");
            });
            
            $( "#txtfname" ).blur( function() {
              fn_validate_field("txtfname");
            });
            
            $( "#txtlname" ).blur( function() {
              fn_validate_field("txtlname");
            });
            
            $( "#txtpwd" ).blur( function() {
              fn_validate_field("txtpwd");
            });
            
            $( "#txtcpwd" ).blur( function() {
              fn_validate_field("txtcpwd");
            });
            
            $( "#cmbDept" ).blur( function() {
              fn_validate_field("cmbDept");
            });
            
            $( "#txtemail" ).blur( function() {
              fn_validate_field("txtemail");
            });
            
            fn_validate_form = function() {
              fn_validate_field("txtusrname");
              fn_validate_field("txtfname");
              fn_validate_field("txtlname");
              fn_validate_field("txtpwd");
              fn_validate_field("txtcpwd");
              fn_validate_field("cmbDept");
              fn_validate_field("txtemail");
            }
            
            $( "#btnsubmit" ).on( 'click', function() {
              fn_validate_form();
              
              if( gv_chk_errs.length > 0 ) {
                fn_alert( "Error!", "Please remove errors!");
                return false;
              }
              else {
                var lv_elm_obj = document.getElementById( "tblmaincontNU" );
                var lv_values = fn_serializeFormVals( lv_elm_obj );
                
                $.post( "/comcls/UserCtrl.php", { method: "addUser", params: lv_values }, function( v_data, v_status ) {
                  var lv_data = $.parseJSON( v_data );
                  if( lv_data.success ) {
                    fn_clearElments( "tblmaincontNU" );
                    fn_alert( "Information!", "New User Added Successfully!" );
                  }
                  else {
                    fn_alert( "Error!", lv_data.error );
                  }
                });
                return true;
              }
            });
            
          });
          </script>
          
        </body>
    </html>

<?php
  }
  else {
    die("Sorry, you are not Authorized to use this page! ");
  }
?>
