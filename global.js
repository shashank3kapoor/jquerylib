/*	Modification History
	******************************************************************************************************
	Date			08 Aug 2014
	By		        Shashank Kapoor
	Description		Global code for generic usage
	******************************************************************************************************
*/

$(document).ready( function() {

/*****Code for DataStore****/
  //Consturctor Method
  dataStore = function( v_params ) {
    this.root = v_params.root;
    this.url = v_params.url;
    this.fields = v_params.fields;
    this.baseParams = ( v_params.baseParams ) ? v_params.baseParams : false;
    this.exParams = ( v_params.exParams ) ? v_params.exParams : false;
    
    return this;
  }
  
  dataStore.prototype.load = function() {
    var _this = this;
    
    var lv_url_arry = _this.url.split("/");
    var lv_method = lv_url_arry.pop();
    var lv_frst_char = _this.url.substr(0,1);
    var lv_url = "";
    if ( lv_frst_char != "/" ) {
      lv_url = "/" + lv_url_arry[0];
    }
    else {
      
    }
    
    for(var i=1; i<lv_url_arry.length; i++) {
      lv_url = lv_url + "/" + lv_url_arry[i];
    }
    
    lv_url = lv_url + ".php";
    
    _this.callurl = lv_url;
    _this.method = lv_method;
    
    _this.data = false;
    $.post(
      lv_url,
      {
	method: lv_method,
	params: _this.baseParams,
	exParams: _this.exParams
      },
      function ( v_data, v_status ) {
	var lv_data = $.parseJSON( v_data );
	_this.data = JSON.stringify( lv_data[_this.root] );
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
    
    return this;
  }
  
  //Rendering Grid
  gridPanel.prototype.render = function() {
    var _this = this;
    
    //Load data when store specified
    if( _this.store ) {
      _this.store.load();
      if( ( _this.store.data ) && ( !_this.reloading ) ) {
	_this.data = _this.store.data;
	fn_render_grid( _this );
      }
      else {
	$.post(
	  _this.store.callurl,
	  {
	    method: _this.store.method,
	    params: _this.store.baseParams,
	    exParams: _this.store.exParams
	  },
	  function ( v_data, v_status ) {
	    var lv_data = $.parseJSON( v_data );
	    _this.data = JSON.stringify( lv_data[_this.store.root] );
	    
	    fn_render_grid( _this );
	  }
	);
      }
      
    }
    else {
      fn_render_grid( _this );
    }
  }
  
  fn_render_grid = function( v_this ) {
    var _this = v_this;
    
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
      
      lv_span_img.style.width = "13px";
      lv_span_img.style.height = "13px";
      lv_span_img.className = "clsgrdheaderimg";
      lv_span_txt.className = "clsgrdheadertxt";
      lv_span_txt.innerHTML = v_val.headerText;
      
      lv_hdr_col_td_img.appendChild( lv_span_img );
      lv_hdr_col_td_txt.appendChild( lv_span_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_txt );
      lv_hdr_col_tr.appendChild( lv_hdr_col_td_img );
      lv_hdr_col_tbl.appendChild( lv_hdr_col_tr );
      
      lv_a_link.appendChild( lv_hdr_col_tbl );
      
      lv_th.width = v_val.width;
      lv_th.style.className = "clsgrdheaderth";
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
    
    if( $.isNumeric( _this.height ) ) {
      lv_data_div.style.height = (_this.height - 30) + "px";
    }
    else {
      lv_data_div.style.height = _this.height;
    }
    
    var lv_data_table = document.createElement("table");  //Data Table
    lv_data_table.width = "100%";
    lv_data_table.border = 1;
    lv_data_table.setAttribute( "id", _this.container_id + "_data");
    
    var lv_data = $.parseJSON( _this.data );
    
    $.each( lv_data, function( v_data_idx, v_data_val ) {
      var lv_data_tr = document.createElement("tr");      //Data Row
      //lv_data_tr.setAttribute("data-rowid", v_data_idx );
      
      //Check position of Data values
        $.each( lv_header, function( v_idx, v_val ) {
          var lv_td = document.createElement("td");   //Creating data Values
          
          lv_td.width = v_val.width;
          lv_td.innerHTML = v_data_val[v_val.dataIndex];
          
          lv_data_tr.appendChild( lv_td );   //Add Table data element to row
        });
        
        lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
    });
    
    _this.selectedRowIndex = null;
    $( lv_data_table ).delegate("tr", "click", function(e) {
	$(this).addClass("clsselected").siblings().removeClass("clsselected");
	_this.selectedRowIndex = $(this).index();
	_this.selectedRow = (_this.selectedRowIndex != null) ? JSON.stringify(lv_data[_this.selectedRowIndex]) : null;
    });
    
    lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
    
    lv_div.appendChild( lv_header_div ); //Add Header Table to the Container Element
    lv_div.appendChild( lv_data_div ); //Add Data Table to the Container Element
    
    _this.containerElement = lv_div;
    _this.headerContainer = lv_header_div;
    _this.headerTable = lv_header_table;
    _this.dataContainer = lv_data_div;
    _this.dataTable = lv_data_table;
    
    if( _this.v_event ) {
      fn_assign_grid_event( _this, _this.v_event, _this.v_fun );
    }
  }
  
  //Refresh Grid
  gridPanel.prototype.refreshGrid = function( v_data ) {
    var _this = this;
    _this.reloading = true;
    
    if ( v_data != undefined ) {
      _this.data = v_data;
      _this.reloading = false;
    }
    _this.render();
    _this.selectedRowIndex = null;
    _this.selectedRow = null;
  }
  
  //Sort Grid
  gridPanel.prototype.sortGrid = function() {
    var _this = this;
    
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
	  _this.data = JSON.stringify( lv_data[_this.store.root] );
	  
	  //Populate Data into the Grid
	  var lv_data_div = document.getElementById( _this.container_id + "_datadiv" ); //Grid Data DIV
	  lv_data_div.innerHTML = "";
	  lv_data_div.className = "clsgrddata";
	  
	  if( $.isNumeric( _this.height ) ) {
	    lv_data_div.style.height = (_this.height - 23) + "px";
	  }
	  else {
	    lv_data_div.style.height = _this.height;
	  }
	  
	  var lv_data_table = document.createElement("table");  //Data Table
	  lv_data_table.width = "100%";
	  lv_data_table.border = 1;
	  lv_data_table.setAttribute( "id", _this.container_id + "_data");
	  
	  var lv_data = $.parseJSON( _this.data );
	  var lv_header = _this.headers;
	  
	  $.each( lv_data, function( v_data_idx, v_data_val ) {
	    var lv_data_tr = document.createElement("tr");      //Data Row
	    
	    //Check position of Data values
	      $.each( lv_header, function( v_idx, v_val ) {
		var lv_td = document.createElement("td");   //Creating data Values
		
		lv_td.width = v_val.width;
		lv_td.innerHTML = v_data_val[v_val.dataIndex];
		
		lv_data_tr.appendChild( lv_td );   //Add Table data element to row
	      });
	      
	      lv_data_table.appendChild( lv_data_tr );   //Add data row to Table
	  });
	  
	  _this.selectedRowIndex = null;
	  $( lv_data_table ).delegate("tr", "click", function(e) {
	      $(this).addClass("clsselected").siblings().removeClass("clsselected");
	      _this.selectedRowIndex = $(this).index();
	      _this.selectedRow = (_this.selectedRowIndex != null) ? JSON.stringify(lv_data[_this.selectedRowIndex]) : null;
	  });
	  
	  lv_data_div.appendChild( lv_data_table ); //Add Table to the Data DIV
	  
	  _this.dataContainer = lv_data_div;
	  _this.dataTable = lv_data_table;
	  
	  if( _this.v_event ) {
	    fn_assign_grid_event( _this, _this.v_event, _this.v_fun );
	  }
	}
      );
  }
  
  gridPanel.prototype.getSelectedRowIndex = function() {
    return this.selectedRowIndex;
  }
  
  gridPanel.prototype.getSelectedRow = function() {
    return this.selectedRow;
  }
  
  fn_assign_grid_event = function( v_this, v_event, v_fun ) {
    var _this = v_this;
    
    $( _this.dataTable ).find("tr").bind( v_event, v_fun );
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
  
  
  /****Code for combobox***/
  //Constructor Method
  comboBox = function( v_params ) {
    this.id = v_params.id;
    this.width = (v_params.width) ? v_params.width : "auto";
    this.height = (v_params.height) ? v_params.height : "auto";
    this.container_id = v_params.container_id;
    this.data = v_params.data;
    this.valueField = v_params.valueField;
    this.textField = v_params.textField;
    this.defaultSelectedValue = (v_params.defaultSelectedValue) ? v_params.defaultSelectedValue : null ;
    this.disabled = (v_params.disabled) ? v_params.disabled : false;
    
    return this;
  }
  
  comboBox.prototype.render = function() {
    var _this = this;
    var lv_div = document.getElementById( _this.container_id );      //Container DIV element
    lv_div.innerHTML = "";
    
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
      
    var lv_data = $.parseJSON( _this.data );
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
    
    lv_div.appendChild( lv_combo ); //Add Combo to the Container Element
    
    _this.containerElement = lv_div;
    _this.combo = lv_combo;
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
    this.data = (v_params.data) ? v_params.data : false;
    this.buttons = (v_params.buttons) ? v_params.buttons : false;
    
    return this;
  }
  
  windowPanel.prototype.render = function() {
    var _this = this;
    
    fn_removeChildElem( "divWinObjCont" + _this.id );
    
    var lv_divWinObjCont = document.createElement("div");
    lv_divWinObjCont.id = "divWinObjCont" + _this.id;
    lv_divWinObjCont.style.height = "100%";
    lv_divWinObjCont.style.width = "100%";
    lv_divWinObjCont.style.position = "fixed";
    lv_divWinObjCont.style.clear = "both";
    lv_divWinObjCont.style.top = "13%";
    
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
    lv_table.appendChild( lv_tr_title );
    
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
      lv_maskDiv.style.height = "100%";
      lv_maskDiv.style.width = "100%";
      lv_maskDiv.style.zIndex = lv_highestZIndex + 1;
      lv_maskDiv.style.display = "none";
      lv_maskDiv.style.position = "fixed";
      lv_maskDiv.style.clear = "both";
      
      _this.maskDiv = lv_maskDiv;
      
      document.body.appendChild( lv_maskDiv );
    }
    lv_td_body.appendChild( lv_divWinElms );
    lv_tr_body.appendChild( lv_td_body );
    lv_table.appendChild( lv_tr_body );
    
    //Buttons
    var lv_btns_table = document.createElement("table");
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
    
    _this.winObj = lv_divWinObjCont;
    document.body.appendChild( lv_divWinObjCont );
  }
  
  windowPanel.prototype.show = function() {
    this.maskDiv.style.display = "";
    this.winObj.style.display = "";
  }
  
  windowPanel.prototype.hide = function() {
    this.maskDiv.style.display = "none";
    this.winObj.style.display = "none";
  }
  
  /****End of Code for WindowPanel***/
  
  
  
  
  
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
    lv_ok_btn.onclick = function() { _this.hide(_this); };
    lv_ok_btn.value = "OK";
    
    lv_td_btn.appendChild( lv_ok_btn );
    lv_tr_btn.appendChild( lv_td_btn );
    lv_table.appendChild( lv_tr_btn );
    
    lv_divWinObj.appendChild( lv_table );
    lv_divWinObjCont.appendChild( lv_divWinObj );
    
    _this.winObj = lv_divWinObjCont;
    document.body.appendChild( lv_divWinObjCont );
  }
  
  alertBox.prototype.show = function() {
    this.maskDiv.style.display = "";
    this.winObj.style.display = "";
  }
  
  alertBox.prototype.hide = function( v_obj ) {
    v_obj.maskDiv.style.display = "none";
    v_obj.winObj.style.display = "none";
    return true;
  }
  
  /****End of Code for AlertBox***/
  
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
  
  //Function to Assign values to the DIV container's child elements
  fn_assignValues_to_window = function( v_divElmt, v_data ) {
    var lv_data = $.parseJSON( v_data );
    
    for(var v_key in lv_data ) {
      $( v_divElmt ).find( "#" + v_key ).html( lv_data[v_key] );
    }
    
  }
  
  //Get Hightest Z-Index
  fn_getHighestZIndex = function( v_elem ) {
    var lv_elems = document.getElementsByTagName(v_elem);
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
  
});
