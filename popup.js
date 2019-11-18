document.addEventListener('DOMContentLoaded', function () {
    var finalLink = {};
    var formSearch = document.getElementById("searchForm");
    var btnSearch = document.getElementById("btnSearch");
    var inputModuleName = document.getElementById("moduleNameInput");
    var formLoadModule = document.getElementById("loadModuleForm");
    var btnLoadModule = document.getElementById("btnLoadModule");
    var btnGithub = document.getElementById("btnGithub");
    var inputSearch = document.getElementById("inputSearch");
    var divLoadModules = document.getElementById("loadModules");
    //funtion to submit SuiteAnswers Query
    function functSubmit(event) {
        var searchQuery = inputSearch.value;
        var ansLink = "";
        if (searchQuery.trim() != "")
            ansLink = "https://netsuite.custhelp.com/app/answers/list/st/5/kw/" + searchQuery;
        else
            ansLink = "https://netsuite.custhelp.com/";
        chrome.tabs.create({
            active: true,
            url: ansLink
        });
    }

    //Assign both enter event and click event
    formSearch.addEventListener('submit', functSubmit);
    btnSearch.addEventListener('click', functSubmit);

    var queryInfo = {
        'url': "https://*.app.netsuite.com/*"
    };
    var defaultAccName = 'tstdrv2152924';

    chrome.tabs.query(queryInfo, function (tabs) {
        if (tabs == '' || tabs == void 0) { //if no netsuite tab is open
            var halfButtons = document.getElementsByClassName("btn btn-primary hasHalfValue");
            for (var j = 0; j < halfButtons.length; j++) {
                (function () {
                    var btn = halfButtons[j];
                    btn.style.display = "none"; //hide buttons with half url
                })();
            }
            // hide load modules search bar
            divLoadModules.style.display = "none";
            //   console.log("Tabs not Open");
        } else {
            chrome.tabs.query({
                currentWindow: true,
                active: true
            }, function (tabs) {
                // console.log(tabs[0]);
                var tab = tabs[0];
                var tabTitle = tab.title;
                var tabUrl = tab.url;
                if (tabUrl.includes("app.netsuite.com")) {
                    if (tabTitle.includes("NetSuite (Custom User Interface Development)")) {
                        divLoadModules.style.display = "block";
                    } else {
                        divLoadModules.style.display = "none";
                    }
                } else {
                    divLoadModules.style.display = "none";
                }
            });
        }
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {

            (function () {
                var btn = buttons[i];
                if (btn.id != 'btnGithub') {
                    if (btn.style.display != "none") { //for the buttons that are visible
                        var classNameBtn = btn.className;
                        var isClassHalfValue = classNameBtn.includes("hasHalfValue");
                        var btnId = btn.id;
                        // console.log("Class = " + classNameBtn);
                        if (isClassHalfValue) { //for those who have half link, get the account id
                            var url = tabs[0].url;
                            var urlWithoutScheme = url.slice(8);
                            var splittedUrlArr = urlWithoutScheme.split(".", 1);
                            var extractedAccName = splittedUrlArr[0];
                            var scheme = "https://";
                            var accName = extractedAccName ? extractedAccName : defaultAccName;
                            var location = btn.value;
                            finalLink[btnId] = "" + scheme + accName + location;
                        } else { //for those with full link
                            finalLink[btnId] = btn.value;
                        }
                        btn.onclick = function () { //assign on click to each button accordingly
                            var urlLink = finalLink[this.id];
                            chrome.tabs.create({
                                active: true,
                                url: urlLink
                            });
                        };
                    }
                }
            })();
        }
    });

    function loadModule() {
        var moduleName = inputModuleName.value.trim();
        if (moduleName != "" || moduleName != void 0) {
            if (moduleName.startsWith("N/") || moduleName.startsWith("SuiteScripts/")) {
                console.log("Module Name : " + moduleName);
                var tempModuleName = "";
                if (moduleName.endsWith(".js")) {
                    tempModuleName = moduleName.substring(0, moduleName.length - 3);
                } else {
                    tempModuleName = moduleName;
                }

                var splittedModuleNameArr = tempModuleName.split("/");
                var moduleVariableName = splittedModuleNameArr[splittedModuleNameArr.length - 1];
                dataToSend = "" + moduleVariableName + "," + moduleName;

                var port = chrome.extension.connect({ //Create  a port to connect with background.js
                    name: "Module Communication"
                });
                port.postMessage({ //message background script to do something
                    codeToInject: dataToSend
                });
                port.onMessage.addListener(function (msg) { //Get a feedBack from Background script
                    console.log("message recieved from bg" + msg.joke);
                });
            } else {
                confirm("Supported modules are 'N/*' or 'SuiteScripts/*' only");
            }
        } else {
            confirm("Module Name Invalid");
        }
    }

    formLoadModule.addEventListener('submit', loadModule);
    btnLoadModule.addEventListener('click', loadModule);
    btnGithub.addEventListener('click', goToGithub);

    function goToGithub() {
        var urlGithub = 'https://github.com/chauhanvats3/Netsuite-Links';
        chrome.tabs.create({
            active: true,
            url: urlGithub
        });
    }

    inputSearch.addEventListener('input', inputChanged);
    inputModuleName.addEventListener('input', inputChanged);

    function inputChanged(e) {
        var caller = e.target || e.srcElement;

        if (caller.value) {
            console.log("Caller Has Value");
            caller.className = "inputHasContent";

            switch (caller.id) {

                case 'inputSearch':
                    formSearch.className = "formHasContent";
                    break;
                case 'moduleNameInput':
                    formLoadModule.className = "formHasContent";
                    break;
            }
        } else {
            caller.className = caller.className.replace(/\binputHasContent\b/g, "");
            console.log("Caller Doesn't have Value");
            switch (caller.id) {
                case 'inputSearch':
                    formSearch.className = formSearch.className.replace(/\bformHasContent\b/g, "");
                    break;
                case 'moduleNameInput':
                    formLoadModule.className = formLoadModule.className.replace(/\bformHasContent\b/g, "");
                    break;
            }
        }
    }

});