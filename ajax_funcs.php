<?php

session_start();

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
  
  function fn_cmp_dept($a, $b) {
    return strcmp( $a['ad_name'], $b['ad_name'] );
  }
  
  function fn_get_departments( $prms = array() ) {
    global $mysqli;
    $sql = " SELECT ad_id, ad_name FROM app_department WHERE UPPER(ad_status) = 'ACTIVE' ";
    if( isset( $prms['ad_id'] ) ) {
      $sql.= " AND ad_id=".intval( $prms['ad_id'] );
    }
    if( isset( $prms['ad_name'] ) ) {
      $ad_name = "%".$mysqli->real_escape_string( $prms['ad_name'] )."%";
      $sql.= " AND ad_name LIKE '".$ad_name."' ";
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
	
	usort( $objs, "fn_cmp_dept" );
	
        echo json_encode( array( "success"=>true, "items"=>$objs ) );
    }
    else {
      echo json_encode( array( "success"=>false ) );
    }
    
  }
  
  
  function fn_cmp_name($a, $b) {
    return strcmp( $a['name'], $b['name'] );
  }
  
  function fn_get_people_by_department( $prms = array() ) {
    global $mysqli;
    
    $sql = " SELECT id, name FROM app_login_details WHERE name IS NOT NULL ";
    if( isset( $prms['dept_id'] ) ) {
      $sql.= " AND dept_id =".intval( $prms['dept_id'] );
    }
    if( isset( $prms['dept_name'] ) ) {
      $ad_name = $mysqli->real_escape_string( $prms['dept_name'] );
      $sql.= " AND dept_id = ( SELECT ad_id FROM app_department WHERE ad_name = '".$ad_name."' )";
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
	
	usort( $objs, "fn_cmp_name" );
	
        echo json_encode( array( "success"=>true, "items"=>$objs ) );
    }
    else {
      echo json_encode( array( "success"=>false ) );
    }
    
  }
  
  function fn_get_wkrq_list( $prms = array() ) {
    global $mysqli;
    
    $sql = " SELECT wr_id, wr_date, wr_exptd_date_completion, wr_objective, wr_doc_path, aldrq.name AS rqstr_name, ad.ad_name AS dept_name, wr_title, aldit.name AS it_staff_name, aldsthd.name AS stake_hldr_name, wr_stake_hldr_id, wr_stake_hldr_status, wr_stake_hldr_status AS stake_hldr_status, wr_status, wr_status AS req_status FROM app_work_request awr ";
    $sql.= " LEFT OUTER JOIN app_login_details aldrq ON aldrq.id = awr.wr_rqstr_id ";
    $sql.= " LEFT OUTER JOIN app_department ad ON ad.ad_id = aldrq.dept_id ";
    $sql.= " LEFT OUTER JOIN app_login_details aldit ON aldit.id = awr.wr_it_staff_id ";
    $sql.= " LEFT OUTER JOIN app_login_details aldsthd ON aldsthd.id = awr.wr_stake_hldr_id ";
    $sql.= " WHERE awr.wr_status <> 7 ";
    
    if( isset($prms['wr_id']) && ( $prms['wr_id'] ) ) {
      $sql.= " AND wr_id = ".intval($prms['wr_id']);
    }
    
    if( isset($prms['wr_date']) && ( $prms['wr_date'] ) ) {
      $wr_date = $mysqli->real_escape_string($prms['wr_date']);
      $wr_date = fn_date_user_to_db_format( $wr_date );
      $sql.= " AND wr_date = '".$wr_date."' ";
    }
    
    if( isset($prms['wr_exptd_date_completion']) && ( $prms['wr_exptd_date_completion'] ) ) {
      $wr_exptd_date_completion = $mysqli->real_escape_string($prms['wr_exptd_date_completion']);
      $wr_exptd_date_completion = fn_date_user_to_db_format( $wr_exptd_date_completion );
      $sql.= " AND wr_exptd_date_completion = '".$wr_exptd_date_completion."' ";
    }
    
    if( isset($prms['rqstr_name']) && ( $prms['rqstr_name'] ) ) {
      $sql.= " AND aldrq.name LIKE '%".$mysqli->real_escape_string($prms['rqstr_name'])."%' ";
    }
    
    if( isset($prms['wr_title']) && ( $prms['wr_title'] ) ) {
      $sql.= " AND wr_title LIKE '%".$mysqli->real_escape_string($prms['wr_title'])."%' ";
    }
    
    if( isset($prms['wr_status']) && ( $prms['wr_status'] ) ) {
      $sql.= " AND wr_status = ".intval($prms['wr_status']);
    }
    
    if( isset($prms['sortCol']) && ( $prms['sortCol'] ) ) {
      if( isset($prms['sortOrder']) && ( $prms['sortOrder'] ) ) {
	$sql.= " ORDER BY ".$prms['sortCol']." ".$prms['sortOrder'];
	$sql.= " , wr_id ";
      }
      else {
	$sql.= " ORDER BY ".$prms['sortCol']." asc ";
	$sql.= " , wr_id ";
      }
    }
    else {
      $sql.= " ORDER BY wr_id asc ";
    }
    
    
    $objs = array();
    if( $result = $mysqli->query( $sql ) ) {
        while( $obj = $result->fetch_object() ) {
	    $tmp = array();
	    
	    foreach( $obj as $key => $val ) {
	      switch( $key ) {
		case "wr_date":
		case "wr_exptd_date_completion":
		  $tmp[$key] = fn_date_db_to_user_format( $val );
		  break;
		
		case "wr_status":
		case "wr_stake_hldr_status":
		  switch( $val ) {
		    case 1:
		      $tmp[$key] = "For Approval";
		      break;
		    case 2:
		      $tmp[$key] = "Approved";
		      break;
		    case 3:
		      $tmp[$key] = "Assigned";
		      break;
		    case 4:
		      $tmp[$key] = "Completed";
		      break;
		    case 5:
		      $tmp[$key] = "Rejected";
		      break;
		    case 6:
		      $tmp[$key] = "Cancelled";
		      break;
		    case 7:
		      $tmp[$key] = "Archived";
		      break;
		    default:
		      $tmp[$key] = "Unknown Status";
		  }
		  break;
		
		default:
		  $tmp[$key] = $val;
	      }
	    }
	    
	    $objs[] = $tmp;
        }
        $result->close();
	
        echo json_encode( array( "success"=>true, "items"=>$objs ) );
    }
    else {
      echo json_encode( array( "success"=>false ) );
    }
  }
  
  function fn_getExecutiveList( $prms = array() ) {
    global $mysqli;
	
    if( isset($prms['wr_id']) && ( $prms['wr_id'] ) ) {
      $sql_excu = " SELECT ld.name, ld.id, es.es_status, es.es_status AS ex_status FROM app_executive_signoff es ";
      $sql_excu.= " LEFT OUTER JOIN app_login_details ld ON ld.id = es.es_excu_id ";
      $sql_excu.= " WHERE es.es_wr_id = ".intval( $prms['wr_id'] );
      
      if( isset( $prms['usr_id'] ) && ( $prms['usr_id'] ) ) {
	$sql_excu.= " AND es.es_excu_id = ".intval( $_SESSION['UserId'] );
      }
      
      if( $result = $mysqli->query( $sql_excu ) ) {
	$data = array();
	while( $obj = $result->fetch_object() ) {
	  $tmp = array();
	    foreach( $obj AS $key => $val ) {
	      switch( $key ) {
		case "es_status":
		  switch( $val ) {
		    case 1:
		      $tmp[$key] = "For Approval";
		      break;
		    case 2:
		      $tmp[$key] = "Approved";
		      break;
		    case 3:
		      $tmp[$key] = "Assigned";
		      break;
		    case 4:
		      $tmp[$key] = "Completed";
		      break;
		    case 5:
		      $tmp[$key] = "Rejected";
		      break;
		    case 6:
		      $tmp[$key] = "Cancelled";
		      break;
		    case 7:
		      $tmp[$key] = "Archived";
		      break;
		    default:
		      $tmp[$key] = "Unknown Status";
		  }
		  break;
		
		default:
		  $tmp[$key] = $val;
	      }
	    }
	  $data[] = $tmp;
	}
	$result->close();
	
	echo json_encode( array( "success"=>true, "items"=>$data ) );
      }
      else {
	echo json_encode( array( "success"=>false ) );
      }
      
    }
    else {
      echo json_encode( array( "success"=>false ) );
    }
  }

?>
