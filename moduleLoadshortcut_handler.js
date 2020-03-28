chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    if (command === "load-module-shrtct") {
        console.log("Opening shortcut page for module load");

        chrome.tabs.executeScript({
            file: "thirdParty/external/jquery/jquery.js"
        }, function (results) {
            console.log(results);
        });
        chrome.tabs.insertCSS({
            file: "thirdParty/jquery-ui.min.css"
        }, function (results) {
            console.log(results);
        });
        chrome.tabs.executeScript({
            file: "thirdParty/jquery-ui.min.js"
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

    }
});