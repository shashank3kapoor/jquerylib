<?php

session_start();

Class Module {
  public $module;
  
  public function __construct( $v_name, $v_id, $v_link ) {
    $this->module["name"] = $v_name;
    $this->module["id"] = $v_id;
    $this->module["link"] = $v_link;
    $this->module["element"] = false;
  }
  
  public function addElement( $v_obj ) {
    $this->module["element"][] = $v_obj;
  }
  
  public function removeElementItem( $v_id ) {
    $srchArry = isset( $this->module["element"] ) ? $this->module["element"] : false;
    if( $srchArry ) {
      $found = false;
      foreach( $srchArry AS $key=>$val ) {
        if( $val['id'] === $v_id ) {
          unset( $this->module["element"][$key] );
          $found = true;
          break;
        }
      }
      
      return $found;
    }
    else {
      return false;
    }
  }
  
  public function getModule() {
    return $this->module;
  }
}

Class Element {
  public $element;
  
  public function __construct( $v_name, $v_id, $v_link ) {
    $this->element["name"] = $v_name;
    $this->element["id"] = $v_id;
    $this->element["link"] = $v_link;
    $this->element["menu"] = false;
  }
  
  public function addMenu( $v_obj ) {
    $this->element["menu"][] = $v_obj;
  }
  
  public function removeMenuItem( $v_id ) {
    $srchArry = isset( $this->element["menu"] ) ? $this->element["menu"] : false;
    if( $srchArry ) {
      $found = false;
      foreach( $srchArry AS $key=>$val ) {
        if( $val['id'] === $v_id ) {
          unset( $this->element["menu"][$key] );
          $found = true;
          break;
        }
      }
      
      return $found;
    }
    else {
      return false;
    }
  }
  
  public function getElement() {
    return $this->element;
  }
}

Class Menu {
  public $menu;
  
  public function __construct( $v_name, $v_id, $v_link ) {
    $this->menu["name"] = $v_name;
    $this->menu["id"] = $v_id;
    $this->menu["link"] = $v_link;
    $this->menu["submenu"] = false;
  }
  
  public function addSubMenu( $v_obj ) {
    $this->menu["submenu"][] = $v_obj;
  }
  
  public function removeSubMenuItem( $v_id ) {
    $srchArry = isset( $this->menu["submenu"] ) ? $this->menu["submenu"] : false;
    if( $srchArry ) {
      $found = false;
      foreach( $srchArry AS $key=>$val ) {
        if( $val['id'] === $v_id ) {
          unset( $this->menu["submenu"][$key] );
          $found = true;
          break;
        }
      }
      
      return $found;
    }
    else {
      return false;
    }
  }
  
  public function getMenu() {
    return $this->menu;
  }
}

?>
