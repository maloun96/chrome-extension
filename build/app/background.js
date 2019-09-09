// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

var contextMenuItem = {
    "id": "addProduct",
    "title": "Add Product to Steelyard 111",
    "contexts": ["image", "link"]
};


chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(e) {

    chrome.tabs.query({},function(tabs) {
        if (e.mediaType === "image") {
            const image = encodeURI(e.srcUrl);
            for (var i = 0; i < tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, {"message": "clicked_event_action", "data": image});
            }
        }
    });
})
