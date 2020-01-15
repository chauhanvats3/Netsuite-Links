(function () {
    var codeToExecute = 'try{var recType = nlapiGetRecordType();if(recType !=void 0 || recType!=null){alert(\"Converting to JSON, Please Wait And Make Sure Popup Blocker is disabled!\");var recId = nlapiGetRecordId();var rec = nlapiLoadRecord(recType,recId);var myJson = JSON.stringify(rec);var jsonObj = JSON.parse(myJson);var jsonPretty = JSON.stringify(jsonObj, null, \"\t\");var x = window.open();x.document.open();x.document.write(\"<html><head><script>var jsonPretty2 = \"+jsonPretty+\"</script><link rel=\\"stylesheet\\" href=\\"https://cdn.jsdelivr.net/gh/pgrabovets/json-view/src/jsonview.css\\"><head><body><script src=\\"https://cdn.jsdelivr.net/gh/pgrabovets/json-view/src/jsonview.js\\"></script><div class=\\"container\\"></div><script>jsonView.format(jsonPretty2,\\".container\\");</script></body></html>\");x.document.close();}/*else if(recType == undefined || recType == \"undefined\" || recType == null){alert(\"Not A record Page!\");}*/else{alert(\"Not A record Page!\");}}catch(e){alert(\"Not A Record Page\");}';
    //creating a <script> tag to insert script
    var script = document.createElement('script'); //So ,we had to do all this charade because sending require directly wouldn't work
    script.textContent = codeToExecute;
    document.body.appendChild(script);
})();

