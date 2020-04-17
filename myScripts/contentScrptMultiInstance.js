var childScr1 = document.createElement('script');
childScr1.src = "https://code.jquery.com/jquery-3.5.0.min.js";

var childScr2 = document.createElement('script');
childScr2.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
document.querySelector('body').appendChild(childScr1);
$(document).ready(function ($) {

    document.querySelector('body').appendChild(childScr2);

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
        //console.log("Saved To Memory : " + JSON.stringify(allInstancesData));
    });
}