if (document.readyState === 'ready' || document.readyState === 'complete') {
    sendShortcutReadyMessage();
} else {
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            pageFullyLoaded();
        }
    };
}

function sendShortcutReadyMessage() {
    chrome.runtime.sendMessage({
        text: "shortcuts-ready"
    }, function (response) {
        console.log("Response: ", response);
    });
}



function saveThisInstanceData(allInstancesData, instanceIdFull) {
    var companyNinstance = document.getElementsByClassName('ns-role')[0].children[1].children[0].innerHTML;
    var instUsrName = document.getElementsByClassName('ns-role')[0].children[0].innerHTML;
    var instURL = "https://" + instanceIdFull + ".app.netsuite.com/app/center/card.nl";

    var instType = instanceIdFull.split("-");
    if (instType[1] === undefined)
        instType = "";
    else
        instType = instType[1];

    //console.log("Inst Type Wrote: " + instType);
    allInstancesData[instanceIdFull] = {};
    allInstancesData[instanceIdFull] = {
        idFull: instanceIdFull,
        company_and_instance: companyNinstance,
        instanceUserName: instUsrName,
        url: instURL,
        instanceType: instType
    };
    chrome.storage.local.set({
        "allInstancesData": allInstancesData
    }, function () {
        //console.log("Saved To Memory : " + JSON.stringify(allInstancesData));
    });
}

function pageFullyLoaded() {

    var deepFreezeScript = document.createElement('script');
    deepFreezeScript.innerHTML = `
        const deepFreeze = o => {
            for (let [key, value] of Object.entries(o)) {
                if (o.hasOwnProperty(key) && typeof value == "object") {
                    deepFreeze(value);
                }
            }
            Object.freeze(o);
            return o;
        };`;
    deepFreezeScript.id = "deepFreezeScript";
    document.querySelector('body').appendChild(deepFreezeScript);

    var pageURL = document.location.href;
    if (pageURL.includes(".app.netsuite.com")) {
        var instanceId = pageURL.split(".app.")[0].split("://")[1];

        chrome.storage.local.get("allInstancesData", function (items) {
            //console.log("Got from memory : " + JSON.stringify(items));
            var dataGotIsEmpty = Object.keys(items).length === 0 && items.constructor === Object;
            console.log(dataGotIsEmpty);
            if (dataGotIsEmpty)
                saveThisInstanceData(items, instanceId);
            else {
                if (!items.allInstancesData.hasOwnProperty(instanceId))
                    saveThisInstanceData(items.allInstancesData, instanceId);
                else
                    // console.log("This account data already exists");
                ;
            }
            var allInstancesDataToDump = JSON.stringify(items.allInstancesData);
            var instanceDataDumpScript = document.createElement("script");
            instanceDataDumpScript.innerHTML = `
            var justLoadedPage = {
                'multiInstanceOverlayVTSInput': true,
                'moduleLoadOverlayVTSInput': true
            };
            
                const multiInstanceDataObject = {};
                if(!${dataGotIsEmpty})
                    window['tempAllInstancesData'] = JSON.parse('${allInstancesDataToDump}');  
                else    
                    window['tempAllInstancesData'] = {};  

                    deepFreeze(tempAllInstancesData);
                    const allInstancesData=tempAllInstancesData;
                
                `;
            document.querySelector('body').appendChild(instanceDataDumpScript);
            sendShortcutReadyMessage();
        });
    }

}