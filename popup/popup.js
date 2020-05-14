document.addEventListener('DOMContentLoaded', function () {

    var finalLink = {};
    var inputSearch = document.getElementById("inputSearch");
    var btnSearch = document.getElementById("btnSearch");
    var inputModuleName = document.getElementById("moduleNameInput");
    var btnLoadModule = document.getElementById("btnLoadModule");
    var inputGroups = document.getElementsByClassName("inputGroup");
    var searchInputGroup = document.getElementById("searchForm");
    var moduleInputGroup = document.getElementById("loadModules");
    var btnRecToJson = document.getElementById("btnRecToJson");
    var helpTextSpan = document.getElementById("helpText");
    var autoCompleteResults = document.getElementById("autocomplete_result_module");

    var inputBoxValue = "";
    var whichInputBox = "";
    var whichInputGroup = "";
    var defaultAccName = 'tstdrv1155888';
    var moduleLoadDisabled = false;

    setAutocomplete();
    setAnimation();
    setInputListeners();
    setSuiteAnswerSearch();
    setupOtherInstanceBtns();

    function setAutocomplete() {
        $(function () {
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

            myAutocomplete(inputModuleName, autoCompleteResults, availableModules);
        });
    }


    function disableModuleInput() {
        inputModuleName.disabled = true;
        inputModuleName.placeholder = "Modules Disabled!";
        btnLoadModule.addEventListener('click', doNothingOnClick);
        moduleLoadDisabled = true;
    }

    function disableRecToJSON() {
        btnRecToJson.disabled = true;
        btnRecToJson.innerHTML = "RecToJSON Disabled";
    }

    function setAnimation() {
        /**============================Search and load module animation fix=========================== */
        inputGroups = [searchInputGroup, moduleInputGroup];
        inputGroups.forEach(eachIG => {
            eachIG.addEventListener("mouseleave", e => {
                // console.log("which box : " + whichInputGroup);
                //console.log("Value : " + inputBoxValue);
                switch (eachIG.id) {
                    case "searchForm":
                        if (inputBoxValue && whichInputGroup == "searchForm")
                            searchInputGroup.classList.add("searchInputGroupOpened");
                        else {
                            searchInputGroup.classList.remove("searchInputGroupOpened");
                        }
                        break;
                    case "loadModules":
                        if (inputBoxValue && whichInputGroup == 'loadModules')
                            moduleInputGroup.classList.add("moduleInputGroupOpened");
                        else {
                            moduleInputGroup.classList.remove("moduleInputGroupOpened");
                            autoCompleteResults.style.visibility = "hidden";
                            // $("#moduleNameInput").autocomplete("close");
                        }
                        break;
                }

                if (!inputBoxValue)
                    eachIG.style.zIndex = "0";

                helpTextSpan.style.visibility = 'hidden';
            });
            eachIG.addEventListener("mouseenter", e => {
                var helpText;
                var caller = e.target || e.srcElement;
                eachIG.style.zIndex = "1";

                whichInputGroup = caller.id;
                if (whichInputGroup == searchInputGroup.id) {
                    helpText = "Search On SuiteAnwers directly from here.\n| Shortcut > Ctrl + Shift + s|";
                    moduleInputGroup.style.zIndex = 0;
                    inputModuleName.value = "";
                    if (inputSearch.value === "") {
                        inputBoxValue = "";
                    }
                }
                if (whichInputGroup == moduleInputGroup.id) {
                    helpText = "Load client-side modules to be used in the console of browser.\n| Shortcut > Ctrl + m |";
                    searchInputGroup.style.zIndex = 0;
                    inputSearch.value = "";
                    if (inputModuleName.value === "") {
                        inputBoxValue = "";
                    }
                }
                helpTextSpan.innerText = helpText;
                if (inputModuleName.value == "")
                    helpTextSpan.style.visibility = 'visible';

                // console.log("Enter which box : " + whichInputGroup);
                //console.log("Value : " + inputBoxValue);
            });
        });
        /**================================== Animation Fix ENDS =============================================== */
    }


    function setSuiteAnswerSearch() {
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
    }


    function setInputListeners() {
        /*==============================Input Listener===================================== */
        inputSearch.addEventListener('input', inputChanged);
        inputModuleName.addEventListener('input', inputChanged);


        function inputChanged(e) {
            var caller = e.target || e.srcElement;
            inputBoxValue = caller.value;
            //console.log("inpBxVal : "+inputBoxValue);
            whichInputBox = caller.id;

            if (inputBoxValue) {
                //console.log("Caller Has Value");
                switch (caller.parentElement.id) {
                    case "searchForm":
                        searchInputGroup.classList.add("searchInputGroupOpened");
                        moduleInputGroup.style.zIndex = 0;
                        searchInputGroup.style.zIndex = 1;
                        break;
                    case "loadModules":
                        moduleInputGroup.classList.add("moduleInputGroupOpened");
                        searchInputGroup.style.zIndex = 0;
                        moduleInputGroup.style.zIndex = 1;
                        autoCompleteResults.style.visibility = "visible";
                        break;
                }

            } else {
                switch (caller.parentElement.id) {
                    case "searchForm":
                        searchInputGroup.classList.remove("searchInputGroupOpened");
                        break;
                    case "loadModules":
                        moduleInputGroup.classList.remove("moduleInputGroupOpened");
                        if (!(moduleInputGroup.matches(':hover')))
                            autoCompleteResults.style.visibility = "hidden";
                        //   $("#moduleNameInput").autocomplete("close");
                        break;
                }
            }
        }
        /*======================================Input Listener Ends============================ */
    }


    function setButtonsLogic() {
        console.log("setButtonsLogic");
        /*========================All Button Logic================= */
        var getAllNetsuiteTabsQuery = {
            'url': "https://*.app.netsuite.com/*"
        };
        chrome.tabs.query(getAllNetsuiteTabsQuery, function (allNetsuiteTabs) {
            // console.log("Query for all NS tabs fired");

            if (allNetsuiteTabs.length == 0) { //if no netsuite tab is open
                // console.log("no netsuite tab open");
                disableModuleInput();
                disableRecToJSON();


            } else { //netsuite tab is open


                // console.log("Netsuite tab open");
                var getCurrentTabQuery = {
                    currentWindow: true,
                    active: true
                };
                chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
                    // console.log("Active tab query fired");
                    if (currentWindowTabs.length != 0) { //current window is present
                        //console.log("Current tabis present");
                        var currTab = currentWindowTabs[0];
                        var tabUrl = currTab.url;
                        if (tabUrl.includes("app.netsuite.com")) {
                            //console.log("tab includes ns url");
                            inputModuleName.style.display = "block";
                            inputModuleName.placeholder = "LoadModule > Ctrl + M";
                        } else {
                            //console.log("tab doesnt include ns url");
                            disableModuleInput();
                            disableRecToJSON();
                        }
                    } else {
                        //console.log("No current window present");
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
                    //console.log("id: " + btnId + "Class = " + classNameBtn);
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
                            if (defaultAccName === "tstdrv1155888") {
                                finalLink[btnId] = "https://system.netsuite.com/pages/customerlogin.jsp";
                            } else
                                finalLink[btnId] = "" + scheme + accName + location;
                        } else {
                            //if no netsuite tab is open
                            if (defaultAccName === "tstdrv1155888") {
                                finalLink[btnId] = "https://system.netsuite.com/pages/customerlogin.jsp";
                            } else
                                finalLink[btnId] = "" + scheme + defaultAccName + location;
                        }

                    } else { //for those with full link
                        finalLink[btnId] = btn.value;

                    }
                    if (btn.id == "btnMultiInstances") {
                        btn.addEventListener("click", multiInstClick);
                    } else if (btn.id == 'btnRecToJson') {
                        btnRecToJson.addEventListener('click', convtRecToJson);
                    } else if (btn.id == 'returnToPrimary') {
                        btn.addEventListener("click", secondaryBackClick);
                    } else {

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
                                    if (tabUrl.trim() === "chrome://newtab/" || tabUrl.trim() === "https://web.tabliss.io/") {
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

                            window.close();
                        };
                    }
                })();
            }
        });
        /*==============All button logic Ends=========================== */
        console.log("setButtonsLogic ends");

    }


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
            // console.log("message recieved from bg" + msg.replyFromBG);
        });
    }


    /*============================== LOAD MODULES Function ================================ */
    inputModuleName.addEventListener('keydown', (e) => {
        // console.log("e.key" + e.key);
        if (e.key === "Enter") {
            inputModuleName.value = autoCompleteResults.children.item(count).innerText;
            loadModule();
        } else if (e.key === "Tab") {
            //console.log("tab pressed");
            e.preventDefault();
        } else if (inputModuleName.value != "") {
            helpTextSpan.style.visibility = 'hidden';
        }
    });
    if (!moduleLoadDisabled) {
        btnLoadModule.addEventListener('click', loadModule);
    }

    function loadModule() {
        //console.log("Module load disable = ");
        var moduleName = inputModuleName.value.trim();
        if (moduleName != "" || moduleName != void 0 || moduleName != null) {
            if (moduleName.startsWith("N/") || moduleName.startsWith("SuiteScripts/")) {
                //console.log("Module Name : " + moduleName);
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
                    // console.log("message recieved from bg" + msg.replyFromBG);
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






    /*================================Multi Instance Loader=================== */
    function setupOtherInstanceBtns() {
        console.log("setupOtherInstanceBtns");
        chrome.storage.local.get("allInstancesData", function (items) {
            // console.log("Got from memory : " + JSON.stringify(items));
            if (jQuery.isEmptyObject(items))
                // console.log("Data enmpty");
            ;
            else {
                var allInstanceData = items.allInstancesData;
                for (var eachInstKey in allInstanceData) {
                    var eachInstData = allInstanceData[eachInstKey];
                    var compNInst = eachInstData.company_and_instance;
                    var instanceId = eachInstData.idFull;
                    var instUsrName = eachInstData.instanceUserName;
                    var instURL = eachInstData.url;
                    var instType = eachInstData.instanceType;
                    //console.log("Data Read : " + JSON.stringify(eachInstData));
                    if (instType !== "" || instType !== undefined || instType !== null)
                        instType = " | " + instType.toUpperCase();
                    var eachBtnStr = `<button id="btn${instanceId}" class="hasFullValue instanceLink" value="${instURL}">${compNInst}${instType} </br> ${instUsrName}</button>`;
                    $("#instancesDiv").append(eachBtnStr);
                    defaultAccName = instanceId;
                }
            }
            console.log("Acc : " + defaultAccName);
            setButtonsLogic();
        });
        console.log("setupOtherInstanceBtns ends");
    }

    function multiInstClick() {
        $("#primary")[0].style.transform = "translateX(100vw)";
        $("#primary")[0].style.opacity = 0;
        $("#secondary")[0].style.transform = "translateX(100vw)";
        $("#secondary")[0].style.opacity = 1;
    }

    function secondaryBackClick() {
        $("#secondary")[0].style.transform = "";
        $("#secondary")[0].style.opacity = "";
        $("#primary")[0].style.transform = "";
        $("#primary")[0].style.opacity = "";
    }
    /*=====================Multi Instance Loader Ends=============== */

});