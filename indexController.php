<?php

session_start();
$root = realpath( $_SERVER["DOCUMENT_ROOT"] );

include_once $root."/comcls/Menu.php";

  $method = ( isset( $_POST["method"] ) ) ? "fn_".$_POST["method"] : null;
  $params = ( isset( $_POST["params"] ) ) ? $_POST["params"] : array();
  $exParams = ( isset( $_POST["exParams"] ) ) ? $_POST["exParams"] : array();
  if( $params == 'false' ) {
    $params = false;
  }
  if( $exParams != 'false' ) {
    if( $params != 'false' ) {
      $params = array_merge( $params, $exParams );
    }
    else {
      $params = $exParams;
    }
  }
  
  if( is_callable( $method ) ) {
    $method( $params );
  }
  
  function fn_getMenu( $prms = array() ) {
    $settings = new Element( "settings", "st", "" );
    
    $settings->addMenu( new Menu( "Demo", "dm", "index.php" ) );
    $settings->addMenu( new Menu( "New User", "nu", "#" ) );
    $settings->addMenu( new Menu( "Change Password", "cp", "#" ) );
    $settings->addMenu( new Menu( "Logout", "lg", "#" ) );
    
    $_SESSION["settingsmenu"] = $settings->getElement();
    
    echo json_encode( array( "items"=>$_SESSION["settingsmenu"] ) );
  }
  
  function fn_get_users( $prms = array() ) {
    global $mysqli;
    
    $sql = " SELECT u_id, u_userid, u_fname, u_lname, u_dob, u_status FROM tbl_users WHERE u_status = 1 ";
    if( isset( $prms['u_userid'] ) && ( $prms['u_userid'] ) ) {
      $sql.= " AND u_userid LIKE '%".$mysqli->real_escape_string( $prms['ad_name'] )."%' ";
    }
    if( isset( $prms['u_fname'] ) && ( $prms['u_fname'] ) ) {
      $sql.= " AND u_fname LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_fname'] )."%' ";
    }
    if( isset( $prms['u_lname'] ) && ( $prms['u_lname'] ) ) {
      $sql.= " AND u_lname LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_lname'] )."%' ";
    }
    if( isset( $prms['u_dob'] ) && ( $prms['u_dob'] ) ) {
      $sql.= " AND u_dob LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_dob'] )."%' ";
    }
    
    $objs = array();
    if( $result = $mysqli->query( $sql ) ) {
        while( $obj = $result->fetch_object() ) {
	    $tmp = array();
	    
	    foreach( $obj as $key => $val ) {
	      $tmp[$key] = $val;
	    }
	    
	    $objs[] = $tmp;
        }
        $result->close();
        
        $sql = " SELECT COUNT(u_id) AS totl FROM tbl_users WHERE u_status = 1 ";
        if( isset( $prms['u_userid'] ) && ( $prms['u_userid'] ) ) {
          $sql.= " AND u_userid LIKE '%".$mysqli->real_escape_string( $prms['ad_name'] )."%' ";
        }
        if( isset( $prms['u_fname'] ) && ( $prms['u_fname'] ) ) {
          $sql.= " AND u_fname LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_fname'] )."%' ";
        }
        if( isset( $prms['u_lname'] ) && ( $prms['u_lname'] ) ) {
          $sql.= " AND u_lname LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_lname'] )."%' ";
        }
        if( isset( $prms['u_dob'] ) && ( $prms['u_dob'] ) ) {
          $sql.= " AND u_dob LIKE LIKE '%".$mysqli->real_escape_string( $prms['u_dob'] )."%' ";
        }
        
        $totalCount = 0;
        if( $result = $mysqli->query( $sql ) ) {
          if( $obj = $result->fetch_object() ) {
              
              $totalCount = $obj->totl;
          }
          $result->close();
        }
	
        echo json_encode( array( "success"=>true, "items"=>$objs, "totalCount"=>$totalCount ) );
    }
    else {
      echo json_encode( array( "success"=>false ) );
    }
  }
  
?>
