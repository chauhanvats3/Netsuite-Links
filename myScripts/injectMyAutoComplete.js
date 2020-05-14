(function () {
  var codeToExecute;
  var script;
  var myAutocompleteScript = document.getElementById("myAutocompleteScript");
  if (typeof (myAutocompleteScript) != 'undefined' && myAutocompleteScript != null) {
    // Exists.
    codeToExecute = "console.log('AutoComplete Exists!')";
    script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    script.id = "myAutocompleteScriptDriver";
    document.body.appendChild(script);
  } else {
    codeToExecute = `
var count = -1;

function myAutocomplete(autocomplete, autocomplete_result, data) {

  var lastInputValue = "";

  function popupClearAndHide() {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "none";
  }

  function suggestionClicked(e) {
    e.stopPropagation();
    autocomplete.value = this.innerText;
    autocomplete_result.innerHTML = '';
    autocomplete_result.style.display = 'none';
    autocomplete.focus();
  }

  function nlHandleKeys(e) {
    var keyPressed = e.key;

    if (autocomplete_result.childElementCount == 0)
      return;
    switch (keyPressed) {
      case 'Tab':
        e.preventDefault();
        if (count > -1 && count < autocomplete_result.childElementCount){
          autocomplete.value = autocomplete_result.children.item(count).innerText;
          autocomplete.focus();
        }
        break;
      case 'Enter':
        console.log("is cancel : "+e.cancelable);
        e.preventDefault();
        if (count > -1 && count < autocomplete_result.childElementCount){
          autocomplete.value = autocomplete_result.children.item(count).innerText;
          autocomplete.focus();
          var e = jQuery.Event("keypress");
          e.which = 13; //choose the one you want
          e.keyCode = 13;
          jQuery(autocomplete).trigger(e);
        }
        break;
      case 'ArrowLeft':
        //LEFT
        e.preventDefault();
        break;
      case 'ArrowUp':
        //UP
        e.preventDefault();
        if (count > 0)
          count--;
        if (count != autocomplete_result.childElementCount - 1)
          autocomplete_result.children.item(count + 1).classList.remove("focused_autocomplete_div");        
        highlightCurrentSuggestion();
        break;
      case 'ArrowRight':
        //RIGHT
        e.preventDefault();
        break;
      case 'ArrowDown':
        //down
        e.preventDefault();
        if (count != autocomplete_result.childElementCount - 1)
          count++;
        if (count > 0)
          autocomplete_result.children.item(count - 1).classList.remove("focused_autocomplete_div");
          highlightCurrentSuggestion();
        break;
     
    }
    console.log("Pressed times : " + count);
  }

function highlightCurrentSuggestion(){
  if (count > -1 && count < autocomplete_result.childElementCount){
    autocomplete_result.children.item(count).classList.add("focused_autocomplete_div");
    autocomplete_result.children.item(count).scrollIntoView();
    autocomplete.placeholder = autocomplete_result.children.item(count).innerText;
  }
}

  function showSuggestions(event) {
    var curInputValue = autocomplete.value.trim();
    

    console.log(curInputValue + " $ " + lastInputValue);
    if (curInputValue == lastInputValue)
      return;

    var acRegEx = new RegExp("^.*" + autocomplete.value.trim() + ".*$", "i");
    for (var x = 0, b = document.createDocumentFragment(), c = false; x < data.length; x++) {
      if (acRegEx.test(data[x]) || curInputValue == "") {
        console.log("ran");
        c = true;
        var d = document.createElement("div");
        d.innerText = data[x];
        d.addEventListener("click", suggestionClicked);
        b.appendChild(d);
      }
    }
    lastInputValue = autocomplete.value;
    count = -1;
    if (c == true) {
      autocomplete_result.innerHTML = "";
      autocomplete_result.style.display = "block";
      autocomplete_result.appendChild(b);
      return;
    }
    popupClearAndHide();
  }

  autocomplete.addEventListener("keyup", showSuggestions);
  autocomplete.addEventListener("change", showSuggestions);
  autocomplete.addEventListener("focus", showSuggestions);
  autocomplete.addEventListener("keydown", nlHandleKeys);



}
`;
    script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    script.id = "myAutocompleteScript";
    document.body.appendChild(script);
  }

})();