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

function myAutocomplete(autocomplete, autocomplete_result, data) {

  function popupClearAndHide() {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "none";
  }

  function suggestionClicked(e) {
    e.stopPropagation();
    autocomplete.value = this.innerText;
    autocomplete_result.innerHTML = '';
    autocomplete_result.style.display = 'none';
  }

  function showSuggestions() {
   /*  if (!autocomplete.value) {
      popupClearAndHide();
      return;
    } */
    var acRegEx = new RegExp("^.*" + autocomplete.value + ".*$", "i");
    for (var x = 0, b = document.createDocumentFragment(), c = false; x < data.length; x++) {
      if (acRegEx.test(data[x])) {
        c = true;
        var d = document.createElement("div");
        d.innerText = data[x];
        d.addEventListener("click", suggestionClicked);
        b.appendChild(d);
      }
    }
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
}
  `;
    script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    script.id = "myAutocompleteScript";
    document.body.appendChild(script);
  }

})();