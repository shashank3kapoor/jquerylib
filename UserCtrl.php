<?php

session_start();
$root = realpath( $_SERVER["DOCUMENT_ROOT"] );

  include_once $root."/comcls/BaseClass.php";
  include_once $root."/comcls/db_con.php";
  include_once $root."/comcls/help_funcs.php";
  include_once $root."/comcls/User.php";

  $method = ( isset( $_POST["method"] ) ) ? "fn_".$_POST["method"] : null;
  $params = ( isset( $_POST["params"] ) ) ? $_POST["params"] : 'false';
  $exParams = ( isset( $_POST["exParams"] ) ) ? $_POST["exParams"] : 'false';
  if( $params == 'false' ) {
    $params = false;
  }
  if( $exParams != 'false' ) {
    if( $params ) {
      $params = array_merge( $params, $exParams );
    }
    else {
      $params = $exParams;
    }
  }
  
  if( is_callable( $method ) ) {
    $method( $params );
  }
  
  
  function fn_checkUserId( $prms = array() ) {
    global $mysqli;
    
    if( isset( $prms["userid"] ) && ( $prms["userid"] ) ) {
      $chkUser = new User();
      $chkUser->loginid = $prms["userid"];
      
      $result = ( $chkUser->getData() ) ? true : false;
      
      echo json_encode( array( "result"=>$result ) );
    }
    else {
      echo json_encode( array( "result"=>false ) );
    }
  }
  
  function fn_addUser( $prms = array() ) {
    if( $_SESSION['usr_auth_assign_req'] == 1 ) {
      global $mysqli;
      
      $validation_check = true;
      
      $newUser = new User();
      if( isset( $prms["txtusrname"] ) && ( $prms["txtusrname"] ) && ( $validation_check ) ) {
        $newUser->loginid = $prms["txtusrname"];
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please enter an UserName!" ) );
      }
      
      if( isset( $prms["txtfname"] ) && ( $prms["txtfname"] ) && ( $validation_check ) ) {
        $newUser->name = $prms["txtfname"];
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please enter First Name!" ) );
      }
      
      if( isset( $prms["txtlname"] ) && ( $prms["txtlname"] ) && ( $validation_check ) ) {
        $newUser->name .= " ".$prms["txtlname"];
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please enter Last Name!" ) );
      }
      
      if( isset( $prms["txtpwd"] ) && ( $prms["txtpwd"] ) && ( $validation_check ) ) {
        $newUser->password = $prms["txtpwd"];
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please enter a password!" ) );
      }
      
      if( isset( $prms["cmbDept"] ) && ( $prms["cmbDept"] ) && ( $validation_check ) ) {
        $newUser->dept_id = $prms["cmbDept"];
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please select a department!" ) );
      }
      
      if( isset( $prms["txtemail"] ) && ( $prms["txtemail"] ) && ( $validation_check ) ) {
	if( fn_validateEmail( $prms["txtemail"] ) ) {
	  $newUser->email = $prms["txtemail"];
	}
        else {
	  $validation_check = false;
	  echo json_encode( array( "success"=>false, "error"=>"Please enter a valid email!" ) );
	}
      }
      else {
	$validation_check = false;
	echo json_encode( array( "success"=>false, "error"=>"Please enter an email!" ) );
      }
      
      if( $validation_check ) {
	$result = $newUser->addData();
	
	echo json_encode( array( "success"=>true, "result"=>$result ) );
      }
      else {
	echo json_encode( array( "success"=>false, "error"=>"Please remove validation errors!" ) );
      }
    }
    else {
      echo json_encode( array( "success"=>false, "error"=>"You are not authorized to perform this action!" ) );
    }
  }
  
  function fn_changePwd( $prms = array() ) {
    if( isset( $_SESSION["UserId"] ) && ( $_SESSION["UserId"] ) ) {
      global $mysqli;
      
      $chkUser = new User();
      $chkUser->id = $_SESSION["UserId"];
      
      if( isset( $prms["txtopwd"] ) && ( $prms["txtopwd"] ) ) {
        $chkUser->password = $prms["txtopwd"];
        
        if( $chkUser->getData() ) {
          $chgPwd = new User();
          $chgPwd->id = $_SESSION["UserId"];
          if( isset( $prms["txtnpwd"] ) && ( $prms["txtnpwd"] ) ) {
            $chgPwd->password = $prms["txtnpwd"];
            
            $result = $chgPwd->updateData();
            
            echo json_encode( array( "success"=>true, "result"=>$result ) );
          }
          else {
            echo json_encode( array( "success"=>false, "error"=>"New Password is empty!" ) );
          }
        }
        else {
          echo json_encode( array( "success"=>false, "error"=>"Incorrect Old Password!" ) );
        }
      }
      else {
        echo json_encode( array( "success"=>false, "error"=>"Old Password is empty!" ) );
      }
      
    }
    else {
      echo json_encode( array( "success"=>false, "error"=>"Session Expired!" ) );
    }
  }
  
?>
