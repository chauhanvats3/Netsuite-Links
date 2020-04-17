var inputSearchQuery;

function setupOverlay() {
    if (jQuery("#searchAnswerOverlayVTS")[0] == void 0) {

        jQuery("<div id='searchAnswerOverlayVTS' class='searchInputGroup'><input id='searchAnswerOverlayVTSInput' placeholder='Search SuiteAnswers' class='searchInputText'></div>").appendTo("body");

        jQuery("#searchAnswerOverlayVTS").click(function (e) {
            //console.log("Outside Input box clicked");
            searchOverlayVTSOff();
        });
        jQuery("#searchAnswerOverlayVTSInput").click(function (e) {
            e.stopPropagation();
            //console.log("Input box clicked");
        });

        inputSearchQuery = document.getElementById("searchAnswerOverlayVTSInput");
        inputSearchQuery.addEventListener('keydown', (e) => {
            //console.log("e.key" + e.key);
            if (e.key === "Enter") {
                searchAnswers();
            } else if (e.key === "Tab") {
                //console.log("tab pressed");
                e.preventDefault();
            }
        });

    }
}

function init_suiteAnswerOverlay() {

    setupOverlay();
    if (jQuery("#moduleLoadOverlayVTS")[0] != void 0) {
        moduleOverlayVTSOff();
    }
    searchOverlayVTSOn();
}

function searchOverlayVTSOn() {

    document.getElementById("searchAnswerOverlayVTS").style.display = "block";
    inputSearchQuery.value = "";
    inputSearchQuery.focus();

}

function searchOverlayVTSOff() {
    document.getElementById("searchAnswerOverlayVTS").style.display = "none";
}

function searchAnswers() {
    var searchQuery = inputSearchQuery.value;
    if (searchQuery != void 0 || searchQuery != null) {
        var ansLink = "https://netsuite.custhelp.com/";

        if (searchQuery.trim() != "") {
            searchQuery = searchQuery.replace(/ /g, "=");
            ansLink = "https://netsuite.custhelp.com/app/answers/list/st/5/kw/" + searchQuery;
        }

        window.open(ansLink, '_blank');
        searchOverlayVTSOff();
    }
}

init_suiteAnswerOverlay();