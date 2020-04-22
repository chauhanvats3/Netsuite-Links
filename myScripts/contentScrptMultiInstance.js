var date = new Date();
var time = "" + date.getMinutes() + " : " + date.getSeconds();
console.log("contentScriptMultiInstance Running => "+time);
var childScr1 = document.createElement('script');
childScr1.src = "https://code.jquery.com/jquery-3.5.0.min.js";

var childScr2 = document.createElement('script');
childScr2.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
document.querySelector('body').appendChild(childScr1);

var noConflictScr = document.createElement('script');
noConflictScr.innerHTML = "var jjj = jQuery.noConflict();";
document.querySelector('body').appendChild(noConflictScr);

$(document).ready(function ($) {


    document.querySelector('body').appendChild(childScr2);

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

    var pageURL = $(location)[0].href;
    if (pageURL.includes(".app.netsuite.com")) {
        var instanceId = pageURL.split(".app.")[0].split("://")[1];

        chrome.storage.local.get("allInstancesData", function (items) {
            //console.log("Got from memory : " + JSON.stringify(items));
            if (jQuery.isEmptyObject(items))
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
            const multiInstanceDataObject = {};
            window['tempAllInstancesData'] = JSON.parse('${allInstancesDataToDump}');  
            deepFreeze(tempAllInstancesData);
              const allInstancesData=tempAllInstancesData;`;
            document.querySelector('body').appendChild(instanceDataDumpScript);

        });
    }
});

function saveThisInstanceData(allInstancesData, instanceIdFull) {
    var companyNinstance = jQuery(".ns-role-company")[0].innerHTML;
    var instUsrName = jQuery(".ns-role > span")[0].innerHTML;
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