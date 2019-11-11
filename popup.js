document.addEventListener('DOMContentLoaded', function () {
    var finalLink = {};

    function functSubmit(event) {
        var searchQuery = document.getElementById("input1").value;
        var ansLink = "";
        if (searchQuery.trim() != "")
            ansLink = "https://netsuite.custhelp.com/app/answers/list/st/5/kw/" + searchQuery;
        else
            ansLink = "https://netsuite.custhelp.com/"
        chrome.tabs.create({
            active: true,
            url: ansLink
        });
    }
    document.getElementById("searchForm").addEventListener('submit', functSubmit);
    document.getElementById("btnSearch").addEventListener('click', functSubmit);

    var queryInfo = {
        'url': "https://*.app.netsuite.com/*"
    };
    var defaultAccName = 'tstdrv2152924';

    //TODO: add button up listener on input field

    chrome.tabs.query(queryInfo, function (tabs) {
        console.log("Tabs : " + tabs);
        var tabsPresent = false;
        if (tabs == '' || tabs == void 0) {
            var halfButtons = document.getElementsByClassName("btn btn-primary hasHalfValue");
            for (var j = 0; j < halfButtons.length; j++) {
                (function () {
                    var btn = halfButtons[j];
                    btn.style.display = "none";
                })();
            }
            console.log("Tabs not Open");
        }
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {

            (function () {
                var btn = buttons[i];
                if (btn.style.display != "none") {
                    var classNameBtn = btn.className;
                    var isClassHalfValue = classNameBtn.includes("hasHalfValue");
                    var btnId = btn.id;
                    console.log("Class = " + classNameBtn);
                    if (isClassHalfValue) {
                        var url = tabs[0].url;
                        var urlWithoutScheme = url.slice(8);
                        var splittedUrlArr = urlWithoutScheme.split(".", 1);
                        var extractedAccName = splittedUrlArr[0];
                        var scheme = "https://";
                        var accName = extractedAccName ? extractedAccName : defaultAccName;
                        var location = btn.value;
                        // finalLink = "" + scheme + accName + location;
                        finalLink[btnId] = "" + scheme + accName + location;
                        console.log("Final Link Half Value : " + finalLink);
                    } else {
                        // finalLink = btn.value;
                        finalLink[btnId] = btn.value;
                        console.log("Final Link Full Value : " + finalLink);
                    }
                    btn.onclick = function () {
                        var urlLink = finalLink[this.id];
                        chrome.tabs.create({
                            active: true,
                            url: urlLink
                        });
                    };
                    console.log("Link added : " + finalLink + " On button : " + btn.id);

                }
            })();
        }
        var myButtons = document.getElementsByTagName("button");
        for (var k = 0; k < myButtons.length; k++) {
            var btn = myButtons[k];
            console.log("BTN id : " + btn.id + " onClick = " + btn.onclick);
        }

    });


});