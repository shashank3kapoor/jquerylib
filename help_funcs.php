<?php
  function fn_csv_to_array($filename='', $delimiter=',') {
      if(!file_exists($filename) || !is_readable($filename))
          return FALSE;
      
      $header = NULL;
      $data = array();
      if (($handle = fopen($filename, 'r')) !== FALSE)
      {
          while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
          {
              if(!$header)
                  $header = $row;
              else
                  $data[] = array_combine($header, $row);
          }
          fclose($handle);
      }
      return $data;
  }
  
  function fn_query_to_csv( $mysqli, $sql, $filename, $attachment = false, $headers = true, $headerArry = false ) {
      if( $attachment || is_writable( $filename ) ) {
	if($attachment) {
	    // send response headers to the browser
	    //header( 'Content-Type: text/csv' );
	    header('Content-Type: application/octet-stream');
	    header( 'Content-Disposition: attachment;filename="'.$filename.'"' );
	    header("Pragma: ");
	    header("Cache-Control: ");
	    $fp = fopen('php://output', 'w');
	} else {
	    $fp = fopen( $filename, 'w');
	}
	
	if( $result = $mysqli->query( $sql ) ) {
	  if( $headers ) {
	      // output header row (if at least one row exists)
	      if( $row = $result->fetch_object() ) {
		$header_keys = array();
		if( $headerArry ) {
		  $header_keys = $headerArry;
		}
		else {
		  foreach( $row AS $key => $val ) {
		    $header_keys[] = $key;
		  }
		}
		
		fputcsv( $fp, $header_keys );
		// reset pointer back to beginning
		mysql_data_seek( $result, 0 );
	      }
	  }
	  
	  while( $row = $result->fetch_object() ) {
	    $obj = array();
		foreach( $row AS $key => $val ) {
		  $obj[$key] = $val;
		}
	      fputcsv($fp, $obj);
	  }
	  $result->close();
	}
	else {
	    fputcsv($fp, "No records found!");
	}
	
	fclose($fp);
	
	return true;
      }
      else {
	return false;
      }
  }

  function fn_search_array_by_val( $srchArry, $srchVal ) {
    $retArry = $srchArry;
      foreach( $srchArry AS $key=>$val ) {
        if( ( $val === $srchVal ) || ( is_array( $val ) && ( $retArry = fn_search_array_by_val( $val, $srchVal ) ) ) ) {
          return $retArry;
        }
      }
      return FALSE;
  }
  
  function fn_date_db_to_user_format( $v_date ) {
    if( $v_date ) {
      return date( 'd/m/Y', strtotime( $v_date ) );
    }
    else {
      return null;
    }
  }
  
  function fn_date_user_to_db_format( $v_date ) {
    if( $v_date ) {
      return date( 'Y-m-d', strtotime( str_replace( '/', '-', $v_date ) ) );
    }
    else{
      return null;
    }
  }
  
  function fn_validateEmail( $v_email ) { 
    $lv_regx = "/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/";
    return preg_match( $lv_regx, $v_email );
  }
  

?>
