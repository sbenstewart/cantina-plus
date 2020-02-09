document.addEventListener("DOMContentLoaded", function(event) {

    chrome.runtime.sendMessage({DOMContentLoaded: true});

    var metaRefresh = document.querySelectorAll("meta[http-equiv='refresh']");
    if (metaRefresh.length)
    {
        
        var metaRefreshElement = metaRefresh.item(metaRefresh.length-1);
        var metaRefreshContent = metaRefreshElement.getAttribute('content');

        var metaRefresh = metaRefreshContent.split(/;\s?url\s?=\s?/i);
        var metaRefreshTimer = metaRefresh[0];
        var metaRefreshUrl = (typeof(metaRefresh[1]) != 'undefined') ? metaRefresh[1] : null;

        if (metaRefreshUrl)
        {
            chrome.runtime.sendMessage({metaRefreshDetails: {'url': qualifyURL(metaRefreshUrl), 'timer': metaRefreshTimer}});
        }

        function qualifyURL(url) {
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        }
    }

    document.documentElement.addEventListener('click', function () {
        chrome.runtime.sendMessage({ userClicked: true });
    });
});

