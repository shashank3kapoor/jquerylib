<?php

$root = realpath( $_SERVER["DOCUMENT_ROOT"] );

include_once $root."/comcls/BaseClass.php";

Class CustomerRelation extends BaseClass {
  public $cr_group_id;
  public $cr_person_id;
  public $cr_cust_id;
  public $cr_date;
  public $cr_status;
  
  public function __construct() {
    $this->cr_date = date( "Y-m-d" );
    $this->cr_status = 1; //Status 0 => 'Deleted', 1 => 'Linked', 2 => 'Unlinked', 3 => 'Archived'
    $this->tablename = "CUSTOMER_RELATION";
    $this->keyValue[] = "cr_group_id";
    $this->keyValue[] = "cr_person_id";
    $this->deleteField = "cr_status";
  }
  
  public function getFieldAttrib() {
    $fieldAttrib = array();
    $fieldAttrib["cr_group_id"] = array( "val"=>$this->cr_group_id, "type"=>"i" );
    $fieldAttrib["cr_person_id"] = array( "val"=>$this->cr_person_id, "type"=>"i" );
    $fieldAttrib["cr_cust_id"] = array( "val"=>$this->cr_cust_id, "type"=>"i" );
    $fieldAttrib["cr_date"] = array( "val"=>$this->cr_date, "type"=>"s" );
    $fieldAttrib["cr_status"] = array( "val"=>$this->cr_status, "type"=>"i" );
    
    return $fieldAttrib;
  }
  
  public function resetStatus() {
    global $mysqli;
    
    $sql = " UPDATE ".$this->tablename." SET cr_status = ?, cr_cust_id = ? ";
    $sql.= " WHERE cr_group_id = ? ";
    
    if( $stmt = $mysqli->prepare( $sql ) ) {
      $stmt->bind_param( "iii", $this->cr_status, $this->cr_cust_id, $this->cr_group_id );
      $result = $stmt->execute();
      if( !$result ) {
        return $mysqli->error;
      }
      $stmt->close();
    }
    
    return true;
  }
}

?>
