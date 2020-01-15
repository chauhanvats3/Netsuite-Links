document.addEventListener('DOMContentLoaded', function () {

    var finalLink = {};
    var inputSearch = document.getElementById("inputSearch");
    var btnSearch = document.getElementById("btnSearch");
    var inputModuleName = document.getElementById("moduleNameInput");
    var btnLoadModule = document.getElementById("btnLoadModule");
    var inputGroups = document.getElementsByClassName("inputGroup");
    var defaultAccName = 'tstdrv2152924';
    var searchInputGroup = document.getElementById("searchForm");
    var moduleInputGroup = document.getElementById("loadModules");
    var inputBoxValue = "";
    var moduleLoadDisabled = false;
    var btnRecToJson = document.getElementById("btnRecToJson");



    function disableModuleInput() {
        inputModuleName.disabled = true;
        inputModuleName.placeholder = "Disabled Here!";
        btnLoadModule.addEventListener('click', doNothingOnClick);
        moduleLoadDisabled = true;
    }

    function disableRecToJSON() {
        btnRecToJson.disabled = true;
        btnRecToJson.innerHTML = "Disabled";
    }

    /**============================Search and load module animation fix=========================== */
    inputGroups = [searchInputGroup, moduleInputGroup];
    inputGroups.forEach(eachIG => {
        eachIG.addEventListener("mouseleave", e => {
            switch (eachIG.id) {
                case "searchForm":
                    if (inputBoxValue)
                        searchInputGroup.classList.add("searchInputGroupOpened");
                    else
                        searchInputGroup.classList.remove("searchInputGroupOpened");
                    break;
                case "loadModules":
                    if (inputBoxValue)
                        moduleInputGroup.classList.add("moduleInputGroupOpened");
                    else
                        moduleInputGroup.classList.remove("moduleInputGroupOpened");
                    break;
            }

            if (!inputBoxValue)
                eachIG.style.zIndex = "0";

        });
        eachIG.addEventListener("mouseenter", e => {
            eachIG.style.zIndex = "1";
        });
    });
    /**================================== Animation Fix ENDS =============================================== */


    /* ========================== Search Suite Answers Logic Here =========================== */
    //Assign both enter event and click event
    inputSearch.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            functDoSearch(e);
        }
    });
    btnSearch.addEventListener('click', functDoSearch);
    //funtion to submit SuiteAnswers Query
    function functDoSearch(event) {
        var searchQuery = inputSearch.value;
        var ansLink = "https://netsuite.custhelp.com/";

        if (searchQuery.trim() != "") {
            searchQuery = searchQuery.replace(/ /g, "=");
            ansLink = "https://netsuite.custhelp.com/app/answers/list/st/5/kw/" + searchQuery;
        }

        chrome.tabs.create({
            active: true,
            url: ansLink
        });
    }
    /* ================================= Search Answers ENDS ============================================ */


    var getAllNetsuiteTabsQuery = {
        'url': "https://*.app.netsuite.com/*"
    };
    chrome.tabs.query(getAllNetsuiteTabsQuery, function (allNetsuiteTabs) {
        console.log("Query for all NS tabs fired");
        if (allNetsuiteTabs.length == 0) { //if no netsuite tab is open
            console.log("no netsuite tab open");
            disableModuleInput();
            disableRecToJSON();

        } else { //netsuite tab is open

            console.log("Netsuite tab open");
            var getCurrentTabQuery = {
                currentWindow: true,
                active: true
            };
            chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
                console.log("Active tab query fired");
                if (currentWindowTabs.length != 0) { //current window is present
                    console.log("Current tabis present");
                    // console.log(tabs[0]);
                    var currTab = currentWindowTabs[0];
                    var tabUrl = currTab.url;
                    if (tabUrl.includes("app.netsuite.com")) {
                        console.log("tab includes ns url");
                        inputModuleName.style.display = "block";
                        inputModuleName.placeholder = "Load Modules";
                    } else {
                        console.log("tab doesnt include ns url");
                        disableModuleInput();
                        disableRecToJSON();
                    }
                } else {
                    console.log("No current window present");
                    disableModuleInput();
                    disableRecToJSON();
                }

            });
        }
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            (function () {
                var btn = buttons[i];

                var classNameBtn = btn.className;
                var isClassHalfValue = classNameBtn.includes("hasHalfValue");
                var btnId = btn.id;
                // console.log("Class = " + classNameBtn);
                if (isClassHalfValue) {
                    var scheme, accName, location;
                    scheme = "https://";
                    location = btn.value;
                    if (allNetsuiteTabs.length != 0) { //If any netsuite tab is open
                        //for those who have half link, get the account id
                        var url = allNetsuiteTabs[0].url;
                        var urlWithoutScheme = url.slice(8);
                        var splittedUrlArr = urlWithoutScheme.split(".", 1);
                        var extractedAccName = splittedUrlArr[0].trim();
                        accName = extractedAccName ? extractedAccName : defaultAccName;
                        finalLink[btnId] = "" + scheme + accName + location;
                    } else {
                        //if no netsuite tab is open
                        finalLink[btnId] = "" + scheme + defaultAccName + location;
                    }

                } else { //for those with full link
                    finalLink[btnId] = btn.value;
                }

                /* if (btn.id == "btnLogIn") {
                    var curBtnId = btn.id;
                    btn.onclick = function () {
                        //assign on click to each button accordingly
                        var getCurrentTabQuery = {
                            currentWindow: true,
                            active: true
                        };
                        chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
                            var urlLink = "https://www.google.com";
                            if (currentWindowTabs.length != 0) { //current window is present
                                var currTab = currentWindowTabs[0];
                                var tabUrl = currTab.url;
                                if (tabUrl.trim() === "chrome://newtab/") {
                                    urlLink = finalLink[curBtnId];
                                    chrome.tabs.update({
                                        active: true,
                                        url: urlLink
                                    });
                                } else {
                                    urlLink = finalLink[curBtnId];
                                    chrome.tabs.create({
                                        active: true,
                                        url: urlLink
                                    });
                                }
                            } else {
                                urlLink = finalLink[curBtnId];
                                chrome.tabs.create({
                                    active: true,
                                    url: urlLink
                                });
                            }

                        });

                    };
                } else  */
                if (btn.id == 'btnRecToJson') {
                    btnRecToJson.addEventListener('click', convtRecToJson);
                } else {
                   /*  btn.onclick = function () { //assign on click to each button accordingly
                        var urlLink = finalLink[this.id];
                        chrome.tabs.create({
                            active: true,
                            url: urlLink
                        });
                    }; */
                    var curBtnId = btn.id;
                    btn.onclick = function () {
                        //assign on click to each button accordingly
                        var getCurrentTabQuery = {
                            currentWindow: true,
                            active: true
                        };
                        chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
                            var urlLink = "https://www.google.com";
                            if (currentWindowTabs.length != 0) { //current window is present
                                var currTab = currentWindowTabs[0];
                                var tabUrl = currTab.url;
                                if (tabUrl.trim() === "chrome://newtab/") {
                                    urlLink = finalLink[curBtnId];
                                    chrome.tabs.update({
                                        active: true,
                                        url: urlLink
                                    });
                                } else {
                                    urlLink = finalLink[curBtnId];
                                    chrome.tabs.create({
                                        active: true,
                                        url: urlLink
                                    });
                                }
                            } else {
                                urlLink = finalLink[curBtnId];
                                chrome.tabs.create({
                                    active: true,
                                    url: urlLink
                                });
                            }

                        });

                    };
                }
            })();
        }
    });

    function doNothingOnClick() {
        console.log("Do Nothing");
    }

    function convtRecToJson() {
        var port = chrome.extension.connect({ //Create  a port to connect with background.js
            name: "Module Communication"
        });
        port.postMessage({ //message background script to do something
            type: 'recToJson'
        });
        port.onMessage.addListener(function (msg) { //Get a feedBack from Background script
            console.log("message recieved from bg" + msg.replyFromBG);
        });
    }


    /*============================== LOAD MODULES Function ================================ */
    inputModuleName.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            loadModule();
        }
    });
    if (!moduleLoadDisabled) {
        btnLoadModule.addEventListener('click', loadModule);
    }

    function loadModule() {
        console.log("Module load disable = ");
        var moduleName = inputModuleName.value.trim();
        if (moduleName != "" || moduleName != void 0 || moduleName != null) {
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
                    codeToInject: dataToSend,
                    type: 'loadModule'
                });
                port.onMessage.addListener(function (msg) { //Get a feedBack from Background script
                    console.log("message recieved from bg" + msg.replyFromBG);
                });
            } else {
                var conReply = confirm("Supported modules are 'N/*' or 'SuiteScripts/*' only");
                inputModuleName.focus();
            }
        } else {
            confirm("Module Name Invalid");
        }

    }
    /*============================= Load Module ENDS ==================================== */

    /*==============================Input Listener===================================== */
    inputSearch.addEventListener('input', inputChanged);
    inputModuleName.addEventListener('input', inputChanged);


    function inputChanged(e) {
        var caller = e.target || e.srcElement;
        inputBoxValue = caller.value;
        if (inputBoxValue) {
            console.log("Caller Has Value");
        } else {
            switch (caller.id) {
                case "inputSearch":
                    searchInputGroup.classList.remove("searchInputGroupOpened");
                    break;
                case "moduleNameInput":
                    moduleInputGroup.classList.remove("moduleInputGroupOpened");
                    break;
            }

        }
    }

    /*======================================Input Listener Ends============================ */

});