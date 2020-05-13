var areShortcutsReady = false;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text == "shortcuts-ready") {
        areShortcutsReady = true;
    }
    sendResponse("Shortcuts Are Ready!");
});

chrome.commands.onCommand.addListener(function (command) {
    //console.log('Command:', command);
    try {
        var getCurrentTabQuery = {
            currentWindow: true,
            active: true
        };
        chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
            // console.log("Active tab query fired");
            if (currentWindowTabs.length != 0) { //current window is present
                //   console.log("Current tabis present");
                var currTab = currentWindowTabs[0];
                var tabUrl = currTab.url;
                if (tabUrl.includes("app.netsuite.com")) {

                    if (tabUrl.includes("reportrunner.nl") || tabUrl.includes("scriptlet.nl")) {

                        alert("Does't Work on This Page, Please Use Extension!");
                        return;
                    }

                    if (!areShortcutsReady) {
                        return alert("Please wait for page to load completely before using shortcuts!");
                    }

                    chrome.tabs.executeScript({
                        file: "myScripts/injectMyAutoComplete.js"
                    }, function (results) {
                        //           console.log(results);
                    });

                    //     console.log("tab includes ns url");
                    if (command === "search-suite-answers-shrtct") {

                        /* ===========JavaScript Insertion============ */
                        chrome.tabs.executeScript({
                            file: "shortcuts/shrtct_suiteAnswer.js"
                        }, function (results) {
                            //           console.log(results);
                        });
                    } else if (command === "load-module-shrtct") {

                        /* ===========JavaScript Insertion============ */
                        chrome.tabs.executeScript({
                            file: "shortcuts/shrtct_moduleLoad.js"
                        }, function (results) {
                            console.log(results);
                        });

                    } else if (command === "multi-instance-shrtct") {

                        /* ===========JavaScript Insertion============ */
                        chrome.tabs.executeScript({
                            file: "shortcuts/shrtct_multi_instances.js"
                        }, function (results) {
                            //       console.log(results);
                        });
                    }
                } else {
                    //console.log("tab doesnt include ns url");
                    alert("Please Use Extension, Shortcuts Don't Function Outside Netsuite Pages!");
                }
            } else {
                //console.log("No current window present");
            }

        });
    } catch (e) {
        console.error("Can't Perform Action Here!");
    }
    //console.log("Opening shortcut page for module load");
});