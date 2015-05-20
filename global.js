
  fn_sleep = function( v_millis ) 
  {
    var lv_date = new Date();
    var lv_curDate = null;
    
    do { lv_curDate = new Date(); } 
    while( lv_curDate - lv_date < v_millis );
  }
  
  if (window.addEventListener) {
    window.addEventListener('load', function() {
      document.body.className = "clsprgrsed";
    }, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', function() {
      document.body.cfn_getElemValuelassName = "clsprgrsed";
    });
  }
  
  if (document.addEventListener) {
    document.addEventListener('ready', function() {
      document.body.className = "clsprgrsst";
    }, false);
  } else if (document.attachEvent) {
    document.attachEvent('onready', function() {
      document.body.className = "clsprgrsst";
    });
  }

$(document).ready( function() {

/*****Code for DataStore****/
  //Consturctor Method
  dataStore = function( v_params ) {
    this.root = v_params.root;
    this.url = v_params.url;
    this.fields = v_params.fields;
    this.baseParams = ( v_params.baseParams ) ? v_params.baseParams : false;
    this.exParams = ( v_params.exParams ) ? v_params.exParams : false;
    this.totalProperty = ( v_params.totalProperty ) ? v_params.totalProperty : false;
    this.pageOffset = 0;
    this.pageSize = 0;
    
    return this;
  }
  
  dataStore.prototype.load = function() {
    var _this = this;
    
    var lv_urlObj = fn_getURLnFun( _this.url );
    
    _this.callurl = lv_urlObj.url;
    _this.method = lv_urlObj.method;
    
    _this.data = false;
    
    if( _this.exParams ) {
      _this.exParams = fn_objectMerge( _this.exParams, { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize }, true );
    }
    else {
      _this.exParams = { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize };
    }
    
    $.post(
      _this.callurl,
      {
	method: _this.method,
	params: _this.baseParams,
	exParams: _this.exParams
      },
      function ( v_data, v_status ) {
	var lv_data = $.parseJSON( v_data );
	
	if( lv_data.success ) {
	  _this.data = lv_data[_this.root];
	  
	  if( _this.totalProperty ) {
	    _this.totalValue = parseInt( lv_data[_this.totalProperty] );
	  }
	  else {
	    _this.totalValue = false;
	  }
	}
	else {
	  if( lv_data.error != undefined ) {
	    fn_alert( "Error!", lv_data.error );
	  }
	}
      }
    );
    
  }

/*****Code for GridPanel****/  
  //Constructor Method
  gridPanel = function( v_params ) {
    this.id = v_params.id;
    this.width = (v_params.width) ? v_params.width : "auto";
    this.height = (v_params.height) ? v_params.height : "auto";
    this.container_id = v_params.container_id;
    this.headers = v_params.headers;
    this.store = (v_params.store) ? v_params.store : false;
    this.data = (v_params.data) ? v_params.data : false;
    this.reloading = false;
    this.paging = (v_params.paging) ? v_params.paging : false;
    this.pageSize = (v_params.pageSize) ? v_params.pageSize : 0;
    this.currentPageNo = 1;
    this.pageOffset = 0;
    this.listeners = (v_params.listeners) ? v_params.listeners : false;
    this.selectedRowIndex = null;
    this.selectedRow = null;
    this.afterRender = (v_params.afterRender) ? v_params.afterRender : false;
    this.showTotalCount = (v_params.showTotalCount) ? v_params.showTotalCount : false;
    
    return this;
  }
  
  //Rendering Grid
  gridPanel.prototype.render = function() {
    var _this = this;
    
    //Calculate Offset based on the current page number
    _this.pageOffset = (parseInt(_this.currentPageNo) * parseInt(_this.pageSize)) - parseInt(_this.pageSize);
    _this.store.pageOffset = _this.pageOffset;
    _this.store.pageSize = _this.pageSize;
    
    _this.loadingMask = new loadingMask({
      id: 'loadingMask' + _this.id,
      masked: true,
      maskElementId: _this.container_id
    });
    _this.loadingMask.render();
    _this.loadingMask.show();
    
    //Load data when store specified
    if( _this.store ) {
      if( ( _this.store.data ) && ( !_this.reloading ) ) {
	_this.data = _this.store.data;
	
	fn_render_grid( _this );
      }
      else {
	var lv_urlObj = fn_getURLnFun( _this.store.url );
	
	_this.store.callurl = lv_urlObj.url;
	_this.store.method = lv_urlObj.method;
	
	if( _this.store.exParams ) {
	  _this.store.exParams = fn_objectMerge( _this.store.exParams, { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize }, true );
	}
	else {
	  _this.store.exParams = { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize };
	}
	
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    
	    if( lv_data.success ) {
	      _this.data = lv_data[_this.store.root];
	      
	      _this.store.data = _this.data;
	      
	      if( _this.store.totalProperty ) {
		_this.store.totalValue = parseInt( lv_data[_this.store.totalProperty] );
	      }
	      else {
		_this.store.totalValue = false;
	      }
	      
	      fn_render_grid( _this );
	    }
	    else {
	      if( lv_data.error != undefined ) {
		fn_alert( "Error!", lv_data.error );
	      }
	      
	      _this.loadingMask.hide();
	    }
	  }
	);
      }
      
    }
    else {
      fn_render_grid( _this );
    }
  }
  
  //Rendering grid
  fn_render_grid = function( v_this ) {
    var _this = v_this;
    
    if( ( _this.pageSize ) && ( _this.store.totalValue ) ) {
      if( parseInt( _this.store.totalValue ) > parseInt( _this.pageSize ) ) {
	_this.pageCount = Math.ceil( parseInt( _this.store.totalValue ) / parseInt( _this.pageSize ) );
      }
      else {
	_this.pageCount = 1;
      }
    }
    else {
      _this.pageCount = 0;
    }
    
    var lv_div = document.getElementById( _this.container_id );      //Container DIV element
    lv_div.innerHTML = "";
    if( $.isNumeric( _this.width ) ) {
      lv_div.style.width = _this.width + "px";
    }
    else {
      lv_div.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_div.style.height = _this.height + "px";
    }
    else {
      lv_div.style.height = _this.height;
    }
    lv_div.className = "clsgrdcontainer";
    
    //Header
    var lv_header_div = document.createElement("div"); //Grid Header DIV
    lv_header_div.className = "clsgrdheader";
    
    var lv_header_table = document.createElement("table");  //Header Table
    lv_header_table.width = "100%";
    lv_header_table.setAttribute( "id", _this.container_id + "_header");
    var lv_tr = document.createElement("tr");      //Header Row
    
    var lv_header = _this.headers;
    
    var lv_default_sort_col = false;
    var lv_default_sort_order = 'asc';
    if( _this.store.exParams.sortCol ) {
      lv_default_sort_col = _this.store.exParams.sortCol;
      lv_default_sort_order = ( _this.store.exParams.sortOrder ) ? _this.store.exParams.sortOrder : 'asc';
    }
    
    $.each( lv_header, function( v_idx, v_val ) {
      var lv_th = document.createElement("th");   //Creating Header Values
      var lv_span_img = document.createElement("span");
      var lv_span_txt = document.createElement("span");
      var lv_a_link = document.createElement("a");
      var lv_hdr_col_tbl = document.createElement("table");
      var lv_hdr_col_tr = document.createElement("tr");
      var lv_hdr_col_td_img = document.createElement("td");
      var lv_hdr_col_td_txt = document.createElement("td");
      
      lv_span_img.style.width = "14px";
      lv_span_img.style.height = "9px";
      lv_span_img.className = "clsgrdheaderimg";
      lv_span_txt.className = "clsgrdheadertxt";
      lv_span_txt.innerHTML = v_val.headerText;
      
      lv_hdr_col_td_img.appendChild( lv_span_img );
      lv_hdr_col_td_txt.appendChild( lv_span_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_img );
      lv_hdr_col_tbl.appendChild( lv_hdr_col_tr );
      
      lv_a_link.appendChild( lv_hdr_col_tbl );
      
      lv_th.style.width = v_val.width + "px";
      lv_th.style.cursor = "url('/images/curnw.cur'), pointer";
      lv_th.id = v_val.dataIndex;
      
      if( ( lv_default_sort_col ) && ( lv_default_sort_col == v_val.dataIndex ) ) {
	if( lv_default_sort_order == 'asc' ) {
	  $(lv_th).addClass("clsgrdheaderasc");
	}
	else {
	  $(lv_th).addClass("clsgrdheaderdesc");
	}
      }
      
      lv_th.appendChild( lv_a_link );
      
      lv_tr.appendChild( lv_th );   //Add Table header element to row
    });
    
    //For Sorting by a column
    $( lv_tr ).delegate("th", "click", function(e) {
      var lv_th_className = this.className;
      var lv_sortOrder = "asc";
      
      if( ( lv_th_className ) && ( lv_th_className == "clsgrdheaderasc" ) ) {
	$(this).addClass("clsgrdheaderdesc").removeClass("clsgrdheaderasc").siblings().removeClass();
	lv_sortOrder = "desc";
      }
      else {
	$(this).addClass("clsgrdheaderasc").removeClass("clsgrdheaderdesc").siblings().removeClass();
	lv_sortOrder = "asc";
      }
      
      _this.store.exParams = {
	    sortCol: this.id,
	    sortOrder: lv_sortOrder
      };
      _this.sortGrid();
      
    });
    
    lv_header_table.appendChild( lv_tr ); //Add row to header Table
    lv_header_div.appendChild( lv_header_table ); //Add Table to the Header DIV
    
    //Populate Data into the Grid
    var lv_data_div = document.createElement("div"); //Grid Data DIV
    lv_data_div.className = "clsgrddata";
    lv_data_div.id = _this.container_id + "_datadiv";
    
    var lv_dataLessHeight = 30;
    //For Paging
    if( _this.paging ) {
      lv_dataLessHeight = 57;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_data_div.style.height = (_this.height - lv_dataLessHeight) + "px";
    }
    else {
      lv_data_div.style.height = _this.height;
    }
    
    var lv_data_table = document.createElement("table");  //Data Table
    lv_data_table.width = "100%";
    lv_data_table.border = 1;
    lv_data_table.setAttribute( "id", _this.container_id + "_data");
    
    var lv_data = _this.data;
    
    $.each( lv_data, function( v_data_idx, v_data_val ) {
      var lv_data_tr = document.createElement("tr");      //Data Row
      
      //Check position of Data values
        $.each( lv_header, function( v_idx, v_val ) {
          var lv_td = document.createElement("td");   //Creating data Values
          
          lv_td.style.width = v_val.width + "px";
          lv_td.innerHTML = v_data_val[v_val.dataIndex];
	  
	  //Renderer
	  if( typeof v_val.renderer === 'function' ) {
	    lv_td = v_val.renderer( lv_td, v_data_val, v_data_val[v_val.dataIndex] );
	  }
          
          lv_data_tr.appendChild( lv_td );   //Add Table data element to row
        });
        
        lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
    });
    
    _this.selectedRowIndex = null;
    $( lv_data_table ).delegate("tr", "click", function(e) {
	$(this).addClass("clsselected").siblings().removeClass("clsselected");
	_this.selectedRowIndex = $(this).index();
	_this.selectedRow = (_this.selectedRowIndex != null) ? lv_data[_this.selectedRowIndex] : null;
    });
    
    lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
    
    lv_div.appendChild( lv_header_div ); //Add Header Table to the Container Element
    lv_div.appendChild( lv_data_div ); //Add Data Table to the Container Element
    if( _this.paging ) {
      var lv_pagcont_div = fn_createGridPagingElement( _this );
      lv_div.appendChild( lv_pagcont_div ); //Add paging Container if enabled
    }
    
    _this.containerElement = lv_div;
    _this.headerContainer = lv_header_div;
    _this.headerTable = lv_header_table;
    _this.dataContainer = lv_data_div;
    _this.dataTable = lv_data_table;
    
    //Listeners
    var lv_listeners = _this.listeners;
    $.each( lv_listeners, function( v_idx, v_val ) {
      if( v_idx ) {
	fn_assign_grid_event( _this, v_idx, v_val );
      }
    });
    
    if( typeof _this.afterRender === 'function' ) {
      _this.afterRender( _this );
    }
    
    _this.loadingMask.hide();
  }
  
  //Update Navigation CSS
  fn_updateGrdPageNav = function( v_counter, v_this ) {
    var _this = v_this;
    
    var lv_page_td_first = document.getElementById( _this.container_id + "_navfirst" );
    var lv_page_td_previous = document.getElementById( _this.container_id + "_navpre" );
    var lv_page_td_next = document.getElementById( _this.container_id + "_navnext" );
    var lv_page_td_last = document.getElementById( _this.container_id + "_navlast" );
    
    if( parseInt( _this.pageCount ) > 1 ) {
      if( parseInt( v_counter ) == 1 ) {
	lv_page_td_first.className = "clspgfst clspgfstdsbl clsbtndsbl";
	lv_page_td_previous.className = "clspgpre clspgpredsbl clsbtndsbl";
	lv_page_td_next.className = "clspgnxt";
	lv_page_td_last.className = "clspglst";
      }
      else if( v_counter >= parseInt( _this.pageCount ) ) {
	lv_page_td_first.className = "clspgfst";
	lv_page_td_previous.className = "clspgpre";
	lv_page_td_next.className = "clspgnxt clspgnxtdsbl clsbtndsbl";
	lv_page_td_last.className = "clspglst clspglstdsbl clsbtndsbl";
      }
      else {
	lv_page_td_first.className = "clspgfst";
	lv_page_td_previous.className = "clspgpre";
	lv_page_td_next.className = "clspgnxt";
	lv_page_td_last.className = "clspglst";
      }
    }
    else {
      lv_page_td_first.className = "clspgfst clspgfstdsbl clsbtndsbl";
      lv_page_td_previous.className = "clspgpre clspgpredsbl clsbtndsbl";
      lv_page_td_next.className = "clspgnxt clspgnxtdsbl clsbtndsbl";
      lv_page_td_last.className = "clspglst clspglstdsbl clsbtndsbl";
    }
  }
  
  //Get Grid Page as per page number
  fn_getGrdEnterPage = function( v_obj, v_event, v_this ) {
    var _this = v_this;
    _this.reloading = true;
    if( v_event.keyCode == 13 ) {
      var lv_value = v_obj.value;
      if( ( $.isNumeric( lv_value ) ) && ( parseInt( lv_value ) <= _this.pageCount ) ) {
	_this.currentPageNo = parseInt( lv_value );
	_this.sortGrid();
	fn_updateGrdPageNav( _this.currentPageNo, _this );
      }
    }
  }
  
  //Get page as per navigation click
  fn_getGrdPage = function( v_inp_obj, v_btn, v_this ) {
    var _this = v_this;
    _this.reloading = true;
    var lv_counter = parseInt( _this.currentPageNo );
    
    switch( v_btn ) {
      case "first":
	if( parseInt( _this.pageCount ) >= 1 ) {
	  lv_counter = 1;
	}
	else {
	  lv_counter = 0;
	}
	_this.currentPageNo = lv_counter;
	_this.sortGrid();
	break;
      case "pre":
	lv_counter--;
	if( lv_counter > 0) {
	  _this.currentPageNo = lv_counter;
	  _this.sortGrid();
	}
	break;
      case "next":
	lv_counter++;
	if( lv_counter <= parseInt( _this.pageCount ) ) {
	  _this.currentPageNo = lv_counter;
	  _this.sortGrid();
	}
	break;
      case "last":
	lv_counter = parseInt( _this.pageCount );
	_this.currentPageNo = lv_counter;
	_this.sortGrid();
	break;
    }
    v_inp_obj.value = _this.currentPageNo;
    fn_updateGrdPageNav( _this.currentPageNo, _this );
  }
  
  //For Paging
  fn_createGridPagingElement = function( v_this ) {
    var _this = v_this;
    var lv_pagcont_div = document.createElement("div"); //Grid paging container
      
      if( !_this.store.totalValue ){
	_this.currentPageNo = 0;
      }
      else if( !_this.currentPageNo ) {
	_this.currentPageNo = 1;
      }
      
      lv_pagcont_div.className = "clsgrdpagcont";
      lv_pagcont_div.id = _this.container_id + "_pagecontdiv";
      
      var lv_page_table = document.createElement("table"); //Paging table
	  lv_page_table.style.width = "100%";
	  lv_page_table.className = "clspagingtbl";
      var lv_page_tr = document.createElement("tr"); //Page tr
      
      var lv_page_td_first = document.createElement("td"); //first
      var lv_page_td_previous = document.createElement("td"); //previous
      var lv_page_td_next = document.createElement("td"); //next
      var lv_page_td_last = document.createElement("td"); //last
      
      lv_page_td_first.id = _this.container_id + "_navfirst";
      lv_page_td_previous.id = _this.container_id + "_navpre";
      lv_page_td_next.id = _this.container_id + "_navnext";
      lv_page_td_last.id = _this.container_id + "_navlast";
      
      lv_page_td_first.className = "clspgfst clspgfstdsbl clsbtndsbl";
      lv_page_td_previous.className = "clspgpre clspgpredsbl clsbtndsbl";
      if( parseInt(_this.pageCount) > 1 ) {
	lv_page_td_next.className = "clspgnxt";
	lv_page_td_last.className = "clspglst";
      }
      else {
	lv_page_td_next.className = "clspgnxt clspgnxtdsbl clsbtndsbl";
	lv_page_td_last.className = "clspglst clspglstdsbl clsbtndsbl";
      }
      
      var lv_curr_pg_main_td = document.createElement("td");
      var lv_curr_pg_table_cont = document.createElement("table");
      var lv_curr_pg_tr_cont = document.createElement("tr");
      var lv_page_td_curr_pg = document.createElement("td"); //current page number
	  lv_page_td_curr_pg.className = "clscurrpage";
      var lv_cur_pg_label = document.createElement("label");
	  lv_cur_pg_label.innerHTML = "Page ";
      
      var lv_page_td_total_pgs = document.createElement("td"); //total pages
	  lv_page_td_total_pgs.className = "clspagoftxt";
      
      if( _this.showTotalCount ) {
	var lv_total_record_td = document.createElement("td");
	    lv_total_record_td.className = "clstotrecs";
	var lv_total_recs_label = document.createElement("label");
	    lv_total_recs_label.innerHTML = "Total Records: " + _this.store.totalValue;
	    lv_total_record_td.appendChild( lv_total_recs_label );
      }
      
      
      var lv_page_first_div = document.createElement("div"); //first div
      var lv_page_previous_div = document.createElement("div"); //previous div
      var lv_page_next_div = document.createElement("div"); //next div
      var lv_page_last_div = document.createElement("div"); //last div
      
      var lv_pageFirstBtnObj = fn_createBtnObj( lv_page_first_div );
      var lv_pagePreviousBtnObj = fn_createBtnObj( lv_page_previous_div );
      var lv_pageNextBtnObj = fn_createBtnObj( lv_page_next_div );
      var lv_pageLastBtnObj = fn_createBtnObj( lv_page_last_div );
      
      var lv_page_input_page_no = document.createElement("input"); //input page number
      lv_page_input_page_no.id = _this.container_id + "_pgnoinp";
      lv_page_input_page_no.name = _this.container_id + "_pgnoinp";
      lv_page_input_page_no.type = "text";
      
      lv_page_input_page_no.onkeyup = function( e ) { fn_getGrdEnterPage( this, e, _this ); };
      
      lv_page_td_first.onclick = function() { fn_getGrdPage( lv_page_input_page_no, "first", _this ); };
      lv_page_td_previous.onclick = function() { fn_getGrdPage( lv_page_input_page_no, "pre", _this ); };
      lv_page_td_next.onclick = function() { fn_getGrdPage( lv_page_input_page_no, "next", _this ); };
      lv_page_td_last.onclick = function() { fn_getGrdPage( lv_page_input_page_no, "last", _this ); };
      
      lv_page_input_page_no.value = _this.currentPageNo;
      
      _this.pageOffset = (parseInt(_this.currentPageNo) * parseInt(_this.pageSize)) - parseInt(_this.pageSize);
      
      lv_page_td_total_pgs.innerHTML = " of " + _this.pageCount;
      
      //Append Elements
      lv_page_td_first.appendChild( lv_pageFirstBtnObj );
      lv_page_td_previous.appendChild( lv_pagePreviousBtnObj );
      lv_page_td_next.appendChild( lv_pageNextBtnObj );
      lv_page_td_last.appendChild( lv_pageLastBtnObj );
      lv_page_td_curr_pg.appendChild( lv_cur_pg_label );
      lv_page_td_curr_pg.appendChild( lv_page_input_page_no );
      
      //Page Numbers
      lv_curr_pg_tr_cont.appendChild( lv_page_td_curr_pg );
      lv_curr_pg_tr_cont.appendChild( lv_page_td_total_pgs );
      lv_curr_pg_table_cont.appendChild( lv_curr_pg_tr_cont );
      lv_curr_pg_main_td.appendChild( lv_curr_pg_table_cont );
      
      lv_page_tr.appendChild( lv_page_td_first );
      lv_page_tr.appendChild( lv_page_td_previous );
      lv_page_tr.appendChild( lv_page_td_next );
      lv_page_tr.appendChild( lv_page_td_last );
      lv_page_tr.appendChild( lv_curr_pg_main_td );
      
      if( _this.showTotalCount ) {
	lv_page_tr.appendChild( lv_total_record_td );
      }
      
      lv_page_table.appendChild( lv_page_tr );
      
      lv_pagcont_div.appendChild( lv_page_table );
      
      return lv_pagcont_div;
  }
  
  //Refresh Grid
  gridPanel.prototype.refreshGrid = function( v_data ) {
    var _this = this;
    _this.reloading = true;
    _this.currentPageNo = 1;
    
    if ( v_data != undefined ) {
      _this.data = v_data;
      _this.reloading = false;
    }
    
    _this.selectedRowIndex = null;
    _this.selectedRow = null;
    _this.selectedRows = {};
    
    _this.render();
  }
  
  gridPanel.prototype.selectRow = function( v_idx ) {
    var _this = this;
    
    var lv_data_div = document.getElementById( _this.container_id + "_datadiv" ); //Grid Data DIV
    var lv_data_table = lv_data_div.children[0];
    var lv_index = null;
      lv_index = parseInt( v_idx );
    
    if( $.isNumeric( lv_index ) ) {
      
      var lv_row = lv_data_table.rows[lv_index];
      
      if( lv_row != undefined ) {
	$( lv_row ).trigger("click");
	
	return true;
      }
      else {
	return false;
      }
    }
    else {
      return false;
    }
    
  }
  
  gridPanel.prototype.clearData = function() {
    var _this = this;
    
    //Clear data
      var lv_cont_div = document.getElementById( _this.container_id ); //Grid Container DIV
      if( lv_cont_div ) { lv_cont_div.innerHTML = ""; }
      
      _this.store.baseParams = false;
      _this.data = false;
      _this.dataContainer = undefined;
      _this.dataTable = undefined;
  }
  
  //Sort Grid
  gridPanel.prototype.sortGrid = function() {
    var _this = this;
    
    _this.loadingMask = new loadingMask({
      id: 'loadingMask' + _this.id,
      masked: true,
      maskElementId: _this.container_id
    });
    _this.loadingMask.render();
    _this.loadingMask.show();
    
    if( ( parseInt( _this.currentPageNo ) ) && ( parseInt( _this.store.totalValue ) ) ) {
      //Calculate Offset based on the current page number
      _this.pageOffset = (parseInt(_this.currentPageNo) * parseInt(_this.pageSize)) - parseInt(_this.pageSize);
      _this.store.pageOffset = _this.pageOffset;
      _this.store.pageSize = _this.pageSize;
      
      if( _this.paging ) {
	if( _this.store.exParams ) {
	  _this.store.exParams = fn_objectMerge( _this.store.exParams, { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize }, true );
	}
	else {
	  _this.store.exParams = { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize };
	}
      }
	
      //Load data as per sorted column
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    
	    if( lv_data.success ) {
	      _this.data = lv_data[_this.store.root];
	      
	      //Populate Data into the Grid
	      var lv_data_div = document.getElementById( _this.container_id + "_datadiv" ); //Grid Data DIV
	      lv_data_div.innerHTML = "";
	      lv_data_div.className = "clsgrddata";
	      
	      var lv_dataLessHeight = 30;
	      //For Paging
	      if( _this.paging ) {
		lv_dataLessHeight = 57;
	      }
	      
	      if( $.isNumeric( _this.height ) ) {
		lv_data_div.style.height = (_this.height - lv_dataLessHeight) + "px";
	      }
	      else {
		lv_data_div.style.height = _this.height;
	      }
	      
	      var lv_data_table = document.createElement("table");  //Data Table
	      lv_data_table.width = "100%";
	      lv_data_table.border = 1;
	      lv_data_table.setAttribute( "id", _this.container_id + "_data");
	      
	      var lv_data = _this.data;
	      var lv_header = _this.headers;
	      
	      $.each( lv_data, function( v_data_idx, v_data_val ) {
		var lv_data_tr = document.createElement("tr");      //Data Row
		
		//Check position of Data values
		  $.each( lv_header, function( v_idx, v_val ) {
		    var lv_td = document.createElement("td");   //Creating data Values
		    
		    lv_td.style.width = v_val.width + "px";
		    lv_td.innerHTML = v_data_val[v_val.dataIndex];
		    
		    //Renderer
		    if( typeof v_val.renderer === 'function' ) {
		      lv_td = v_val.renderer( lv_td, v_data_val, v_data_val[v_val.dataIndex] );
		    }
		    
		    lv_data_tr.appendChild( lv_td );   //Add Table data element to row
		  });
		  
		  lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
	      });
	      
	      _this.selectedRowIndex = null;
	      $( lv_data_table ).delegate("tr", "click", function(e) {
		  $(this).addClass("clsselected").siblings().removeClass("clsselected");
		  _this.selectedRowIndex = $(this).index();
		  _this.selectedRow = (_this.selectedRowIndex != null) ? lv_data[_this.selectedRowIndex] : null;
	      });
	      
	      lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
	      
	      _this.dataContainer = lv_data_div;
	      _this.dataTable = lv_data_table;
	      
	      //Listeners
	      var lv_listeners = _this.listeners;
	      $.each( lv_listeners, function( v_idx, v_val ) {
		if( v_idx ) {
		  fn_assign_grid_event( _this, v_idx, v_val );
		}
	      });
	      
	      //After Render
	      if( typeof _this.afterRender === 'function' ) {
		_this.afterRender( _this );
	      }
	    }
	    else {
	      if( lv_data.error != undefined ) {
		fn_alert( "Error!", lv_data.error );
	      }
	    }
	      
	      _this.loadingMask.hide();
	  }
	);
    }
    else {
      _this.loadingMask.hide();
    }
  }
  
  gridPanel.prototype.getSelectedRowIndex = function() {
    return this.selectedRowIndex;
  }
  
  gridPanel.prototype.getSelectedRow = function() {
    return this.selectedRow;
  }
  
  fn_assign_grid_event = function( v_this, v_event, v_fun ) {
    var _this = v_this;
    
    $( _this.dataTable ).find("tr").bind( v_event, function() {
      var lv_data = _this.data;
      _this.selectedRowIndex = $(this).index();
      _this.selectedRow = (_this.selectedRowIndex != null) ? lv_data[_this.selectedRowIndex] : null;
      if( typeof v_fun === "function" ) {
	v_fun( _this, _this.selectedRow, _this.selectedRowIndex );
      }
    });
  }
  
  gridPanel.prototype.on = function( v_event, v_fun ) {
    var _this = this;
    
    _this.v_event = v_event;
    _this.v_fun = v_fun;
    
    if( _this.dataTable == undefined ) {
      _this.render();
    }
    else {
      fn_assign_grid_event( _this, v_event, v_fun );
    }
  }
  
  /*****End of code for GridPanel****/
  
  /*****Code for GridPanelChecked****/
  /***********inherited from gridPanel*****/
  fn_inherit_cls = function( cls_obj ) {
    function cLs() {}; // Dummy constructor
    cLs.prototype = cls_obj; 
    return new cLs(); 
  }

  gridPanelChecked = function( v_params ) {
    gridPanel.call( this, v_params ); //Call the parent class method
    this.checkBoxRenderer = ( v_params.checkBoxRenderer ) ? v_params.checkBoxRenderer : false;
    this.selectedRows = {};
  }
  
  gridPanelChecked.prototype = fn_inherit_cls( gridPanel.prototype ); // Create a gridPanelChecked.prototype object that inherits from gridPanel.prototype
  
  gridPanelChecked.prototype.constructor = gridPanelChecked;
  
  fn_render_gridChecked = function( v_this ) {
    var _this = v_this;
    
    if( ( _this.pageSize ) && ( _this.store.totalValue ) ) {
      if( parseInt( _this.store.totalValue ) > parseInt( _this.pageSize ) ) {
	_this.pageCount = Math.ceil( parseInt( _this.store.totalValue ) / parseInt( _this.pageSize ) );
      }
      else {
	_this.pageCount = 1;
      }
    }
    else {
      _this.pageCount = 0;
    }
    
    var lv_div = document.getElementById( _this.container_id );      //Container DIV element
    lv_div.innerHTML = "";
    if( $.isNumeric( _this.width ) ) {
      lv_div.style.width = _this.width + "px";
    }
    else {
      lv_div.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_div.style.height = _this.height + "px";
    }
    else {
      lv_div.style.height = _this.height;
    }
    lv_div.className = "clsgrdcontainer";
    
    //Header
    var lv_header_div = document.createElement("div"); //Grid Header DIV
    lv_header_div.className = "clsgrdheader";
    
    var lv_header_table = document.createElement("table");  //Header Table
    lv_header_table.width = "100%";
    lv_header_table.setAttribute( "id", _this.container_id + "_header");
    var lv_tr = document.createElement("tr");      //Header Row
    
    var lv_header = _this.headers;
    
    var lv_default_sort_col = false;
    var lv_default_sort_order = 'asc';
    if( _this.store.exParams.sortCol ) {
      lv_default_sort_col = _this.store.exParams.sortCol;
      lv_default_sort_order = ( _this.store.exParams.sortOrder ) ? _this.store.exParams.sortOrder : 'asc';
    }
    
    var lv_th = document.createElement("th");   //Creating Header Value for the checkbox
    lv_th.style.width = "13px";
    var lv_checkbox_hdr = document.createElement("input");
    lv_checkbox_hdr.type = "checkbox";
    lv_checkbox_hdr.title = "Select All";
    lv_checkbox_hdr.id = _this.container_id + "chkhdrall";
    lv_checkbox_hdr.style.float = "left";
    lv_checkbox_hdr.onclick = function() {
      var _chkBox_selectAll = this;
      var _selectAll_checked = this.checked;
      var lv_data_table_childs = _this.dataTable.children;
      $.each( lv_data_table_childs, function( v_idx, v_val ) {
	var _this_chkBox = v_val.children[0].children[0];
	
	if( _selectAll_checked ) {
	  if( !_this_chkBox.checked ) {
	    $( _this_chkBox ).trigger("click");
	  }
	}
	else {
	  if( _this_chkBox.checked ) {
	    $( _this_chkBox ).trigger("click");
	  }
	}
	
      });
    };                                   //Select all records
    lv_th.appendChild( lv_checkbox_hdr );
    lv_tr.appendChild( lv_th );   //Add Table header checkbox element to row for 'Select All'
    
    $.each( lv_header, function( v_idx, v_val ) {
      var lv_th = document.createElement("th");   //Creating Header Values for columns
      var lv_span_img = document.createElement("span");
      var lv_span_txt = document.createElement("span");
      var lv_a_link = document.createElement("a");
      var lv_hdr_col_tbl = document.createElement("table");
      var lv_hdr_col_tr = document.createElement("tr");
      var lv_hdr_col_td_img = document.createElement("td");
      var lv_hdr_col_td_txt = document.createElement("td");
      
      lv_span_img.style.width = "14px";
      lv_span_img.style.height = "9px";
      lv_span_img.className = "clsgrdheaderimg";
      lv_span_txt.className = "clsgrdheadertxt";
      lv_span_txt.innerHTML = v_val.headerText;
      
      lv_hdr_col_td_img.appendChild( lv_span_img );
      lv_hdr_col_td_txt.appendChild( lv_span_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_img );
      lv_hdr_col_tbl.appendChild( lv_hdr_col_tr );
      
      lv_a_link.appendChild( lv_hdr_col_tbl );
      
      lv_th.style.width = v_val.width + "px";
      lv_th.style.cursor = "url('/images/curnw.cur'), pointer";
      lv_th.id = v_val.dataIndex;
      
      if( ( lv_default_sort_col ) && ( lv_default_sort_col == v_val.dataIndex ) ) {
	if( lv_default_sort_order == 'asc' ) {
	  $(lv_th).addClass("clsgrdheaderasc");
	}
	else {
	  $(lv_th).addClass("clsgrdheaderdesc");
	}
      }
      
      lv_th.appendChild( lv_a_link );
      
      lv_tr.appendChild( lv_th );   //Add Table header element to row
    });
    
    //For Sorting by a column
    $( lv_tr ).delegate("th", "click", function(e) {
      var lv_childNode = this.children[0];
      
      if( lv_childNode.type != 'checkbox' ) {
	var lv_th_className = this.className;
	var lv_sortOrder = "asc";
	
	if( ( lv_th_className ) && ( lv_th_className == "clsgrdheaderasc" ) ) {
	  $(this).addClass("clsgrdheaderdesc").removeClass("clsgrdheaderasc").siblings().removeClass();
	  lv_sortOrder = "desc";
	}
	else {
	  $(this).addClass("clsgrdheaderasc").removeClass("clsgrdheaderdesc").siblings().removeClass();
	  lv_sortOrder = "asc";
	}
	
	_this.store.exParams = {
	      sortCol: this.id,
	      sortOrder: lv_sortOrder
	};
	_this.sortGrid();
      }
      
    });
    
    lv_header_table.appendChild( lv_tr ); //Add row to header Table
    lv_header_div.appendChild( lv_header_table ); //Add Table to the Header DIV
    
    //Populate Data into the Grid
    var lv_data_div = document.createElement("div"); //Grid Data DIV
    lv_data_div.className = "clsgrddata";
    lv_data_div.id = _this.container_id + "_datadiv";
    
    var lv_dataLessHeight = 30;
    //For Paging
    if( _this.paging ) {
      lv_dataLessHeight = 57;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_data_div.style.height = (_this.height - lv_dataLessHeight) + "px";
    }
    else {
      lv_data_div.style.height = _this.height;
    }
    
    var lv_data_table = document.createElement("table");  //Data Table
    lv_data_table.width = "100%";
    lv_data_table.border = 1;
    lv_data_table.setAttribute( "id", _this.container_id + "_data");
    
    var lv_data = _this.data;
    
    _this.selectedRows = {};  //Initialize selectedRows
    
    $.each( lv_data, function( v_data_idx, v_data_val ) {
      var lv_data_tr = document.createElement("tr");      //Data Row
	  lv_data_tr.id = _this.container_id + "dataTR" + v_data_idx;
      var lv_td = document.createElement("td");
      lv_td.className = "clsdatachkbox";
      var lv_checkbox_row = document.createElement("input");   //Creating checkbox to select row
      lv_checkbox_row.type = "checkbox";
      lv_checkbox_row.title = "Select row";
      lv_checkbox_row.id = _this.container_id + "chkrow";
      lv_checkbox_row.onclick = function() {
	var _this_parent_tr = this.parentNode.parentNode;
	var lv_selected_row_idx = $( _this_parent_tr ).index();
	  if( this.checked ) {
	    $( _this_parent_tr ).addClass("clsselected");
	    _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
	  }
	  else {
	    $( _this_parent_tr ).removeClass("clsselected");
	    delete _this.selectedRows[lv_selected_row_idx];
	  }
      };
      lv_checkbox_row.onchange = function() {
	var _this_parent_tr = this.parentNode.parentNode;
	var lv_selected_row_idx = $( _this_parent_tr ).index();
	  if( this.checked ) {
	    $( _this_parent_tr ).addClass("clsselected");
	    _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
	  }
	  else {
	    $( _this_parent_tr ).removeClass("clsselected");
	    delete _this.selectedRows[lv_selected_row_idx];
	  }
      };
      
      //Checkbox Renderer
	  if( typeof _this.checkBoxRenderer === 'function' ) {
	    lv_checkbox_row = _this.checkBoxRenderer( lv_checkbox_row, v_data_val );
	  }
      
      lv_td.appendChild( lv_checkbox_row );   //Add checkbox to table data
      lv_data_tr.appendChild( lv_td );   //Add Table data element to row
      
      //Check position of Data values
        $.each( lv_header, function( v_idx, v_val ) {
          var lv_td = document.createElement("td");   //Creating data Values
          
          lv_td.style.width = v_val.width + "px";
          lv_td.innerHTML = v_data_val[v_val.dataIndex];
	  
	  //Renderer
	  if( typeof v_val.renderer === 'function' ) {
	    lv_td = v_val.renderer( lv_td, v_data_val, v_data_val[v_val.dataIndex] );
	  }
          
          lv_data_tr.appendChild( lv_td );   //Add Table data element to row
        });
        
        lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
	      
	      //If checkbox selected then add to selectedRows array
	      var lv_data_table_tr = $( lv_data_tr );
	      var lv_selected_row_idx = lv_data_table_tr.index();
		if( lv_checkbox_row.checked ) {
		  lv_data_table_tr.addClass("clsselected");
		  _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
		}
		else {
		  lv_data_table_tr.removeClass("clsselected");
		  delete _this.selectedRows[lv_selected_row_idx];
		}
    });
    
    _this.selectedRowIndex = null;
    $( lv_data_table ).delegate("tr", "click", function(e) {
	_this.selectedRowIndex = $(this).index();
	_this.selectedRow = (_this.selectedRowIndex != null) ? lv_data[_this.selectedRowIndex] : null;
    });
    
    lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
    
    lv_div.appendChild( lv_header_div ); //Add Header Table to the Container Element
    lv_div.appendChild( lv_data_div ); //Add Data Table to the Container Element
    if( _this.paging ) {
      var lv_pagcont_div = fn_createGridPagingElement( _this );
      lv_div.appendChild( lv_pagcont_div ); //Add paging Container if enabled
    }
    
    _this.containerElement = lv_div;
    _this.headerContainer = lv_header_div;
    _this.headerTable = lv_header_table;
    _this.dataContainer = lv_data_div;
    _this.dataTable = lv_data_table;
    
    //Listeners
    var lv_listeners = _this.listeners;
    $.each( lv_listeners, function( v_idx, v_val ) {
      if( v_idx ) {
	fn_assign_grid_event( _this, v_idx, v_val );
      }
    });
    
    //After Render
    if( typeof _this.afterRender === 'function' ) {
      _this.afterRender( _this );
    }
    
    _this.loadingMask.hide();
  }
  
  gridPanelChecked.prototype.render = function() {
    var _this = this;
    
    //Calculate Offset based on the current page number
    _this.pageOffset = (parseInt(_this.currentPageNo) * parseInt(_this.pageSize)) - parseInt(_this.pageSize);
    _this.store.pageOffset = _this.pageOffset;
    _this.store.pageSize = _this.pageSize;
    
    _this.loadingMask = new loadingMask({
      id: 'loadingMask' + _this.id,
      masked: true,
      maskElementId: _this.container_id
    });
    _this.loadingMask.render();
    _this.loadingMask.show();
    
    //Load data when store specified
    if( _this.store ) {
      if( ( _this.store.data ) && ( !_this.reloading ) ) {
	_this.data = _this.store.data;
	
	fn_render_gridChecked( _this );
      }
      else {
	var lv_urlObj = fn_getURLnFun( _this.store.url );
	
	_this.store.callurl = lv_urlObj.url;
	_this.store.method = lv_urlObj.method;
	
	if( _this.store.exParams ) {
	  _this.store.exParams = fn_objectMerge( _this.store.exParams, { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize }, true );
	}
	else {
	  _this.store.exParams = { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize };
	}
	
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    
	    if( lv_data.success ) {
	      _this.data = lv_data[_this.store.root];
	      
	      _this.store.data = _this.data;
	      
	      if( _this.store.totalProperty ) {
		_this.store.totalValue = parseInt( lv_data[_this.store.totalProperty] );
	      }
	      else {
		_this.store.totalValue = false;
	      }
	      
	      fn_render_gridChecked( _this );
	    }
	    else {
	      if( lv_data.error != undefined ) {
		fn_alert( "Error!", lv_data.error );
	      }
	      
	      _this.loadingMask.hide();
	    }
	  }
	);
      }
      
    }
    else {
      fn_render_gridChecked( _this );
    }
  }
  
  //Sort Grid
  gridPanelChecked.prototype.sortGrid = function() {
    var _this = this;
    
    _this.loadingMask = new loadingMask({
      id: 'loadingMask' + _this.id,
      masked: true,
      maskElementId: _this.container_id
    });
    _this.loadingMask.render();
    _this.loadingMask.show();
    
    if( ( parseInt( _this.currentPageNo ) ) && ( parseInt( _this.store.totalValue ) ) ) {
      //Calculate Offset based on the current page number
      _this.pageOffset = (parseInt(_this.currentPageNo) * parseInt(_this.pageSize)) - parseInt(_this.pageSize);
      _this.store.pageOffset = _this.pageOffset;
      _this.store.pageSize = _this.pageSize;
      
      if( _this.paging ) {
	if( _this.store.exParams ) {
	  _this.store.exParams = fn_objectMerge( _this.store.exParams, { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize }, true );
	}
	else {
	  _this.store.exParams = { "pageOffset": _this.pageOffset, "pageSize": _this.pageSize };
	}
      }
	
      //Load data as per sorted column
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    
	    if( lv_data.success ) {
	      _this.data = lv_data[_this.store.root];
	      
	      //Populate Data into the Grid
	      var lv_data_div = document.getElementById( _this.container_id + "_datadiv" ); //Grid Data DIV
	      lv_data_div.innerHTML = "";
	      lv_data_div.className = "clsgrddata";
	      
	      var lv_dataLessHeight = 30;
	      //For Paging
	      if( _this.paging ) {
		lv_dataLessHeight = 57;
	      }
	      
	      if( $.isNumeric( _this.height ) ) {
		lv_data_div.style.height = (_this.height - lv_dataLessHeight) + "px";
	      }
	      else {
		lv_data_div.style.height = _this.height;
	      }
	      
	      var lv_data_table = document.createElement("table");  //Data Table
	      lv_data_table.width = "100%";
	      lv_data_table.border = 1;
	      lv_data_table.setAttribute( "id", _this.container_id + "_data");
	      
	      var lv_data = _this.data;
	      var lv_header = _this.headers;
	      
	      $.each( lv_data, function( v_data_idx, v_data_val ) {
		var lv_data_tr = document.createElement("tr");      //Data Row
		    lv_data_tr.id = _this.container_id + "dataTR" + v_data_idx;
		var lv_td = document.createElement("td");
		lv_td.className = "clsdatachkbox";
		var lv_checkbox_row = document.createElement("input");   //Creating checkbox to select row
		lv_checkbox_row.type = "checkbox";
		lv_checkbox_row.title = "Select row";
		lv_checkbox_row.id = _this.container_id + "chkrow";
		lv_checkbox_row.onclick = function() {
		  var _this_parent_tr = this.parentNode.parentNode;
		  var lv_selected_row_idx = $( _this_parent_tr ).index();
		    if( this.checked ) {
		      $( _this_parent_tr ).addClass("clsselected");
		      _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
		    }
		    else {
		      $( _this_parent_tr ).removeClass("clsselected");
		      delete _this.selectedRows[lv_selected_row_idx];
		    }
		};
		lv_checkbox_row.onchange = function() {
		  var _this_parent_tr = this.parentNode.parentNode;
		  var lv_selected_row_idx = $( _this_parent_tr ).index();
		    if( this.checked ) {
		      $( _this_parent_tr ).addClass("clsselected");
		      _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
		    }
		    else {
		      $( _this_parent_tr ).removeClass("clsselected");
		      delete _this.selectedRows[lv_selected_row_idx];
		    }
		};
		
		//Checkbox Renderer
		    if( typeof _this.checkBoxRenderer === 'function' ) {
		      lv_checkbox_row = _this.checkBoxRenderer( lv_checkbox_row, v_data_val );
		    }
		    
		lv_td.appendChild( lv_checkbox_row );   //Add checkbox to table data
		lv_data_tr.appendChild( lv_td );   //Add Table data element to row
		
		//Check position of Data values
		  $.each( lv_header, function( v_idx, v_val ) {
		    var lv_td = document.createElement("td");   //Creating data Values
		    
		    lv_td.style.width = v_val.width + "px";
		    lv_td.innerHTML = v_data_val[v_val.dataIndex];
		    
		    //Renderer
		    if( typeof v_val.renderer === 'function' ) {
		      lv_td = v_val.renderer( lv_td, v_data_val, v_data_val[v_val.dataIndex] );
		    }
		    
		    lv_data_tr.appendChild( lv_td );   //Add Table data element to row
		  });
		  
		  lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
		
		//If checkbox selected then add to selectedRows array
		var lv_data_table_tr = $( lv_data_tr );
		var lv_selected_row_idx = lv_data_table_tr.index();
		  if( lv_checkbox_row.checked ) {
		    lv_data_table_tr.addClass("clsselected");
		    _this.selectedRows[lv_selected_row_idx] = lv_data[lv_selected_row_idx];
		  }
		  else {
		    lv_data_table_tr.removeClass("clsselected");
		    delete _this.selectedRows[lv_selected_row_idx];
		  }
	      });
	      
	      _this.selectedRowIndex = null;
	      $( lv_data_table ).delegate("tr", "click", function(e) {
		  _this.selectedRowIndex = $(this).index();
		  _this.selectedRow = (_this.selectedRowIndex != null) ? lv_data[_this.selectedRowIndex] : null;
	      });
	      
	      lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
	      
	      _this.dataContainer = lv_data_div;
	      _this.dataTable = lv_data_table;
	      
	      //Listeners
	      var lv_listeners = _this.listeners;
	      $.each( lv_listeners, function( v_idx, v_val ) {
		if( v_idx ) {
		  fn_assign_grid_event( _this, v_idx, v_val );
		}
	      });
	      
	      //After Render
	      if( typeof _this.afterRender === 'function' ) {
		_this.afterRender( _this );
	      }
	    }
	    else {
	      if( lv_data.error != undefined ) {
		fn_alert( "Error!", lv_data.error );
	      }
	    }
	      
	      _this.loadingMask.hide();
	  }
	);
    }
    else {
      _this.loadingMask.hide();
    }
  }
  
  gridPanelChecked.prototype.getSelectedRecords = function() {
    var _this = this;
    return _this.selectedRows;
  }
  
  /*****End of code for GridPanelChecked****/
  
  /****Code for combobox***/
  //Constructor Method
  comboBox = function( v_params ) {
    this.id = v_params.id;
    this.width = (v_params.width) ? v_params.width : "auto";
    this.height = (v_params.height) ? v_params.height : "auto";
    this.container_id = (v_params.container_id) ? v_params.container_id : false;
    this.data = (v_params.data) ? v_params.data : false;
    this.store = (v_params.store) ? v_params.store : false;
    this.valueField = v_params.valueField;
    this.textField = v_params.textField;
    this.defaultSelectedValue = (v_params.defaultSelectedValue) ? v_params.defaultSelectedValue : null ;
    this.disabled = (v_params.disabled) ? v_params.disabled : false;
    this.listeners = (v_params.listeners) ? v_params.listeners : false;
    
    return this;
  }
  
  comboBox.prototype.render = function() {
    var _this = this;
    var lv_div = "";
    if( _this.container_id ) {
      lv_div = document.getElementById( _this.container_id );      //Container DIV element
      lv_div.innerHTML = "";
    }
    
    var lv_combo = document.createElement("select");
    lv_combo.id = _this.id;
    lv_combo.name = _this.id;
    lv_combo.disabled = _this.disabled;
    if( $.isNumeric( _this.width ) ) {
      lv_combo.style.width = _this.width + "px";
    }
    else {
      lv_combo.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_combo.style.height = _this.height + "px";
    }
    else {
      lv_combo.style.height = _this.height;
    }
    
    //Blank first element
    var lv_opts = document.createElement("option");
    lv_opts.value = "";
    lv_opts.text = "";
    lv_combo.add( lv_opts );
    
    //If DATA is passed as JSON string
    if( _this.data ) {
      var lv_data = _this.data;
      $.each( lv_data, function( v_idx, v_val ) {
	var lv_opts = document.createElement("option");
	lv_opts.value = v_val[_this.valueField];
	lv_opts.text = v_val[_this.textField];
	
	//Select the Default value
	if( ( _this.defaultSelectedValue ) && ( v_val[_this.valueField] == _this.defaultSelectedValue ) ) {
	  lv_opts.selected = true;
	}
	
	lv_combo.add( lv_opts );
      });
    }
    
    //If DATA Store is given
    if( _this.store ) {
      if( ( _this.store.data != undefined ) && ( _this.store.data ) ) {
	  var lv_items_data = _this.store.data;
	  _this.data = _this.store.data;
	    
	    $.each( lv_items_data, function( v_idx, v_val ) {
	      var lv_opts = document.createElement("option");
	      lv_opts.value = v_val[_this.valueField];
	      lv_opts.text = v_val[_this.textField];
	      
	      //Select the Default value
	      if( ( _this.defaultSelectedValue ) && ( v_val[_this.valueField] == _this.defaultSelectedValue ) ) {
		lv_opts.selected = true;
	      }
	      
	      lv_combo.add( lv_opts );
	    });
      }
      else {
	var lv_urlObj = fn_getURLnFun( _this.store.url );
	
	_this.store.callurl = lv_urlObj.url;
	_this.store.method = lv_urlObj.method;
	
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    
	    if( lv_data.success ) {
	      _this.data = lv_data[_this.store.root];
	      var lv_items_data = lv_data[_this.store.root];
	      
	      _this.store.data = _this.data;
	      
	      $.each( lv_items_data, function( v_idx, v_val ) {
		var lv_opts = document.createElement("option");
		lv_opts.value = v_val[_this.valueField];
		lv_opts.text = v_val[_this.textField];
		
		//Select the Default value
		if( ( _this.defaultSelectedValue ) && ( v_val[_this.valueField] == _this.defaultSelectedValue ) ) {
		  lv_opts.selected = true;
		}
		
		lv_combo.add( lv_opts );
	      });
	    }
	    else {
	      if( lv_data.error != undefined ) {
		fn_alert( "Error!", lv_data.error );
	      }
	    }
	    
	  }
	);
      }
    }
    
    //Listeners
    if( _this.listeners ) {
      var lv_listeners = _this.listeners;
      $.each( lv_listeners, function( v_idx, v_val ) {
	  $( lv_combo ).bind( v_idx, function() {
	    if( typeof v_val === "function" ) {
	      v_val( lv_combo );
	    }
	  });
      });
    }
    
    if( _this.container_id ) {
      lv_div.appendChild( lv_combo ); //Add Combo to the Container Element
      
      _this.containerElement = lv_div;
    }
    _this.obj = lv_combo;
  }
  
  comboBox.prototype.refresh = function() {
    var _this = this;
    
    _this.data = false;
    _this.store.data = false;
    _this.render();
  }
  
  /****End of Code for ComboBox***/
  
  
  /****Code for WindowPanel***/
  //Constructor Method
  windowPanel = function( v_params ) {
    this.id = v_params.id;
    this.width = (v_params.width) ? v_params.width : "auto";
    this.height = (v_params.height) ? v_params.height : "auto";
    this.title = (v_params.title) ? v_params.title : "";
    this.elementsDiv_id = v_params.elementsDiv_id;
    this.masked = (v_params.masked) ? v_params.masked : false;
    this.maskElementId = (v_params.maskElementId) ? v_params.maskElementId : false;
    this.data = (v_params.data) ? v_params.data : false;
    this.buttons = (v_params.buttons) ? v_params.buttons : false;
    this.buttonsTop = (v_params.buttonsTop) ? v_params.buttonsTop : false;
    
    return this;
  }
  
  windowPanel.prototype.render = function() {
    var _this = this;
    _this.maskElementPosition = null;
    
    fn_removeChildElem( "divWinObjCont" + _this.id );
    
    var lv_divWinObjCont = document.createElement("div");
    lv_divWinObjCont.id = "divWinObjCont" + _this.id;
    
    if( ( _this.masked ) && ( _this.maskElementId ) ) {
      _this.maskElement = document.getElementById( _this.maskElementId );
      _this.maskElementStyle = fn_getComputedStyle( _this.maskElement );
      
      _this.maskElementPosition = fn_getPosition( _this.maskElementId );
      
      lv_divWinObjCont.style.height = _this.maskElementStyle.height;
      lv_divWinObjCont.style.width = _this.maskElementStyle.width;
      lv_divWinObjCont.style.position = "absolute";
      if( _this.maskElementPosition.x ) {
	lv_divWinObjCont.style.left = _this.maskElementPosition.x + "px";
      }
      if( _this.maskElementPosition.y ) {
	lv_divWinObjCont.style.top = _this.maskElementPosition.y + "px";
      }
    }
    else {
      lv_divWinObjCont.style.width = "99%";
      lv_divWinObjCont.style.position = "absolute";
      lv_divWinObjCont.style.clear = "both";
      lv_divWinObjCont.style.top = "13%";
    }
    
    var lv_highestZIndex = fn_getHighestZIndex("body");
    
    lv_divWinObjCont.style.zIndex = lv_highestZIndex + 3;
    
    var lv_divWinObj = document.createElement("div");
    lv_divWinObj.id = "divWinObj" + _this.id;
    lv_divWinObj.style.background = "#FFFFFF";
    lv_divWinObj.style.border = "1px solid #000000";
    lv_divWinObj.className = "clswinpnl";
    
    if( $.isNumeric( _this.width ) ) {
      lv_divWinObj.style.width = _this.width + "px";
    }
    else {
      lv_divWinObj.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.height ) ) {
      lv_divWinObj.style.height = _this.height + "px";
    }
    else {
      lv_divWinObj.style.height = _this.height;
    }
    lv_divWinObj.style.overflow = "auto";
    lv_divWinObj.style.position = "relative";
    lv_divWinObj.style.margin = "0 auto";
    
    //Window Title
    var lv_table = document.createElement("table");
    var lv_tr_title = document.createElement("tr");
    var lv_td_title = document.createElement("td");
    var lv_div_title = document.createElement("div");
    
    if( $.isNumeric( _this.width ) ) {
      lv_div_title.style.width = (_this.width - 6) + "px";
    }
    else {
      lv_div_title.style.width = _this.width;
    }
    lv_div_title.className = "clswintitle";
    lv_div_title.innerHTML = _this.title;
    lv_td_title.appendChild( lv_div_title );
    lv_tr_title.appendChild( lv_td_title );
    lv_tr_title.id = "trWinTitle" + _this.id;
    
    lv_table.appendChild( lv_tr_title );
    
    //Top Buttons
    var lv_tr_topbtns = document.createElement("tr");
    var lv_td_topbtns = document.createElement("td");
    var lv_btnstop_table = document.createElement("table");
	lv_btnstop_table.style.float = "right";
    var lv_btnstop_tr = document.createElement("tr");
    if( _this.buttonsTop ) {
      var lv_buttonstop_arry = _this.buttonsTop;
      
      $.each( lv_buttonstop_arry, function( v_idx, v_val ) {
	var lv_btnstop_td = document.createElement("td");
	var lv_btntop = fn_attachHandler( 'button', v_val );
	
	lv_btnstop_td.appendChild( lv_btntop );
	lv_btnstop_tr.appendChild( lv_btnstop_td );
      });
    }
    lv_btnstop_table.appendChild( lv_btnstop_tr );
    lv_td_topbtns.appendChild( lv_btnstop_table );
    lv_tr_topbtns.appendChild( lv_td_topbtns );
    lv_table.appendChild( lv_tr_topbtns );
    //End of code for Top buttons
    
    //Window Elements Body
    var lv_tr_body = document.createElement("tr");
    var lv_td_body = document.createElement("td");
    var lv_divWinElms = document.createElement("div");
    lv_divWinElms.innerHTML = $( "#" + _this.elementsDiv_id ).html();
    
    //Assign values to the elements
    if( _this.data ) {
      fn_assignValues_to_window( lv_divWinElms, _this.data );
    }
    
    if( _this.masked ) {
      fn_removeChildElem( "maskDiv" + _this.id );
      
      var lv_maskDiv = document.createElement("div");
      lv_maskDiv.id = "maskDiv" + _this.id;
      
      if( _this.maskElementId ) {
	lv_maskDiv.style.display = "none";
	lv_maskDiv.style.height = _this.maskElementStyle.height;
	lv_maskDiv.style.width = _this.maskElementStyle.width;
	lv_maskDiv.style.position = "absolute";
	lv_maskDiv.style.left = _this.maskElementStyle.left;
	lv_maskDiv.style.top = _this.maskElementStyle.top;
	if( _this.maskElementPosition.x ) {
	  lv_maskDiv.style.left = _this.maskElementPosition.x + "px";
	}
	if( _this.maskElementPosition.y ) {
	  lv_maskDiv.style.top = _this.maskElementPosition.y + "px";
	}
      }
      else {
	lv_maskDiv.style.display = "none";
	lv_maskDiv.style.height = "100%";
	lv_maskDiv.style.width = "100%";
	lv_maskDiv.style.position = "fixed";
	lv_maskDiv.style.clear = "both";
	lv_maskDiv.style.left = "0px";
	lv_maskDiv.style.top = "0px";
      }
      
      lv_maskDiv.style.zIndex = lv_highestZIndex + 1;
      lv_maskDiv.className = "clsmask";
      
      _this.maskDiv = lv_maskDiv;
      
      document.body.appendChild( lv_maskDiv );
    }
    lv_td_body.appendChild( lv_divWinElms );
    lv_tr_body.appendChild( lv_td_body );
    lv_table.appendChild( lv_tr_body );
    
    //Buttons
    var lv_btns_table = document.createElement("table");
	lv_btns_table.style.float = "right";
    var lv_btns_tr = document.createElement("tr");
    if( _this.buttons ) {
      var lv_buttons_arry = _this.buttons;
      
      $.each( lv_buttons_arry, function( v_idx, v_val ) {
	var lv_btns_td = document.createElement("td");
	var lv_btn = fn_attachHandler( 'button', v_val );
	
	lv_btns_td.appendChild( lv_btn );
	lv_btns_tr.appendChild( lv_btns_td );
      });
    }
    lv_btns_table.appendChild( lv_btns_tr );
    //End of code for buttons
    
    lv_divWinObj.appendChild( lv_table );  //Window Body
    lv_divWinObj.appendChild( lv_btns_table );   //Buttons
    
    lv_divWinObjCont.appendChild( lv_divWinObj );
    
    _this.obj = lv_divWinObjCont;
    document.body.appendChild( lv_divWinObjCont );
    
    var lv_tr_ttl = document.getElementById( "trWinTitle" + _this.id );
    var lv_divWinObjCt = document.getElementById( "divWinObjCont" + _this.id );
    fn_makeDraggable( lv_tr_ttl, lv_divWinObjCt );
  }
  
  windowPanel.prototype.show = function() {
    this.maskDiv.style.display = "";
    this.obj.style.display = "";
  }
  
  windowPanel.prototype.hide = function() {
    this.maskDiv.style.display = "none";
    this.obj.style.display = "none";
  }
  
  windowPanel.prototype.getFormVals = function() {
    var _this = this;
    
    var lv_values = false;
    
    lv_values = fn_serializeFormVals( _this.obj );
    
    return lv_values;
  }
  
  /****End of Code for WindowPanel***/
  
  
  /****Code for Menu***/
  
  settingsMenuPanel = function( v_params ) {
    this.id = v_params.id;
    this.data = (v_params.data) ? v_params.data : false;
    this.container_id = v_params.container_id;
    
    return this;
  }
  
  settingsMenuPanel.prototype.render = function() {
    var _this = this;
    var lv_container_elm = document.getElementById( _this.container_id );
	lv_container_elm.style.zIndex = "143";
	lv_container_elm.style.position = "relative";
    
    if( _this.data ) {
      var lv_menu = _this.data.menu;
      
      var lv_cont_ul = document.createElement("ul");
	  lv_cont_ul.id = "ulcontmenu";
	  lv_cont_ul.style.zIndex = "143";
	  lv_cont_ul.style.position = "relative";
      var lv_setting_li = document.createElement("li");
      var lv_setting_a_cont = document.createElement("a");
	  lv_setting_a_cont.href = "#";
      var lv_setting_div_cont = document.createElement("div");
	  lv_setting_div_cont.id = "divsettingcont";
      var lv_setting_div = document.createElement("div");
	  lv_setting_div.id = "divsettingimg";
	  lv_setting_div.style.backgroundImage = "url('/images/icon_settings.png')";
	  lv_setting_div.style.backgroundSize = "32px 32px";
	  lv_setting_div.style.backgroundRepeat = "no-repeat";
	  lv_setting_div.style.width = "32px";
	  lv_setting_div.style.height = "32px";
	lv_setting_div_cont.appendChild( lv_setting_div );
	lv_setting_a_cont.appendChild( lv_setting_div_cont );
	lv_setting_li.appendChild( lv_setting_a_cont );
	
      var lv_menu_div_cont = document.createElement("div");
	  lv_menu_div_cont.id = "divsettingnav";
      var lv_menu_cont_ul = document.createElement("ul");
	  lv_menu_cont_ul.id = "ulmenucont";
      
      $.each( lv_menu, function( v_idx, v_val ) {
	var lv_menu_li = document.createElement("li");
	var lv_trsfm_div_cont = document.createElement("div");
	var lv_menu_span = document.createElement("span");
	
	lv_menu_li.id = "li" + v_val.menu.id;
	lv_menu_span.innerHTML = v_val.menu.name;
	lv_menu_li.onclick = function() {
	  window.location = v_val.menu.link;
	};
	lv_trsfm_div_cont.appendChild( lv_menu_span );
	lv_menu_li.appendChild( lv_trsfm_div_cont );
	
	var lv_submenu_obj = false;
	if( ( v_val.menu.submenu ) && ( v_val.menu.submenu != 'false' ) ) {
	  lv_submenu_obj = fn_createSubMenu( v_val.menu.submenu );
	}
	
	if( lv_submenu_obj ) {
	  lv_menu_li.appendChild( lv_submenu_obj );
	}
	
	
	lv_menu_cont_ul.appendChild( lv_menu_li );
      });
      
      lv_menu_div_cont.appendChild( lv_menu_cont_ul );
      lv_setting_li.appendChild( lv_menu_div_cont );
      lv_cont_ul.appendChild( lv_setting_li );
      lv_container_elm.appendChild( lv_cont_ul );
    }
  }
  
  /****End of code for Menu***/
  
  
  /****Code for AlertBox***/
  //Constructor Method
  alertBox = function( v_params ) {
    this.id = "alertbox";
    this.width = 243;
    this.minHeight = 107;
    this.title = (v_params.title) ? v_params.title : "";
    this.masked = (v_params.masked) ? v_params.masked : false;
    this.msg = (v_params.msg) ? v_params.msg : "";
    
    return this;
  }
  
  alertBox.prototype.render = function() {
    var _this = this;
    
    fn_removeChildElem( "divWinObjCont" + _this.id );
    
    var lv_divWinObjCont = document.createElement("div");
    lv_divWinObjCont.id = "divWinObjCont" + _this.id;
    lv_divWinObjCont.style.height = "100%";
    lv_divWinObjCont.style.width = "100%";
    lv_divWinObjCont.style.position = "fixed";
    lv_divWinObjCont.style.clear = "both";
    lv_divWinObjCont.style.margin = "auto 0";
    lv_divWinObjCont.style.top = "10%";
    lv_divWinObjCont.style.left = "0";
    
    var lv_highestZIndex = fn_getHighestZIndex("body");
    
    lv_divWinObjCont.style.zIndex = lv_highestZIndex + 3;
    
    var lv_divWinObj = document.createElement("div");
    lv_divWinObj.id = "divWinObj" + _this.id;
    lv_divWinObj.style.background = "#FFFFFF";
    lv_divWinObj.style.border = "1px solid #000000";
    
    if( $.isNumeric( _this.width ) ) {
      lv_divWinObj.style.width = _this.width + "px";
    }
    else {
      lv_divWinObj.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.minHeight ) ) {
      lv_divWinObj.style.minHeight = _this.minHeight + "px";
    }
    else {
      lv_divWinObj.style.minHeight = _this.minHeight;
    }
    
    lv_divWinObj.style.overflow = "hidden";
    lv_divWinObj.style.position = "relative";
    lv_divWinObj.style.margin = "0 auto";
    
    //Window Title
    var lv_table = document.createElement("table");
    var lv_tr_title = document.createElement("tr");
    var lv_td_title = document.createElement("td");
    var lv_div_title = document.createElement("div");
    
    if( $.isNumeric( _this.width ) ) {
      lv_div_title.style.width = (_this.width - 6) + "px";
    }
    else {
      lv_div_title.style.width = _this.width;
    }
    lv_div_title.className = "clswintitle";
    lv_div_title.innerHTML = _this.title;
    lv_td_title.appendChild( lv_div_title );
    lv_tr_title.appendChild( lv_td_title );
    lv_table.appendChild( lv_tr_title );
    
    //Window Elements Body
    var lv_tr_body = document.createElement("tr");
    var lv_td_body = document.createElement("td");
    lv_td_body.className = "clsalerttxttd";
    var lv_divWinElms = document.createElement("div");
    lv_divWinElms.innerHTML = _this.msg;
    lv_divWinElms.style.margin = "13px 0";
    lv_divWinElms.style.width = "100%";
    lv_divWinElms.style.height = "auto";
    
    if( _this.masked ) {
      fn_removeChildElem( "maskDiv" + _this.id );
      
      var lv_maskDiv = document.createElement("div");
      lv_maskDiv.id = "maskDiv" + _this.id;
      lv_maskDiv.style.height = "100%";
      lv_maskDiv.style.width = "100%";
      lv_maskDiv.style.zIndex = lv_highestZIndex + 1;
      lv_maskDiv.style.display = "none";
      lv_maskDiv.style.position = "fixed";
      lv_maskDiv.style.clear = "both";
      lv_maskDiv.style.left = "0px";
      lv_maskDiv.style.top = "0px";
      lv_maskDiv.className = "clsmask";
      
      _this.maskDiv = lv_maskDiv;
      
      document.body.appendChild( lv_maskDiv );
    }
    lv_td_body.appendChild( lv_divWinElms );
    lv_tr_body.appendChild( lv_td_body );
    lv_table.appendChild( lv_tr_body );
    
    var lv_tr_btn = document.createElement("tr");
    var lv_td_btn = document.createElement("td");
    lv_td_btn.className = "clsalertbtn";
    
    var lv_ok_btn = document.createElement("input");
    lv_ok_btn.type = "button";
    lv_ok_btn.id = "btnalertok";
    lv_ok_btn.onclick = function() { _this.hide(); };
    lv_ok_btn.value = "OK";
    
    lv_td_btn.appendChild( lv_ok_btn );
    lv_tr_btn.appendChild( lv_td_btn );
    lv_table.appendChild( lv_tr_btn );
    
    lv_divWinObj.appendChild( lv_table );
    lv_divWinObjCont.appendChild( lv_divWinObj );
    
    _this.obj = lv_divWinObjCont;
    document.body.appendChild( lv_divWinObjCont );
  }
  
  alertBox.prototype.show = function() {
    this.maskDiv.style.display = "";
    this.obj.style.display = "";
  }
  
  alertBox.prototype.hide = function() {
    var _this = this;
    _this.maskDiv.style.display = "none";
    _this.obj.style.display = "none";
    return true;
  }
  
  /****End of Code for AlertBox***/
  
  
  
  /****Code for ConfirmBox***/
  //Constructor Method
  confirmBox = function( v_params ) {
    this.id = "confirmbox";
    this.width = 243;
    this.minHeight = 107;
    this.title = (v_params.title) ? v_params.title : "";
    this.masked = (v_params.masked) ? v_params.masked : false;
    this.msg = (v_params.msg) ? v_params.msg : "";
    this.callback = (v_params.callback) ? v_params.callback : false;
    this.btn = {};
    this.btn.no = false;
    this.btn.yes = false;
    
    return this;
  }
  
  confirmBox.prototype.render = function() {
    var _this = this;
    
    fn_removeChildElem( "divWinObjCont" + _this.id );
    
    var lv_divWinObjCont = document.createElement("div");
    lv_divWinObjCont.id = "divWinObjCont" + _this.id;
    lv_divWinObjCont.style.height = "100%";
    lv_divWinObjCont.style.width = "100%";
    lv_divWinObjCont.style.position = "fixed";
    lv_divWinObjCont.style.clear = "both";
    lv_divWinObjCont.style.margin = "auto 0";
    lv_divWinObjCont.style.top = "10%";
    lv_divWinObjCont.style.left = "0";
    
    var lv_highestZIndex = fn_getHighestZIndex("body");
    
    lv_divWinObjCont.style.zIndex = lv_highestZIndex + 3;
    
    var lv_divWinObj = document.createElement("div");
    lv_divWinObj.id = "divWinObj" + _this.id;
    lv_divWinObj.style.background = "#FFFFFF";
    lv_divWinObj.style.border = "1px solid #000000";
    
    if( $.isNumeric( _this.width ) ) {
      lv_divWinObj.style.width = _this.width + "px";
    }
    else {
      lv_divWinObj.style.width = _this.width;
    }
    
    if( $.isNumeric( _this.minHeight ) ) {
      lv_divWinObj.style.minHeight = _this.minHeight + "px";
    }
    else {
      lv_divWinObj.style.minHeight = _this.minHeight;
    }
    
    lv_divWinObj.style.overflow = "hidden";
    lv_divWinObj.style.position = "relative";
    lv_divWinObj.style.margin = "0 auto";
    
    //Window Title
    var lv_table = document.createElement("table");
    var lv_tr_title = document.createElement("tr");
    var lv_td_title = document.createElement("td");
    var lv_div_title = document.createElement("div");
    
    if( $.isNumeric( _this.width ) ) {
      lv_div_title.style.width = (_this.width - 6) + "px";
    }
    else {
      lv_div_title.style.width = _this.width;
    }
    lv_div_title.className = "clswintitle";
    lv_div_title.innerHTML = _this.title;
    lv_td_title.appendChild( lv_div_title );
    lv_tr_title.appendChild( lv_td_title );
    lv_table.appendChild( lv_tr_title );
    
    //Window Elements Body
    var lv_tr_body = document.createElement("tr");
    var lv_td_body = document.createElement("td");
    lv_td_body.className = "clsalerttxttd";
    lv_td_body.colSpan = "2";
    var lv_divWinElms = document.createElement("div");
    lv_divWinElms.innerHTML = _this.msg;
    lv_divWinElms.style.margin = "13px 0";
    lv_divWinElms.style.width = "99%";
    lv_divWinElms.style.height = "auto";
    
    if( _this.masked ) {
      fn_removeChildElem( "maskDiv" + _this.id );
      
      var lv_maskDiv = document.createElement("div");
      lv_maskDiv.id = "maskDiv" + _this.id;
      lv_maskDiv.style.height = "100%";
      lv_maskDiv.style.width = "100%";
      lv_maskDiv.style.zIndex = lv_highestZIndex + 1;
      lv_maskDiv.style.display = "none";
      lv_maskDiv.style.position = "fixed";
      lv_maskDiv.style.clear = "both";
      lv_maskDiv.style.left = "0px";
      lv_maskDiv.style.top = "0px";
      lv_maskDiv.className = "clsmask";
      
      _this.maskDiv = lv_maskDiv;
      
      document.body.appendChild( lv_maskDiv );
    }
    lv_td_body.appendChild( lv_divWinElms );
    lv_tr_body.appendChild( lv_td_body );
    lv_table.appendChild( lv_tr_body );
    
    var lv_tr_btn = document.createElement("tr");
    var lv_td_btn = document.createElement("td");
    lv_td_btn.className = "clsalertbtn";
    var lv_td_btn_div = document.createElement("div");
    
    var lv_yes_btn = document.createElement("input");
    lv_yes_btn.type = "button";
    lv_yes_btn.id = "btnconfirmyes";
    lv_yes_btn.onclick = function() { _this.btn.yes = true; _this.hide(); };
    lv_yes_btn.value = "YES";
    
    var lv_no_btn = document.createElement("input");
    lv_no_btn.type = "button";
    lv_no_btn.id = "btnconfirmno";
    lv_no_btn.onclick = function() { _this.btn.no = true; _this.hide(); };
    lv_no_btn.value = "NO";
    
    lv_td_btn_div.appendChild( lv_yes_btn );
    lv_td_btn_div.appendChild( lv_no_btn );
    lv_td_btn.appendChild( lv_td_btn_div );
    lv_tr_btn.appendChild( lv_td_btn );
    lv_table.appendChild( lv_tr_btn );
    
    lv_divWinObj.appendChild( lv_table );
    lv_divWinObjCont.appendChild( lv_divWinObj );
    
    _this.obj = lv_divWinObjCont;
    document.body.appendChild( lv_divWinObjCont );
  }
  
  confirmBox.prototype.show = function() {
    this.maskDiv.style.display = "";
    this.obj.style.display = "";
  }
  
  confirmBox.prototype.hide = function() {
    var _this = this;
    _this.maskDiv.style.display = "none";
    _this.obj.style.display = "none";
    
    if( typeof _this.callback === 'function' ) {
      _this.callback( _this.btn );
    }
    return true;
  }
  
  /****End of Code for ConfirmBox***/
  
  
  /****Code for Loading Mask************/
  
  //Constructor Method
  loadingMask = function( v_params ) {
    this.id = v_params.id;
    this.masked = (v_params.masked) ? v_params.masked : false;
    this.maskElementId = (v_params.maskElementId) ? v_params.maskElementId : false;
    this.displayText = (v_params.displayText) ? v_params.displayText : 'Loading...';
    
    return this;
  }
  
  loadingMask.prototype.render = function() {
    var _this = this;
    
    var lv_checkExists = document.getElementById( "maskDiv" + _this.maskElementId );
    
    if( lv_checkExists != undefined ) {
      document.body.removeChild( lv_checkExists );
    }
    
      var lv_div_loading = document.createElement("div");
	var lv_loadDivMarginTop = 0;
	var lv_numericHeight = 0;
	  lv_div_loading.id = "divObj" + _this.id;
	  lv_div_loading.style.position = "relative";
	  lv_div_loading.style.overflow = "hidden";
	  lv_div_loading.style.display = "table";
      var lv_frameTable = document.createElement("table");
	  lv_frameTable.cellSpacing = "0";
	  lv_frameTable.cellPadding = "0";
      var lv_frameTr = document.createElement("tr");
      var lv_frameTdLeft = document.createElement("td");
	  lv_frameTdLeft.className = "clsldfrleft";
      var lv_frameTdMid = document.createElement("td");
	  lv_frameTdMid.className = "clsldfrmid";
      var lv_frameTdRight = document.createElement("td");
	  lv_frameTdRight.className = "clsldfrright";
      
      var lv_elementTable = document.createElement("table");
      var lv_elementTr = document.createElement("tr");
      var lv_elementTdImg = document.createElement("td");
      var lv_elementImgDiv = document.createElement("div");
	  lv_elementImgDiv.className = "clsldimgelm";
      var lv_elementTdText = document.createElement("td");
	  lv_elementTdText.className = "clsldtextelm";
	  lv_elementTdText.innerHTML = _this.displayText;
	  
	  lv_elementTdImg.appendChild( lv_elementImgDiv );
	  lv_elementTr.appendChild( lv_elementTdImg );
	  lv_elementTr.appendChild( lv_elementTdText );
	  lv_elementTable.appendChild( lv_elementTr );
	  
	  lv_frameTdMid.appendChild( lv_elementTable );
	  
	  lv_frameTr.appendChild( lv_frameTdLeft );
	  lv_frameTr.appendChild( lv_frameTdMid );
	  lv_frameTr.appendChild( lv_frameTdRight );
	  lv_frameTable.appendChild( lv_frameTr );
	  lv_div_loading.appendChild( lv_frameTable );
	  
      var lv_highestZIndex = fn_getHighestZIndex("body");
      
      if( ( _this.masked ) && ( _this.maskElementId ) ) {
	var lv_element = document.getElementById( _this.maskElementId );
	var lv_maskElementPosition = fn_getPosition( _this.maskElementId );
	var lv_maskElementStyle = fn_getComputedStyle( lv_element );
	var lv_maskDiv = document.createElement("div");
	
	//Calculate Top Margin for displaying the 'Loading' Div in middle
	lv_numericHeight = parseInt( lv_maskElementStyle.height.substring( 0, parseInt( lv_maskElementStyle.height.length - 2 ) ) );
	if( !isNaN( lv_numericHeight ) ) {
	  lv_loadDivMarginTop = lv_numericHeight / 2 - 30;
	  lv_div_loading.style.marginTop = lv_loadDivMarginTop + "px";
	  lv_div_loading.style.marginRight = "auto";
	  lv_div_loading.style.marginBottom = "0px"
	  lv_div_loading.style.marginLeft = "auto";
	}
	else {
	  lv_div_loading.style.margin = "auto auto";
	}
	
	lv_maskDiv.id = "maskDiv" + _this.maskElementId;
	
	lv_maskDiv.style.display = "none";
	lv_maskDiv.style.height = lv_maskElementStyle.height;
	lv_maskDiv.style.width = lv_maskElementStyle.width;
	lv_maskDiv.style.position = "absolute";
	lv_maskDiv.style.left = lv_maskElementStyle.left;
	lv_maskDiv.style.top = lv_maskElementStyle.top;
	if( lv_maskElementPosition.x ) {
	  lv_maskDiv.style.left = lv_maskElementPosition.x + "px";
	}
	if( lv_maskElementPosition.y ) {
	  lv_maskDiv.style.top = lv_maskElementPosition.y + "px";
	}
	
	lv_maskDiv.style.zIndex = lv_highestZIndex + 1;
	lv_maskDiv.className = "clsmask";
	
	lv_maskDiv.appendChild( lv_div_loading );
	
	_this.loadingDiv = lv_maskDiv;
      }
      else if( _this.maskElementId ) {
	var lv_elementCont = document.getElementById( _this.maskElementId );
	var lv_contElementPosition = fn_getPosition( _this.maskElementId );
	var lv_contElementStyle = fn_getComputedStyle( lv_elementCont );
	var lv_contDiv = document.createElement("div");
	
	//Calculate Top Margin for displaying the 'Loading' Div in middle
	lv_numericHeight = parseInt( lv_contElementStyle.height.substring( 0, parseInt( lv_contElementStyle.height.length - 2 ) ) );
	if( !isNaN( lv_numericHeight ) ) {
	  lv_loadDivMarginTop = lv_numericHeight / 2 - 30;
	  lv_div_loading.style.marginTop = lv_loadDivMarginTop + "px";
	  lv_div_loading.style.marginRight = "auto";
	  lv_div_loading.style.marginBottom = "0px"
	  lv_div_loading.style.marginLeft = "auto";
	}
	else {
	  lv_div_loading.style.margin = "auto auto";
	}
	
	lv_contDiv.id = "contDiv" + _this.maskElementId;
	
	lv_contDiv.style.display = "none";
	lv_contDiv.style.width = lv_contElementStyle.width;
	lv_contDiv.style.position = "absolute";
	lv_contDiv.style.left = lv_contElementStyle.left;
	lv_contDiv.style.top = lv_contElementStyle.top;
	if( lv_contElementPosition.x ) {
	  lv_contDiv.style.left = lv_contElementPosition.x + "px";
	}
	if( lv_contElementPosition.y ) {
	  lv_contDiv.style.top = lv_contElementPosition.y + "px";
	}
	
	lv_contDiv.style.zIndex = lv_highestZIndex + 1;
	lv_contDiv.className = "clsmask";
	
	lv_contDiv.appendChild( lv_div_loading );
	
	_this.loadingDiv = lv_contDiv;
      }
      
      document.body.appendChild( _this.loadingDiv );
      
  }
  
  loadingMask.prototype.show = function() {
    var _this = this;
    
    _this.loadingDiv.style.display = "table";
  }
  
  loadingMask.prototype.hide = function() {
    var _this = this;
    
    _this.loadingDiv.style.display = "none";
  }
  
  /***End of code for Loading Mask*****/
  
  /***Code for greenCheck*******/
  //Constructor Method
  greenCheck = function( v_params ) {
    this.id = v_params.id;
    this.checkFieldId = (v_params.checkFieldId) ? v_params.checkFieldId : false;
    this.contDiv = document.createElement("div");
    
    return this;
  }
  
  greenCheck.prototype.render = function() {
    var _this = this;
    
    fn_removeChildElem( "contDiv" + _this.id );
    
    var lv_contDiv = document.createElement("div");
	lv_contDiv.style.display = "none";
	lv_contDiv.id = "contDiv" + _this.id;
	lv_contDiv.className = "clsgrncont";
	
    var lv_table = document.createElement("table");
	lv_table.cellSpacing = "0";
	lv_table.cellPadding = "0";
    var lv_tr = document.createElement("tr");
    var lv_td_img = document.createElement("td");
    var lv_div_img = document.createElement("div");
    
    lv_td_img.className = "clsimgok";
    
    lv_td_img.appendChild( lv_div_img );
    lv_tr.appendChild( lv_td_img );
    lv_table.appendChild( lv_tr );
    
    lv_contDiv.appendChild( lv_table );
    
    var lv_chkElm = document.getElementById( _this.checkFieldId );
    var lv_parentNode = lv_chkElm.parentNode;
    if ( lv_parentNode != undefined ) {
      lv_parentNode.appendChild( lv_contDiv );
    }
    else {
      document.body.appendChild( lv_contDiv );
    }
    
    _this.contDiv = lv_contDiv;
  }
  
  greenCheck.prototype.show = function() {
    var _this = this;
    
    _this.contDiv.style.display = "block";
  }
  
  greenCheck.prototype.hide = function() {
    var _this = this;
    
    _this.contDiv.style.display = "none";
  }
  
  greenCheck.prototype.remove = function() {
    var _this = this;
    
    fn_removeChildElem( "contDiv" + _this.id );
  }
  
  /***End of code for greenCheck*******/
  
  /***Code for ErrorMsg*******/
  //Constructor Method
  errorMsg = function( v_params ) {
    this.id = v_params.id;
    this.errorFieldId = (v_params.errorFieldId) ? v_params.errorFieldId : false;
    this.errorText = (v_params.errorText) ? v_params.errorText : '';
    this.contDiv = document.createElement("div");
    
    return this;
  }
  
  errorMsg.prototype.setErrorText = function( v_txt ) {
    this.errorText = v_txt;
  }
  
  errorMsg.prototype.render = function() {
    var _this = this;
    
    fn_removeChildElem( "contDiv" + _this.id );
    
    var lv_contDiv = document.createElement("div");
	lv_contDiv.style.display = "none";
	lv_contDiv.id = "contDiv" + _this.id;
	lv_contDiv.className = "clserrcont";
    
    var lv_highestZIndex = fn_getHighestZIndex("body");
	lv_contDiv.style.zIndex = parseInt( lv_highestZIndex ) + 1;
    
    if( _this.errorFieldId ) {
      var lv_elementCont = document.getElementById( _this.errorFieldId );
      var lv_contElementStyle = fn_getComputedStyle( lv_elementCont );
      var lv_contElementPosition = fn_getPosition( _this.errorFieldId );
      var lv_contNumericTop = parseInt( lv_contElementPosition.y );
      var lv_contNumericLeft = parseInt( lv_contElementPosition.x );
      var lv_contNumericHeight = parseInt( lv_contElementStyle.height.substring( 0, parseInt( lv_contElementStyle.height.length - 2 ) ) );
      
      if( !$.isNumeric( lv_contNumericHeight ) ) {
	lv_contNumericHeight = 7;
      }
      
      lv_contDiv.style.position = "absolute";
      lv_contDiv.style.left = ( lv_contNumericLeft + 5 ) + "px";
      lv_contDiv.style.top = ( lv_contNumericTop + lv_contNumericHeight + 5 ) + "px";
    }
    
    var lv_table = document.createElement("table");
    var lv_tr = document.createElement("tr");
    var lv_td_img = document.createElement("td");
    var lv_td_txt = document.createElement("td");
    var lv_div_img = document.createElement("div");
    
    lv_td_img.className = "clsimgerr";
    lv_td_txt.className = "clstxterr";
    lv_td_txt.innerHTML = _this.errorText;
    
    lv_td_img.appendChild( lv_div_img );
    lv_tr.appendChild( lv_td_img );
    lv_tr.appendChild( lv_td_txt );
    lv_table.appendChild( lv_tr );
    
    lv_contDiv.appendChild( lv_table );
    
    document.body.appendChild( lv_contDiv );
    
    _this.contDiv = lv_contDiv;
  }
  
  errorMsg.prototype.show = function() {
    var _this = this;
    
    _this.contDiv.style.display = "block";
  }
  
  errorMsg.prototype.hide = function() {
    var _this = this;
    
    _this.contDiv.style.display = "none";
  }
  
  errorMsg.prototype.remove = function() {
    var _this = this;
    
    fn_removeChildElem( "contDiv" + _this.id );
  }
  
  /***End of code for ErrorMsg*******/
  
  /***Functions***/
  
  //Alert
  fn_alert = function( v_title, v_msg ) {
    var lv_alertObj = new alertBox({
      title: v_title,
      msg: v_msg,
      masked: true
    });
    lv_alertObj.render();
    lv_alertObj.show();
  }
  
  //Confirm
  fn_confirm = function( v_title, v_msg, v_callback ) {
    var lv_confirmObj = new confirmBox({
      title: v_title,
      msg: v_msg,
      masked: true,
      callback: v_callback
    });
    lv_confirmObj.render();
    lv_confirmObj.show();
  }
  
  //Function to Assign values to the DIV container's child elements
  fn_assignValues_to_window = function( v_divElmt, v_data ) {
    var lv_data = v_data;
    
    for(var v_key in lv_data ) {
      
      var lv_found_elm = $( v_divElmt ).find( "#" + v_key );
      var lv_elmTagName = lv_found_elm.prop("tagName");
      
      switch( lv_elmTagName ) {
	case "INPUT":
	  switch( lv_found_elm.attr( "type" ) ) {
	    case "checkbox":
	      if( ( lv_data[v_key] ) && ( lv_data[v_key] != '0' ) && ( lv_data[v_key] != 'false' ) ) {
		lv_found_elm.attr("checked", true );
	      }
	      else {
		lv_found_elm.attr("checked", false );
	      }
	      break;
	    
	    default:
	      lv_found_elm.val( lv_data[v_key] );
	  }
	  break;
	  
	case "SELECT":
	case "TEXTAREA":
	  lv_found_elm.val( lv_data[v_key] );
	  break;
	
	case "DIV":
	  lv_found_elm.html( lv_data[v_key] );
	  break;
	
	default:
	  lv_found_elm.html( lv_data[v_key] );
      }
    }
    
  }
  
  //Create Sub Menu
  fn_createSubMenu = function( v_data ) {
    var lv_ul = document.createElement("ul");
    
    $.each( v_data, function( v_idx, v_val ) {
      var lv_li = document.createElement("li");
      var lv_span = document.createElement("span");
      
      lv_li.id = "li" + v_val.menu.id;
      lv_span.innerHTML = v_val.menu.name;
      lv_li.onclick = function() {
	window.location = v_val.menu.link;
      };
      lv_li.appendChild( lv_span );
      
      var lv_submenu_obj = false;
      if( ( v_val.menu.submenu ) && ( v_val.menu.submenu != 'false' ) ) {
	lv_submenu_obj = fn_createSubMenu( v_val.menu.submenu );
      }
      
      if( lv_submenu_obj ) {
	lv_li.appendChild( lv_submenu_obj );
      }
      
      lv_ul.appendChild( lv_li );
    });
    
    return lv_ul;
  }
  
  //Get Hightest Z-Index
  fn_getHighestZIndex = function( v_elem ) {
    var lv_elems_ary = document.getElementsByTagName(v_elem);
    var lv_elems = [];
    if( lv_elems_ary[0] != undefined ) {
      lv_elems = lv_elems_ary[0].getElementsByTagName("*");;
    }
    var lv_highest = 0;
    for (var i = 0; i < lv_elems.length; i++) {
      var lv_zindex = 0;
      if( document.defaultView && document.defaultView.getComputedStyle(lv_elems[i],null) ) {
	lv_zindex = document.defaultView.getComputedStyle(lv_elems[i],null).getPropertyValue("z-index");
      }
      else if( lv_elems[i].currentStyle ) {
	lv_zindex = lv_elems[i].currentStyle.zIndex;
      }
      else {
	lv_zindex = lv_elems[i].style.zIndex;
      }
      
      
      if( ( lv_zindex > lv_highest ) && ( lv_zindex != 'auto' ) ) {
	lv_highest = lv_zindex;
      }
    }
    return lv_highest;
  }
  
  //Get Computed Style
  fn_getComputedStyle = function( v_elem ) {
    var lv_computedStyle = null;
    
    if( document.defaultView && document.defaultView.getComputedStyle ) {
      lv_computedStyle = document.defaultView.getComputedStyle( v_elem, null );
    }
    else if( v_elem.currentStyle ) {
      lv_computedStyle = v_elem.currentStyle;
    }
    else {
      lv_computedStyle = v_elem.style;
    }
    
    return lv_computedStyle;
  }
  
  //Remove Child Element
  fn_removeChildElem = function( v_id ) {
    var lv_node = document.getElementById( v_id );
    if( lv_node != undefined ) {
      var lv_parentNode = lv_node.parentNode;
      if ( lv_parentNode != undefined ) {
	lv_parentNode.removeChild( lv_node );
      }
      else {
	document.body.removeChild( lv_node );
      }
      
    }
  }
  
  //Remove Element object
  fn_removeElemObj = function( v_obj ) {
    var lv_node = v_obj;
    if( lv_node != undefined ) {
      var lv_parentNode = lv_node.parentNode;
      if ( lv_parentNode != undefined ) {
	lv_parentNode.removeChild( lv_node );
      }
      else {
	document.body.removeChild( lv_node );
      }
      
    }
  }
  
  fn_setCookie = function( name, value, days ) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }
  
  fn_getCookie = function( name ) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
	  var c = ca[i];
	  while (c.charAt(0)==' ') c = c.substring(1,c.length);
	  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }
  
  fn_deleteCookie = function( name ) {
      setCookie(name,"",-1);
  }
  
  fn_splice_array_elm_by_val = function( v_chk_val, v_arry ) {
    $.each( v_arry, function( v_idx, v_val ) {
      if( v_val == v_chk_val ) {
	v_arry.splice( v_idx, 1 );
	return false;
      }
      else {
	return true;
      }
    });
    
    return v_arry;
  }
  
  fn_search_array_by_val = function ( v_srchArry, v_srchVal ) {
    var lv_retArry = v_srchArry;
    var lv_found = false;
    for(var i in v_srchArry ) {
      if( ( $.isArray(v_srchArry[i]) ) || ( typeof v_srchArry[i] == 'object' ) ) {
	lv_retArry = fn_search_array_by_val( v_srchArry[i], v_srchVal );
	lv_found = lv_retArry;
      }
      else if( v_srchArry[i] === v_srchVal ) {
	  lv_found = true;
	  break;
      }
    }
      
      if( lv_found ) {
	return lv_retArry;
      }
      else {
	return false;
      }
  }
  
  fn_attachHandler = function( v_type, v_config ) {
    var lv_obj = false;
      switch( v_type ) {
	case "button":
	  lv_obj = document.createElement("input");
	  lv_obj.type = "button";
	  lv_obj.id = v_config.id;
	  lv_obj.value = v_config.text;
	  break;
	
	default:
	  lv_obj = document.createElement("div");
      }
      
      if( ( lv_obj ) && ( v_config.handler ) && ( typeof v_config.handler == "function" ) ) {
	lv_obj.onclick = v_config.handler;
      }
      
      return lv_obj;
  }
  
  fn_serializeFormVals = function( v_obj ) {
    var lv_children = v_obj.children;
    var lv_serialzeAry = {};
    var lv_retndAry = {};
    
    $.each( lv_children, function( v_idx, v_val) {
      var lv_objVals = null;
      
      lv_objVals = fn_getElemValue( v_val );
      
      if( lv_objVals ){
	lv_serialzeAry = $.extend( {}, lv_serialzeAry, lv_objVals );
      }
      else {
	lv_retndAry = fn_serializeFormVals( v_val );
	if( !fn_isAryEmpty( lv_retndAry ) ) {
	  lv_serialzeAry = $.extend( {}, lv_serialzeAry, lv_retndAry );
	}
      }
      
    });
    
    return lv_serialzeAry;
  }
  
  fn_getElemValue = function( v_elm ) {
    var lv_elmType = v_elm.tagName;
    var lv_val = null;
    var lv_retObj = null;
    
    switch( lv_elmType ) {
      case "INPUT":
	switch( v_elm.type ) {
	  case "text":
	  case "password":
	  case "hidden":
	  lv_val = v_elm.value;
	  lv_retObj = {};
	  lv_retObj[v_elm.id] = lv_val;
	  break;
	  
	  case "radio":
	    if( v_elm.checked ) {
	      lv_val = v_elm.value;
	      lv_retObj = {};
	      lv_retObj[v_elm.id] = lv_val;
	    }
	    break;
	  
	  case "checkbox":
	    lv_val = v_elm.checked;
	    lv_retObj = {};
	    lv_retObj[v_elm.id] = lv_val;
	    break;
	}
	break;
      
      case "SELECT":
      case "TEXTAREA":
	lv_val = v_elm.value;
	lv_retObj = {};
	lv_retObj[v_elm.id] = lv_val;
	break;
      
      default:
	lv_val = null;
	lv_retObj = lv_val;
    }
    
    return lv_retObj;
  }
  
  fn_isAryEmpty = function( v_ary ) {
    if( v_ary.length > 0 ) {
      return false;
    }
    else {
      for(var lv_key in v_ary) {
	  if( v_ary.hasOwnProperty( lv_key )) {
	    return false;
	  }
      }
      
     return true;
    }
  }
  
  fn_objectMerge = function( v_obj1, v_obj2, v_json ) {
    var lv_resltAry = [];
    if( ( v_json != undefined ) && ( v_json ) ) {
      lv_resltAry = {};
    }
    
    if( ( !fn_isAryEmpty( v_obj1 ) ) && ( !fn_isAryEmpty( v_obj2 ) ) ) {
      
      if( v_obj1.length > 0 ) {
	for( var i=0; i < v_obj1.length; i++ ) {
	  lv_resltAry.push( v_obj1[i] );
	}
      }
      else {
	for( var lv_obj1Key in v_obj1 ) {
	  lv_resltAry[lv_obj1Key] = v_obj1[lv_obj1Key];
	}
      }
      
      if( v_obj2.length > 0 ) {
	for( var i=0; i < v_obj2.length; i++ ) {
	  lv_resltAry.push( v_obj2[i] );
	}
      }
      else {
	for( var lv_obj2Key in v_obj2 ) {
	  lv_resltAry[lv_obj2Key] = v_obj2[lv_obj2Key];
	}
      }
      
      return lv_resltAry;
    }
    else if( !fn_isAryEmpty( v_obj1 ) ) {
      return v_obj1;
    }
    else {
      return v_obj2;
    }
  }
  
  fn_getURLnFun = function( v_url ) {
    var lv_retObj = {};
    var lv_url_arry = v_url.split("/");
    var lv_method = lv_url_arry.pop();
    var lv_frst_char = v_url.substr(0,1);
    var lv_url = "";
    
    if ( lv_frst_char != "/" ) {
      lv_url = "/" + lv_url_arry[0];
    }
    
    for(var i=1; i<lv_url_arry.length; i++) {
      lv_url = lv_url + "/" + lv_url_arry[i];
    }
    
    lv_url = lv_url + ".php";
    
    lv_retObj["method"] = lv_method;
    lv_retObj["url"] = lv_url;
    
    return lv_retObj;
  }
  
  fn_createBtnObj = function( v_midObj ) {
    
    var lv_btn_table = document.createElement("table"); //Button table
	lv_btn_table.cellSpacing = "0";
	lv_btn_table.cellPadding = "0";
    var lv_btn_tr = document.createElement("tr"); //Button tr
    var lv_btn_left_td = document.createElement("td"); //Button left td
	lv_btn_left_td.className = "clsbtnleft";
    var lv_btn_mid_td = document.createElement("td"); //Button mid td
	lv_btn_mid_td.className = "clsbtnmid";
    var lv_btn_right_td = document.createElement("td"); //Button right td
	lv_btn_right_td.className = "clsbtnright";
	
    lv_btn_mid_td.appendChild( v_midObj );
    
    lv_btn_tr.appendChild( lv_btn_left_td );
    lv_btn_tr.appendChild( lv_btn_mid_td );
    lv_btn_tr.appendChild( lv_btn_right_td );
    lv_btn_table.appendChild( lv_btn_tr );
    
    return lv_btn_table;
  }
  
  fn_clearElments = function( v_id ) {
    if( $( ":input", "#" + v_id ) ) {
      $( ":input", "#" + v_id ).each( function() {
	var _this = this;
	var lv_type = _this.type;
	  
	  switch( lv_type ) {
	    case 'text':
	      _this.value = "";
	      break;
	    case 'checkbox':
	      _this.checked = false;
	      break;
	    case 'button':
	      break;
	    default:
	      _this.value = "";
	  }
      });
    }
  }
  
  fn_validateEmail = function( v_email ) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( v_email );
  }
  
  fn_getPosition = function( v_elementId ) {
    var lv_element = document.getElementById( v_elementId );
    var lv_xPosition = 0;
    var lv_yPosition = 0;
    
    while( lv_element ) {
        lv_xPosition += (lv_element.offsetLeft - lv_element.scrollLeft + lv_element.clientLeft);
        lv_yPosition += (lv_element.offsetTop - lv_element.scrollTop + lv_element.clientTop);
        lv_element = lv_element.offsetParent;
    }
    
    var lv_ua = window.navigator.userAgent;
    var lv_msie = lv_ua.indexOf("MSIE");
    
    if( lv_msie == -1 ) {
      var lv_doc = document.documentElement;
      var lv_win_left = (window.pageXOffset || lv_doc.scrollLeft) - (lv_doc.clientLeft || 0);
      var lv_win_top = (window.pageYOffset || lv_doc.scrollTop)  - (lv_doc.clientTop || 0);
      
      lv_xPosition += lv_win_left;
      lv_yPosition += lv_win_top;
    }
    
    return { x: lv_xPosition, y: lv_yPosition };
  }
  
  //Code to move objects
	var gv_dragObject  = null;
	var gv_mouseOffset = null;
	
	fn_mouseCoords = function(v_ev){ 
	    if(v_ev.pageX || v_ev.pageY){ 
	        return {x:v_ev.pageX, y:v_ev.pageY}; 
	    } 
	    return { 
	        x:v_ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
	        y:v_ev.clientY + document.body.scrollTop  - document.body.clientTop 
	    };
	}
	
	fn_getElementPosition = function( v_element ) {
	  var lv_element = v_element;
	  var lv_xPosition = 0;
	  var lv_yPosition = 0;
	  
	  while( lv_element ) {
	      lv_xPosition += (lv_element.offsetLeft - lv_element.scrollLeft + lv_element.clientLeft);
	      lv_yPosition += (lv_element.offsetTop - lv_element.scrollTop + lv_element.clientTop);
	      lv_element = lv_element.offsetParent;
	  }
	  
	  var lv_ua = window.navigator.userAgent;
	  var lv_msie = lv_ua.indexOf("MSIE");
	  
	  if( lv_msie == -1 ) {
	    var lv_doc = document.documentElement;
	    var lv_win_left = (window.pageXOffset || lv_doc.scrollLeft) - (lv_doc.clientLeft || 0);
	    var lv_win_top = (window.pageYOffset || lv_doc.scrollTop)  - (lv_doc.clientTop || 0);
	    
	    lv_xPosition += lv_win_left;
	    lv_yPosition += lv_win_top;
	  }
	  
	  return { x: lv_xPosition, y: lv_yPosition };
	}
	
	fn_getMouseOffset = function( v_target, v_ev ){ 
	    v_ev = v_ev || window.event; 
	    var docPos       = fn_getElementPosition( v_target );
	    var lv_mousePos  = fn_mouseCoords(v_ev); 
	    return {x:lv_mousePos.x - docPos.x, y:lv_mousePos.y - docPos.y}; 
	}
	
	fn_mouseMove = function( v_ev ){ 
	    v_ev = v_ev || window.event; 
	    var lv_mousePos = fn_mouseCoords(v_ev); 
	    if( gv_dragObject ){
	        gv_dragObject.style.position = 'absolute';
	        gv_dragObject.style.top      = ( lv_mousePos.y - gv_mouseOffset.y) + "px"; 
	        gv_dragObject.style.left     = ( lv_mousePos.x - gv_mouseOffset.x ) + "px";
	    }
	}
	
	fn_mouseUp = function( v_ev ) {
	    gv_dragObject = null; 
	}
	
	fn_makeDraggable = function( v_this, v_item ){
	    if(!v_item) return; 
	    v_this.onmousedown = function(v_ev){ 
	        gv_dragObject  = v_item; 
	        gv_mouseOffset = fn_getMouseOffset(v_item, v_ev); 
	    }
	}
	
	document.onmousemove = fn_mouseMove;
	document.onmouseup   = fn_mouseUp;
  //End of code to move objects
  
});
