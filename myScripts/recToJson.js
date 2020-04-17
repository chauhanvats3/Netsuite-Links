(function () {
    var codeToExecute = `function tryJson() {
        try {
            var recType = nlapiGetRecordType();
            if (recType != void 0 || recType != null) {
                alert("Converting to JSON, Please Wait And Make Sure Popup Blocker is disabled!");
                var recId = nlapiGetRecordId();
                var rec = nlapiLoadRecord(recType, recId);
                return {
                    status: true,
                    obj: rec
                };
    
            } else {
                return {
                    status: false
                };
            }
        } catch (e) {
            return {
                status: false
            };
        }
    }
    
    function tryXml(jsonTestRec) {
        var xmlRec = "";
        var curURL = window.location.href;
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/xmltojson@1.3.5/lib/xmlToJSON.min.js";
        document.body.appendChild(script);
    
        function makeHttpObject() {
            try {
                return new XMLHttpRequest();
            } catch (error) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (error) {}
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (error) {}
            throw new Error("Could not create HTTP request object.");
        }
        var request = makeHttpObject();
        request.open("GET", curURL + "&xml=t", true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var xmlRecTemp = request.responseText;
                xmlRec = xmlToJSON.parseString(xmlRecTemp);
                if (xmlRec.hasOwnProperty("nsResponse")) {
                    var JSONtoDisplay = {
                        "JSON": jsonTestRec.status ? jsonTestRec.obj.fields : {
                            "null": "null"
                        },
                        "XML": xmlRec.nsResponse[0].record[0]                   
                    };
                    var jsonPretty = JSON.stringify(JSONtoDisplay, null, "\t");
                    jsonPrettyOut = jsonPretty;
                    var x = window.open();
                    x.document.open();
                    x.document.write(\`<html><head><script>var jsonPretty2 = \` + jsonPretty + \`</script><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/summerstyle/jsonTreeViewer/libs/jsonTree/jsonTree.css"><head><body><script src="https://cdn.jsdelivr.net/gh/summerstyle/jsonTreeViewer/libs/jsonTree/jsonTree.js"></script><div id="container"></div><script> var wrapper = document.getElementById("container");var tree = jsonTree.create(jsonPretty2, wrapper);tree.expand();var allUl = document.getElementsByTagName("ul");for (var i = 0; i < allUl.length; i++) {var eachElm = allUl[i].setAttribute("style", "list-style-type: none");}</script></body></html>\`);
                    x.document.close();
                } else {
                    alert("Not a record Page");
                }
            }
        };
    }
    
    function init_recToJSON() {
        var jsonRec = tryJson();
        tryXml(jsonRec);
    }
    
    init_recToJSON();`;
    var script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    document.body.appendChild(script);
})();

