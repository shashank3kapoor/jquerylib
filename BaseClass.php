<?php

session_start();

Class BaseClass {
  public function __construct() {
    
  }
  
  public function addData() {
    global $mysqli;
    
    $fieldAttrib = $this->getFieldAttrib();
    
    $types = "";
    foreach( $fieldAttrib as $key => $val ) {
      if( $val["val"] ) {
        $fields[] = $key;
        $values[] = $val["val"];
        $types .= $val["type"];
        $qs[] = "?";
      }
    }
    
    $fieldStr = implode( ",", $fields );
    $qsStr = implode( ",", $qs );
    
    $sql = " INSERT INTO ".$this->tablename."( ".$fieldStr." )";
    $sql.= " VALUES( ".$qsStr." ) ";
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
      
      $bind_names[] = $types;
      for ($i=0; $i<count($values);$i++) {
	  $bind_name = 'bind' . $i;
	  $$bind_name = $values[$i];
	  $bind_names[] = &$$bind_name;
      }
      $return = call_user_func_array(array($stmt,'bind_param'),$bind_names);
      
      $result = $stmt->execute();
      if( !$result ) {
        return $mysqli->error;
      }
      $stmt->close();
    }
    
    return true;
  }
  
  public function updateData() {
    global $mysqli;
    
    $fieldAttrib = $this->getFieldAttrib();
    
    $isKeyArry = false;
    if( is_array( $this->keyValue ) ) {
      $isKeyArry = true;
    }
    
    $types = "";
    foreach( $fieldAttrib as $key => $val ) {
      if( $val["val"] ) {
        if( $isKeyArry ) {
          if( in_array( $key, $this->keyValue ) ) {
            $keyFieldsAry[] = $key." = ? ";
            $keyValuesAry[] = $val["val"];
            $keyTypes .= $val["type"];
          }
          else {
            $fields[] = $key." = ? ";
            $values[] = $val["val"];
            $types .= $val["type"];
          }
        }
        else {
          if( $key == $this->keyValue ) {
            $keyFieldsAry[] = $key." = ? ";
            $keyValuesAry[] = $val["val"];
            $keyTypes = $val["type"];
          }
          else {
            $fields[] = $key." = ? ";
            $values[] = $val["val"];
            $types .= $val["type"];
          }
        }
      }
    }
    
    $types .= $keyTypes;
    
    $values = array_merge( $values, $keyValuesAry );
    
    $fieldStr = implode( ",", $fields );
    
    if( $isKeyArry ) {
      $whereCondition = implode( " AND ", $keyFieldsAry );
    }
    else {
      $whereCondition = $keyFieldsAry[0];
    }
    
    $sql = " UPDATE ".$this->tablename." SET ".$fieldStr;
    $sql.= " WHERE ".$whereCondition;
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
      $bind_names[] = $types;
      for ($i=0; $i<count($values);$i++) {
	  $bind_name = 'bind' . $i;
	  $$bind_name = $values[$i];
	  $bind_names[] = &$$bind_name;
      }
      $return = call_user_func_array(array($stmt,'bind_param'),$bind_names);
      $result = $stmt->execute();
      if( !$result ) {
        return $mysqli->error;
      }
      $stmt->close();
    }
    
    return true;
  }
  
  public function getData() {
    global $mysqli;
    
    $fieldAttrib = $this->getFieldAttrib();
    
    $isKeyArry = false;
    if( is_array( $this->keyValue ) ) {
      $isKeyArry = true;
    }
    
    $conditions = "";
    $types = "";
    foreach( $fieldAttrib as $key => $val ) {
      if( $val["val"] ) {
	if( $val["type"] != 's' ) {
	  $conditions .= " AND ".$key." = ".intval( $val["val"] );
	}
	else {
	  $conditions .= " AND ".$key." = '".$mysqli->real_escape_string( $val["val"] )."' ";
	}
	
	$values[] = $val["val"];
	$types .= $val["type"];
      }
      $fields[] = $key;
    }
    
    $fieldStr = implode( ",", $fields );
    
    if( $isKeyArry ) {
      foreach( $this->keyValue as $key => $val ) {
	$keyConditionArry[] = $val." IS NOT NULL ";
      }
      
      $keyCondition = implode( " AND ", $keyConditionArry );
    }
    else {
      $keyCondition = $this->keyValue." IS NOT NULL ";
    }
    
    
    $sql = " SELECT ".$fieldStr." FROM ".$this->tablename." WHERE ";
    $sql.= $keyCondition." AND ( ".$this->deleteField." = 1 OR ".$this->deleteField." = 2 ) ";
    $sql.= $conditions;
    
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
	return $objs;
    }
    else {
      return false;
    }
    
  }
  
  public function deleteData() {
    global $mysqli;
    
    $fieldAttrib = $this->getFieldAttrib();
    
    $isKeyArry = false;
    if( is_array( $this->keyValue ) ) {
      $isKeyArry = true;
    }
    
    $types = "";
        if( $isKeyArry ) {
          foreach( $this->keyValue as $key => $val ) {
            $keyFieldsAry[] = $val." = ? ";
	    $keyValuesAry[] = $fieldAttrib[$val]["val"];
            $keyTypes .= $fieldAttrib[$val]["type"];
          }
        }
        else {
            $keyFieldsAry[] = $this->keyValue." = ? ";
            $keyValuesAry[] = $fieldAttrib[$val]["val"];
            $keyTypes = $fieldAttrib[$val]["type"];
        }
    
    $types .= $keyTypes;
    
    $values[] = 0;
    $values = array_merge( $values, $keyValuesAry );
    
    if( $isKeyArry ) {
      $whereCondition = implode( " AND ", $keyFieldsAry );
    }
    else {
      $whereCondition = $keyFieldsAry[0];
    }
    
    $sql = " UPDATE ".$this->tablename." SET ".$this->deleteField." = ? ";
    $sql.= " WHERE ".$whereCondition;
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
      $bind_names[] = $types;
      for ($i=0; $i<count($values);$i++) {
	  $bind_name = 'bind' . $i;
	  $$bind_name = $values[$i];
	  $bind_names[] = &$$bind_name;
      }
      $return = call_user_func_array(array($stmt,'bind_param'),$bind_names);
      $result = $stmt->execute();
      if( !$result ) {
        return $mysqli->error;
      }
      $stmt->close();
    }
    
    return true;
  }
  
  public function getMaxId( $v_colName, $v_tableName = false ) {
    global $mysqli;
    
    if( $v_tableName ) {
      $lv_tableName = $v_tableName;
    }
    else {
      $lv_tableName = $this->tablename;
    }
    
    $sql = " SELECT COALESCE( MAX(".$v_colName."), 0 ) AS max_id FROM ".$lv_tableName;
    $max_id = 0;
    if( $result = $mysqli->query( $sql ) ) {
	if( $obj = $result->fetch_object() ) {
	    $tmp = array();
	    
	    $max_id = intval( $obj->max_id );
	}
	$result->close();
    }
    
    return $max_id;
  }
  
}

?>
