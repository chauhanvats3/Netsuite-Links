(function () {
    var codeToExecute;
    var script;
    var multiInstanceOverlayScript = document.getElementById("multiInstanceOverlayScript");
    if (typeof (multiInstanceOverlayScript) != 'undefined' && multiInstanceOverlayScript != null) {
        // Exists.
        codeToExecute = "multiInstanceOverlayVTSOn();";
        script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "multiInstanceOverlayScriptDriver";
        document.body.appendChild(script);
    } else {
        codeToExecute = ` 


function setupOverlay() {
    multiInstanceDataObject.availableInstancesArr = [];
    multiInstanceDataObject.availableInstancesData = {};

    if (jQuery("#multiInstanceOverlayVTS")[0] == void 0) {

        for (var eachInstanceKey in allInstancesData) {
            var eachInstanceObj = allInstancesData[eachInstanceKey];
            var compNInst = eachInstanceObj.company_and_instance;
            var instUsrName = eachInstanceObj.instanceUserName;
            var instURL = eachInstanceObj.url;
            var instType = eachInstanceObj.instanceType;
            if (instType !== "" || instType !== undefined || instType !== null)
                instType = " | " + instType.toUpperCase();
            var displayLabel = compNInst + instType + " | " + instUsrName;
            var labelValue = instURL;

            multiInstanceDataObject.availableInstancesArr.push({
                label: displayLabel
            });
            multiInstanceDataObject.availableInstancesData[displayLabel] = instURL;
        }
        deepFreeze(multiInstanceDataObject);

        jQuery("<div id='multiInstanceOverlayVTS' class='moduleInputGroup shortcutOverlayMain'><input id='multiInstanceOverlayVTSInput' placeholder='Select Instance' class='moduleInputText shortcutOverlayInputBox' spellcheck='false'></div>").appendTo("body");


        jQuery("#multiInstanceOverlayVTS").click(function (e) {
            //console.log("Outside Input box clicked");
            multiInstanceOverlayVTSOff();
        });
        jQuery("#multiInstanceOverlayVTSInput").click(function (e) {
            e.stopPropagation();
            //console.log("Input box clicked");
        });

        inputInstanceName = document.getElementById("multiInstanceOverlayVTSInput");
        inputInstanceName.addEventListener('keydown', (e) => {
            //console.log("e.key" + e.key);
            if (e.key === "Enter") {
                loadInstance();
            } else if (e.key === "Tab") {
                //console.log("tab pressed");
                e.preventDefault();
            }
        });

    }
}

function init_multiInstanceShrtct() {

    setupOverlay();

    multiInstanceOverlayVTSOn();


    setTimeout(function () {
        jQuery("#multiInstanceOverlayVTSInput").autocomplete({
            source: multiInstanceDataObject.availableInstancesArr,
            minLength: 0
        });

    }, 500);


    window.onerror = function (msg, url, line, col, error) {
        if (error.message.includes('autocomplete') || error.message.indexOf("Mismatched anonymous define() module:") != -1)
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

function multiInstanceOverlayVTSOn() {
    if (jQuery("#searchAnswerOverlayVTS")[0] != void 0) {
        searchOverlayVTSOff();
    }
    if (jQuery("#moduleLoadOverlayVTS")[0] != void 0) {
        moduleOverlayVTSOff();
    }
    document.getElementById("multiInstanceOverlayVTS").style.display = "block";
    inputInstanceName.value = "";
    inputInstanceName.focus();

}

function multiInstanceOverlayVTSOff() {
    document.getElementById("multiInstanceOverlayVTS").style.display = "none";
}

function loadInstance() {
    var selectedInstance = inputInstanceName.value.trim();
    if (selectedInstance != "" || selectedInstance != void 0 || selectedInstance != null) {
        if(multiInstanceDataObject.availableInstancesData.hasOwnProperty(selectedInstance)){
            var urlToOpen = multiInstanceDataObject.availableInstancesData[selectedInstance];
            window.open(urlToOpen, '_blank');
            multiInstanceOverlayVTSOff();
        }else{
            inputInstanceName.value = "";
            inputInstanceName.placeholder = "Please Select From The List!";
        }
    } else {
        alert("Module Name Invalid");
        inputInstanceName.focus();
    }

}

jQuery(document).ready(function () {
    init_multiInstanceShrtct();
});



`;
        script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "multiInstanceOverlayScript";
        document.body.appendChild(script);
    }

})();