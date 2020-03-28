chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    if (command === "load-module-shrtct") {

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
                    chrome.tabs.insertCSS({
                        file: "moduleLoadOverlay.css"
                    }, function (results) {
                        console.log(results);
                    });

                    chrome.tabs.executeScript({
                        file: "moduleLoad_shortcut.js"
                    }, function (results) {
                        console.log(results);
                    });


                } else {
                    console.log("tab doesnt include ns url");

                }
            } else {
                console.log("No current window present");

            }

        });
        console.log("Opening shortcut page for module load");



    }else if(command === "search-suite-answers-shrtct"){}
});