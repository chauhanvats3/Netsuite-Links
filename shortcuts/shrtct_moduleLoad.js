(function () {
    var codeToExecute;
    var script;
    var moduleOverlayScript = document.getElementById("moduleOverlayScript");
    if (typeof (moduleOverlayScript) != 'undefined' && moduleOverlayScript != null) {
        // Exists.
        codeToExecute = "moduleOverlayVTSOn();";
        script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "moduleOverlayScriptDriver";
        document.body.appendChild(script);
    } else {
        codeToExecute = `
var inputModuleName;
var displaySuggestion_module;
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
    "N/https",
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

        jQuery("<div id='moduleLoadOverlayVTS' class='moduleInputGroup shortcutOverlayMain'><div class='inputBoxWrapper'><input id='moduleLoadOverlayVTSInput' placeholder='Load Modules...' class='moduleInputText shortcutOverlayInputBox' spellcheck='false'> <div id='autocomplete_result_module' class='autocomplete_result' style='display: none;'></div></div></div>").appendTo("body");


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

    setTimeout(function () {
        
        var input_module = document.getElementById("moduleLoadOverlayVTSInput");
        displaySuggestion_module = document.getElementById("autocomplete_result_module");
        myAutocomplete(input_module, displaySuggestion_module, availableModules);

        moduleOverlayVTSOn();

    }, 500);


    window.onerror = function (msg, url, line, col, error) {
        if (error.message == '$(...).autocomplete is not a function' || error.message.indexOf("Mismatched anonymous define() module:") != -1)
            loadTwoTimes = true;
        else {
            if (error.message.trim() == "require is not defined")
                alert("Not A Record Page, Can't Load Modules!");
            else
                alert(error.message);
            var extra = !col ? "" : "\\ncolumn: " + col;
            extra += !error ? "" : "\\nerror: " + error;
            console.error("Error: " + msg + "\\nurl: " + url + "\\n line: " + line + extra);
        }
        var suppressErrorAlert = true;
        return suppressErrorAlert;
    };

}


function moduleOverlayVTSOn() {
    if (jQuery("#searchAnswerOverlayVTS")[0] != void 0) {
        searchOverlayVTSOff();
    }
    if (jQuery("#multiInstanceOverlayVTS")[0] != void 0) {
        multiInstanceOverlayVTSOff();
    }
    document.getElementById("moduleLoadOverlayVTS").style.display = "block";
    inputModuleName.value = "";
    inputModuleName.placeholder = 'Load Modules...';
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

                //moduleOverlayVTSOff();

                /*  setTimeout(function () {
                     alert("Loaded : " + moduleName + "\\nVariable Name : " + moduleVariableName + "\\nUse In Console!");
                 }, 500); */
                inputModuleName.value = "";
                inputModuleName.placeholder = "Loaded : " + moduleName + " | " + moduleVariableName;
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
        script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "moduleOverlayScript";
        document.body.appendChild(script);
    }

})();