(function () {
    var codeToExecute = `

  var inputModuleName;
  var loadTwoTimes = false;
  
  var availableModules = [
      "N/record",
      "N/currentRecord",
      "N/runtime",
      "N/action",
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
  
  function setupOverlay() {
  
      if (jQuery("#moduleLoadOverlayVTS")[0] == void 0) {
  
          jQuery("<div id='moduleLoadOverlayVTS' class='moduleInputGroup'><input id='moduleLoadOverlayVTSInput' placeholder='Load Modules...' class='moduleInputText'></div>").appendTo("body");
  
          jQuery("<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.3.1/css/all.css'>").appendTo("head");
  
          jQuery("<script src='https://code.jquery.com/jquery-3.4.1.min.js'></script>").appendTo("head");
  
          jQuery("<script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>").appendTo("head");
  
          jQuery("#moduleLoadOverlayVTS").click(function (e) {
              //console.log("Outside Input box clicked");
              moduleOverlayVTSOff();
          });
          jQuery("#moduleLoadOverlayVTSInput").click(function (e) {
              e.stopPropagation();
              //console.log("Input box clicked");
          });
       
          inputModuleName = document.getElementById("moduleLoadOverlayVTSInput");
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
  }
  
  function init_moduleLoadShrtct() {
  
      setupOverlay();
      if (jQuery("#searchAnswerOverlayVTS")[0] != void 0) {
        searchOverlayVTSOff();
    }
      moduleOverlayVTSOn();
  
  
      setTimeout(function () {
          $("#moduleLoadOverlayVTSInput").autocomplete({
              source: availableModules,
              minLength: 0
          });
  
      }, 500);
  
  
      window.onerror = function (msg, url, line, col, error) {
          if (error.message == '$(...).autocomplete is not a function' || error.message.indexOf("Mismatched anonymous define() module:") != -1)
              loadTwoTimes = true;
          else {
              if(error.message.trim() == "require is not defined")
              alert("Not A Record Page, Can't Load Modules!");
              else
              alert(error.message);
              var extra = !col ? "" : "\\ncolumn: " + col;
              extra += !error ? "" : "\\nerror: " + error;
              console.log("Error: " + msg + "\\nurl: " + url + "\\n line: " + line + extra);
          }
          var suppressErrorAlert = true;
          return suppressErrorAlert;
      };
  
  }
  
  function moduleOverlayVTSOn() {
  
      document.getElementById("moduleLoadOverlayVTS").style.display = "block";
      inputModuleName.value = "";
      inputModuleName.focus();
  
  }
  
  function moduleOverlayVTSOff() {
      document.getElementById("moduleLoadOverlayVTS").style.display = "none";
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
  
                  moduleOverlayVTSOff();
  
                  setTimeout(function () {
                      alert("Loaded : " + moduleName + "\\nVariable Name : " + moduleVariableName + "\\nUse In Console!");
                  }, 500);
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
  
  jQuery(document).ready(function () {
      init_moduleLoadShrtct();
  });

`;
    var script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    document.body.appendChild(script);
})();