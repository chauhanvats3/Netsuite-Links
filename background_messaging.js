chrome.extension.onConnect.addListener(function (port) { //Listen to any incoming messages
    port.onMessage.addListener(function (msg) {
        var msgType = msg.type;
        switch (msgType) {
            case 'loadModule':
                var msgRcvd = msg.codeToInject;
                var splittedArr = msgRcvd.split(",");
                var modVarName = splittedArr[0];
                var modName = splittedArr[1];
                //Define a string to tell chrome api to inject a piece of code
                var codeBGtoPage = "(function() {";
                //Overriding window.onError
                codeBGtoPage += "var codeToExecute ='window.onerror = function (msg, url, line, col, error) { alert(error.message); var extra = !col ? \"\" : \"\\\ncolumn: \" + col; extra += !error ? \"\" : \"\\\nerror: \" + error;console.log(\"Error: \" + msg + \"\\\nurl: \" + url + \"\\\n line: \" + line + extra); var suppressErrorAlert = true;return suppressErrorAlert;};'";
                //using require()
                codeBGtoPage += ";codeToExecute+= ';require([\"" + modName + "\"],function(){window[\"" + modVarName + "\"] = require(\"" + modName + "\"); console.log(\" Loaded : "+modName+"  \");alert(\"Module : " + modName + "\\\\nVariableName : " + modVarName + "\\\\nUse in Console!\");  });';";
                //creating a <script> tag to insert script
                codeBGtoPage += ";var script = document.createElement('script');"; //So ,we had to do all this charade because sending require directly wouldn't work
                codeBGtoPage += "script.textContent = codeToExecute;";
                codeBGtoPage += "document.body.appendChild(script);";
                codeBGtoPage += "})();";

                //sending this code tp page for injection
                chrome.tabs.executeScript({
                    code: codeBGtoPage
                });
                port.postMessage({
                    replyFromBG: "Executed load module"
                });
                break;
            case 'recToJson':
                   
                    //sending this code tp page for injection
                    chrome.tabs.executeScript({
                        file: "recToJson.js"
                    }, function(results){ console.log(results); } );
                    port.postMessage({
                        replyFromBG: "Executed Rectojson"
                    });
                break;
        }
    });
});

/*  Nothing special going on here, we tell chrome.tabs.executeScript to execute the code given inside string to be executed in the page.
    that function inside the string creates a <script> tag and append it to the <body> tag
    as soon as the script tag gets inserted, it starts executing in the web page's context.
    We couldn't do it the normal way because I guess require() exists only for the web page and not for the chrome
*/
/*Structure : 
            1. " aka doubleQuotes to enclose string to be inserted in codeBGtoPage
            2. ' aka singleQuote to enclose strings that are to be inserted in codeToExecute
            3. \"  aka escape doubleQuote to enclose strings as strings and NOT code in codeToExecute
             */