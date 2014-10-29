<?php

session_start();
$_SESSION['version'] = "1.4.3";
$root = realpath( $_SERVER["DOCUMENT_ROOT"] );

include_once $root."/comcls/Menu.php";

?>

<!DOCTYPE HTML>
    <html>
	<head>
	  <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	  <title>Demo</title>
          <link href="/css/global.css?version=<?php echo $_SESSION['version']; ?>" media="screen" rel="stylesheet" />
          <link href="demo.css?version=<?php echo $_SESSION['version']; ?>" media="screen" rel="stylesheet" />
	  <link rel="stylesheet" href="/jQuery1.10.1/themes/base/jquery-ui.css?version=<?php echo $_SESSION['version']; ?>" />
	  <script src="/jQuery1.10.1/jquery-1.9.1.js?version=<?php echo $_SESSION['version']; ?>"></script>
	  <script src="/jQuery1.10.1/ui/minified/jquery-ui.custom.min.js?version=<?php echo $_SESSION['version']; ?>"></script>
          <script src="/js/global.js?version=<?php echo $_SESSION['version']; ?>"></script>
	</head>
	
	<body>
        <?php include_once $root."/comcls/incl_menu.php"; ?>
	  <div class="form_container container_12" id="divheadtitle">
	    <br><br>
	    <center>
	      <span class="clspagetitle">Demo...</span>
	    </center>
	    <br>
	  </div>
	  
	  <div id="divsrchfltr">
	    <fieldset>
	      <legend>Search Filter</legend>
	      <table>
		<tr>
		  <td>User ID</td>
		  <td>First Name</td>
		  <td>Last Name</td>
		  <td>D.O.B</td>
		</tr>
		<tr>
		  <td><input type="text" id="txtuid" name="txtuid" /></td>
		  <td><input type="text" id="txtfname" name="txtfname" /> </td>
		  <td><input type="text" id="txtlname" name="txtlname" /></td>
		  <td><input type="text" id="txtdob" name="txtdob" /></td>
		</tr>
		<tr>
		  <td colspan="6" style="text-align: center;">
		    <input type="button" id="btnsearch" name="btnsearch" value="Search" />
		  </td>
		</tr>
	      </table>
	    </fieldset>
	  </div>
	  
          <div id="divgridcont"><div id="divUsers"></div></div>
	  
          <script language="Javascript">
	  $(document).ready( function() {
	    
	    
	    $( "#txtdob" ).datepicker( {dateFormat : "dd/mm/yy" });
	    
	    var lv_grdUsersDataStore = new dataStore({
	      url: '/indexController/get_users',
	      root: 'items',
	      fields: ['u_id','u_userid','u_fname','u_lname','u_dob','u_status'],
	      exParams: { sortCol: 'u_userid', sortOrder: 'desc' },
	      totalProperty: 'totalCount'
	    });
	    
	      //Grid
		var lv_grdPnlUsers = new gridPanel({
		    id: "grdPnlUsers",
		    height: 343,
		    width: 843,
		    container_id: "divUsers",
		    store: lv_grdUsersDataStore,
		    paging: true,
		    pageSize: 20,
		    headers:  [{
			headerText: 'User Id',
			width: 83,
			dataIndex: 'u_userid'
		      },{
			headerText: 'Exp. Comp. Date',
			width: 83,
			dataIndex: 'u_fname'
		      },{
			headerText: 'Last Name',
			width: 83,
			dataIndex: 'u_lname'
		      },{
			headerText: 'D.O.B',
			width: 83,
			dataIndex: 'u_dob'
		      },{
			headerText: 'Status',
			width: 83,
			dataIndex: 'u_status'
		      }
		    ]
		});
		lv_grdPnlUsers.render();
	      
	      //Refresh Grid
	      fn_refreshUsersGrid = function() {
		
		  lv_grdPnlUsers.store.baseParams = {
			u_userid: $( "#txtuid" ).val(),
			u_fname: $( "#txtfname" ).val(),
			u_lname: $( "#txtlname" ).val(),
			u_dob: $( "#txtdob" ).val()
		  };
		  lv_grdPnlUsers.refreshGrid();
	      }
	      
	      //Search button Click event
	      $( "#btnsearch" ).on( 'click', fn_refreshUsersGrid );;
	      
	  });
	</script>
        </body>
    </html>
