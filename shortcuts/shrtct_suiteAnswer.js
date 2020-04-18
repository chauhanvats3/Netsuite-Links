(function () {

    var codeToExecute;
    var script;
    var moduleOverlayScript = document.getElementById("suiteAnswerOverlayScript");
    if (typeof (moduleOverlayScript) != 'undefined' && moduleOverlayScript != null) {
        // Exists.
        codeToExecute = "searchOverlayVTSOn();";
        script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "suiteAnswerOverlayScriptDriver";
        document.body.appendChild(script);
    } else {

        codeToExecute = `
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
                  
                    searchOverlayVTSOn();
                }

                function searchOverlayVTSOn() {
                    if (jQuery("#moduleLoadOverlayVTS")[0] != void 0) {
                        moduleOverlayVTSOff();
                    }
                    if (jQuery("#multiInstanceOverlayVTS")[0] != void 0) {
                        multiInstanceOverlayVTSOff();
                    }
                    document.getElementById("searchAnswerOverlayVTS").style.display = "block";
                    inputSearchQuery.value = "";
                    inputSearchQuery.focus();

                }

                function searchOverlayVTSOff() {
                    document.getElementById("searchAnswerOverlayVTS").style.display = "none";
                }

                function searchAnswers() {
                    var searchQuery = inputSearchQuery.value;
                    if ( searchQuery != void 0 || searchQuery != null) {
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

 `;
         script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
        script.textContent = codeToExecute;
        script.id = "suiteAnswerOverlayScript";
        document.body.appendChild(script);
    }
})();