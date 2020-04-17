$(document).ready(function ($) {
    var pageURL = $(location)[0].href;
    if (pageURL.includes(".app.netsuite.com")) {
        var instanceId = pageURL.split(".app.")[0].split("://")[1];

        chrome.storage.local.get("allInstancesData", function (items) {
            console.log("Got from memory : " + JSON.stringify(items));
            if (jQuery.isEmptyObject(items))
                saveThisInstanceData(items, instanceId);
            else {
                if (!items.allInstancesData.hasOwnProperty(instanceId))
                    saveThisInstanceData(items.allInstancesData, instanceId);
                else
                    console.log("This account data already exists");
                //;
            }
        });
    }
});

function saveThisInstanceData(allInstancesData, instanceId) {
    var companyNinstance = jQuery(".ns-role-company")[0].innerHTML;
    var instUsrName = jQuery(".ns-role > span")[0].innerHTML;
    var instURL = "https://" + instanceId + ".app.netsuite.com/app/center/card.nl";
    allInstancesData[instanceId] = {};
    allInstancesData[instanceId] = {
        id: instanceId,
        company_and_instance: companyNinstance,
        instanceUserName: instUsrName,
        url: instURL
    };
    chrome.storage.local.set({
        "allInstancesData": allInstancesData
    }, function () {
        console.log("Saved To Memory : " + JSON.stringify(allInstancesData));
    });
}