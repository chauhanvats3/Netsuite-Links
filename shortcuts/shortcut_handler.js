var date = new Date();
var time = "" + date.getMinutes() + " : " + date.getSeconds();
console.log("shortcut handler running => "+time);
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
                            //         console.log(results);
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