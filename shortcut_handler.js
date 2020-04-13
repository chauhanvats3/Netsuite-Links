chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    try {
        var getCurrentTabQuery = {
            currentWindow: true,
            active: true
        };
        chrome.tabs.query(getCurrentTabQuery, function (currentWindowTabs) {
            console.log("Active tab query fired");
            if (currentWindowTabs.length != 0) { //current window is present
                console.log("Current tabis present");
                var currTab = currentWindowTabs[0];
                var tabUrl = currTab.url;
                if (tabUrl.includes("app.netsuite.com")) {
                    console.log("tab includes ns url");

                    chrome.tabs.insertCSS({
                        file: "thirdParty/jquery-ui.min.css"
                    }, function (results) {
                        console.log(results);
                    });
                    chrome.tabs.insertCSS({
                        file: "thirdParty/jquery-ui.structure.min.css"
                    }, function (results) {
                        console.log(results);
                    });
                    chrome.tabs.insertCSS({
                        file: "thirdParty/jquery-ui.theme.min.css"
                    }, function (results) {
                        console.log(results);
                    });
                    if (command === "search-suite-answers-shrtct") {

                        /* ===========CSS Insertion============= */

                        chrome.tabs.insertCSS({
                            file: "shrtct_suiteAnswer.css"
                        }, function (results) {
                            console.log(results);
                        });

                        /* ===========JavaScript Insertion============ */
                        chrome.tabs.executeScript({
                            file: "shrtct_suiteAnswer.js"
                        }, function (results) {
                            console.log(results);
                        });
                    } else if (command === "load-module-shrtct") {
                        /* ===========CSS Insertion============= */

                        chrome.tabs.insertCSS({
                            file: "shrtct_moduleLoad.css"
                        }, function (results) {
                            console.log(results);
                        });

                        /* ===========JavaScript Insertion============ */
                        chrome.tabs.executeScript({
                            file: "shrtct_moduleLoad.js"
                        }, function (results) {
                            console.log(results);
                        });

                    }
                } else {
                    console.log("tab doesnt include ns url");
                    alert("Please Use Extension, Shortcuts Don't Function Outside Netsuite Pages!");
                }
            } else {
                console.log("No current window present");
            }

        });
    } catch (e) {
        console.error("Can't Perform Action Here!");
    }
    console.log("Opening shortcut page for module load");
});