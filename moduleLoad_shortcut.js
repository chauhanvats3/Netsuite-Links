(function () {
  var codeToExecute = `
 
var inputModuleName;

function init_moduleLoadShrtct() {

    if (jQuery("#vatsModuleOverlay")[0] == void 0) {

      jQuery("<div id='vatsModuleOverlay'><input id='vatsModuleOverlayInput'><i id='btnLoadModule' class='fa fa-terminal'></i></div>").appendTo("#body");

    jQuery("<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.3.1/css/all.css'>").appendTo("head");

    jQuery("<script src='https://code.jquery.com/jquery-3.4.1.min.js'></script>").appendTo("head");

    jQuery("<script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>").appendTo("head");
    
    jQuery("#vatsModuleOverlay").click(function (e) {
      //console.log("Outside Input box clicked");
      vatsOverlayOff();
    });
    jQuery("#vatsModuleOverlayInput").click(function (e) {
      e.stopPropagation();
      //console.log("Input box clicked");
    });
    jQuery("#btnLoadModule").click(function (e) {
      e.stopPropagation();
      loadModule();
      //console.log("Input box clicked");
    });
   
    inputModuleName = document.getElementById("vatsModuleOverlayInput");
    inputModuleName.addEventListener('keydown', (e) => {
      //console.log("e.key" + e.key);
      if (e.key === "Enter") {
        loadModule();
      } else if (e.key === "Tab") {
        //console.log("tab pressed");
        e.preventDefault();
      }
    });
   
  }

  vatsOverlayOn();


  var availableModules = [
    "N/record",
    "N/currentRecord",
    "N/runtime",
    "N/action",
    "N/commerce/recordView",
    "N/currency",
    "N/email",
    "N/format",
    "N/format/i18n",
    "N/http",
    "N/log",
    "N/portlet",
    "N/query",
    "N/search",
    "N/transaction",
    "N/translation",
    "N/ui/dialog",
    "N/ui/message",
    "N/url",
    "N/util",
    "N/xml"
  ];
  
  setTimeout(function () {
    $("#vatsModuleOverlayInput").autocomplete({
      source: availableModules,
      minLength: 0
    });
 
   }, 500);
 

}

function vatsOverlayOn() {
  
  document.getElementById("vatsModuleOverlay").style.display = "block";
  inputModuleName.value = "";
  inputModuleName.focus();

}

function vatsOverlayOff() {
  document.getElementById("vatsModuleOverlay").style.display = "none";
}

function loadModule() {
  var moduleName = inputModuleName.value.trim();
  if (moduleName != "" || moduleName != void 0 || moduleName != null) {
    if (moduleName.startsWith("N/") || moduleName.startsWith("SuiteScripts/")) {

      var tempModuleName = "";
      if (moduleName.endsWith(".js")) {
        tempModuleName = moduleName.substring(0, moduleName.length - 3);
      } else {
        tempModuleName = moduleName;
      }

      var splittedModuleNameArr = tempModuleName.split("/");
      var moduleVariableName = splittedModuleNameArr[splittedModuleNameArr.length - 1];
      
        require([moduleName], function () {
          window[moduleVariableName] = require(moduleName);

          vatsOverlayOff();
          
          alert("Loaded : " + moduleName + "\\nVariable Name : " + moduleVariableName + "\\nUse In Console!");
          
          console.log("Module Loaded : " + moduleName + "\\nVariable Name : " + moduleVariableName);
        });
     

    } else {
      alert("Supported modules are 'N/*' or 'SuiteScripts/*' only");
      inputModuleName.focus();
    }
  } else {
    alert("Module Name Invalid");
    inputModuleName.focus();
  }
}
init_moduleLoadShrtct();

`;
  var script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
  script.textContent = codeToExecute;
  document.body.appendChild(script);
})();