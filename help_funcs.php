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
  

?>
