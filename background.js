chrome.browserAction.onClicked.addListener(function(tab) {
    if (tab.url.indexOf('chrome') < 0) {
        chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
            chrome.tabs.executeScript(null, { file: "jscolor.js" }, function() {
                chrome.tabs.executeScript(null, { file: "content_script.js" });
            });
        });

        chrome.tabs.insertCSS({file: "style.css"});
    } else {
        alert("Extensions cannot run in local chrome pages for security reasons");
    }
});