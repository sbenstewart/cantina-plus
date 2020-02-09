var RedirectPath = {

    init: function ()
    {
        this.tabs = {};
        var REQUEST_FILTER = {'urls': ['<all_urls>'], 'types': ['main_frame']};
        var EXTRA_INFO = ['responseHeaders'];

        chrome.webRequest.onBeforeRedirect.addListener(this.requestRedirect, REQUEST_FILTER, EXTRA_INFO);
        chrome.webRequest.onCompleted.addListener(this.requestCompleted, REQUEST_FILTER, EXTRA_INFO);
        chrome.webNavigation.onCommitted.addListener(this.navigationCommited);
        chrome.runtime.onMessage.addListener(this.recordClientDetails);

        chrome.tabs.onRemoved.addListener(this.tabRemoved);


        this.warningColorMap = {
            error: '#e22b2b',
            warning: '#e58d1c',
            info: '#214a65',
            ok: '#5d945a'
        };

        chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
            sendResponse({'response': 'whats up'});
        });

        this.versionCheck();
    },
    callback: function() {
        if (chrome.runtime.lastError) {
            console.error("We have an error", chrome.runtime.lastError);
        }
    },
    checkTabIDIsValid: function(tabId, methodName, callbackDone)
    {
        chrome.browserAction[methodName]({tabId: tabId}, function()
        {
            if(callbackDone)
                callbackDone(!chrome.runtime.lastError);
        });
    },
    requestRedirect: function (details)
    {
        RedirectPath.recordPathItem(details.tabId, {
            type: 'server_redirect',
            redirect_type: details.statusCode,
            status_code: details.statusCode,
            url: details.url,
            redirect_url: details.redirectUrl,
            ip: (details.ip) ? details.ip : '(not available)',
            headers: details.responseHeaders,
            status_line: details.statusLine
        });
    },
    requestCompleted: function (details)
    {
        RedirectPath.setServerRequestByUrl(details.tabId, details);

        RedirectPath.onServerClientPathSync(details.tabId, details.url)
    },
    navigationCommited: function (details)
    {
        if (details.transitionType != 'auto_subframe')
        {
            RedirectPath.setClientRequestByUrl(details.tabId, details);

            RedirectPath.onServerClientPathSync(details.tabId, details.url);
        }
    },
    recordClientDetails: function (request, sender)
    {

        var tabId = sender.tab.id;
        var tab = RedirectPath.getTab(tabId);

        if (request.userClicked)
        {
            console.log('USER CLICKED A THING');
            tab.userClicked = true;
        }
        else if (request.metaRefreshDetails)
        {
            tab.meta[sender.tab.url] = request.metaRefreshDetails;
        }

        RedirectPath.setTab(tabId, tab);
    },
    getStatusObject : function(pathItem)
    {
        var statusCode = pathItem.status_code;
        var redirectType = pathItem.type;

        var statusMap = {
            '400_javascript':   { classes: ['statusError', 'iconRedirect', 'clientRedirect'],   level: 'error',     priority: 13 },
            '400_meta':         { classes: ['statusError', 'iconRedirect', 'clientRedirect'],   level: 'error',     priority: 12 },
            '400':              { classes: ['statusError', 'iconWarning'],                      level: 'error',     priority: 11 },
            '500':              { classes: ['statusError', 'iconWarning'],                      level: 'error',     priority: 10 },
            '500_javascript':   { classes: ['statusWarning', 'iconRedirect', 'clientRedirect'], level: 'warning',   priority: 9 },
            '500_meta':         { classes: ['statusWarning', 'iconRedirect', 'clientRedirect'], level: 'warning',   priority: 8 },
            '503':              { classes: ['statusWarning', 'iconWarning'],                    level: 'warning',   priority: 7 },
            '302':              { classes: ['statusWarning', 'iconRedirect'],                   level: 'warning',   priority: 6 },
            '300':              { classes: ['statusWarning', 'iconRedirect'],                   level: 'warning',   priority: 5 },
            '200_javascript':   { classes: ['statusInfo', 'iconRedirect', 'clientRedirect'],    level: 'info',      priority: 4 },
            '200_meta':         { classes: ['statusInfo', 'iconRedirect', 'clientRedirect'],    level: 'info',      priority: 3 },
            '301':              { classes: ['statusInfo', 'iconRedirect'],                      level: 'info',      priority: 2 },
            '200':              { classes: ['statusOk', 'iconOk'],                              level: 'ok',        priority: 1 }
        }

        var statusCodeLookup = statusCode.toString();

        if (redirectType == 'client_redirect')
        {
            statusCodeLookup = statusCodeLookup + '_' + pathItem.redirect_type;
        }

        if (!statusMap[statusCodeLookup])
        {   
            statusCodeLookup = (Math.floor(statusCode / 100) * 100).toString();

            if (redirectType == 'client_redirect')
            {
                statusCodeLookup = statusCodeLookup + '_' + pathItem.redirect_type;
            }
        }

        if (!statusMap[statusCodeLookup] && redirectType == 'client_redirect')
        {
            statusCodeLookup = (Math.floor(statusCode / 100) * 100).toString();
        }

        return statusMap[statusCodeLookup] || null;
    },
    onServerClientPathSync: function (tabId, url)
    {

        var currentClientRequestDetails = this.getClientRequestByUrl(tabId, url);
        var currentServerRequestDetails = this.getServerRequestByUrl(tabId, url);

        if (currentClientRequestDetails && currentServerRequestDetails)
        {
            var pathItem = {
                type: 'normal',
                redirect_type: 'none',
                status_code: currentServerRequestDetails.statusCode,
                url: currentServerRequestDetails.url,
                ip: (currentServerRequestDetails.ip) ? currentServerRequestDetails.ip : '(not available)',
                headers: currentServerRequestDetails.responseHeaders,
                status_line: currentServerRequestDetails.statusLine
            };

            var tab = this.getTab(tabId);

            if (currentClientRequestDetails.transitionQualifiers.indexOf('forward_back') !== -1)
            {
                tab.userClicked = true;
            }

            if (currentClientRequestDetails.transitionQualifiers.indexOf('client_redirect') !== -1 && tab.userClicked !== true)
            {
                tab = this.setClientRedirectData(tab, currentClientRequestDetails);
            }
            else if (tab.previousClientRequest !== null)
            {

                var indexToRemove = tab.path.map(function (el)
                {
                    return el.url;
                }).indexOf(tab.previousClientRequest.url);

                console.log('Removing up to and including previous client request.', tab.previousClientRequest);

                tab.path.splice(0, (indexToRemove + 1));
            }

            tab.userClicked = false;

            tab.serverClientSyncPath = {
                client: {},
                server: {}
            };

            this.recordPathItem(tabId, pathItem);


            tab.previousClientRequest = currentClientRequestDetails;

            this.setTab(tabId, tab);
        }
    },
    setClientRedirectData: function (tab, currentClientRequestDetails)
    {
        if (tab.previousClientRequest)
        {
            var indexToModify = tab.path.map(function (el, idx)
            {

                return el.url;
            }).lastIndexOf(tab.previousClientRequest.url);


            var pathItemToModify = tab.path[indexToModify];

            pathItemToModify.type = 'client_redirect';
            pathItemToModify.redirect_type = 'javascript';

            pathItemToModify.redirect_url = currentClientRequestDetails.url;

            if (tab.path[(indexToModify + 1)])
            {
                pathItemToModify.redirect_url = tab.path[(indexToModify + 1)].url;
            }

            if (typeof(tab.meta[tab.previousClientRequest.url]) !== 'undefined')
            {
                var metaInformation = tab.meta[tab.previousClientRequest.url];

                pathItemToModify.redirect_type = 'meta'
                pathItemToModify.redirect_url = metaInformation.url;
                pathItemToModify.meta_timer = metaInformation.timer;
            }

            tab.path[indexToModify] = pathItemToModify;
        }

        return tab;
    },
    getClientRequestByUrl: function (tabId, url)
    {
        var tab = this.getTab(tabId);

        return tab.serverClientSyncPath.client[url] || null;
    },
    getServerRequestByUrl: function (tabId, url)
    {
        var tab = this.getTab(tabId);

        return tab.serverClientSyncPath.server[url] || null;
    },
    setClientRequestByUrl: function (tabId, request)
    {
        var tab = this.getTab(tabId);

        tab.serverClientSyncPath.client[request.url] = request;

        this.setTab(tabId, tab);
    },
    setServerRequestByUrl: function (tabId, request)
    {
        var tab = this.getTab(tabId);

        tab.serverClientSyncPath.server[request.url] = request;

        this.setTab(tabId, tab);
    },
    recordPathItem: function (tabId, pathItem)
    {

        if (tabId > 0)
        {
            var tab = this.getTab(tabId);

            tab.lastactive = new Date().getTime();

            pathItem.redirect_url = pathItem.redirect_url || null;
            pathItem.meta_timer = pathItem.meta_timer || null;

            tab.path.push(pathItem);

            if (tab.path.length > 20)
            {
                var step = tab.path.shift();

                console.log(tabId, 'Path was too long - removed the first step on the path', step);
            }

            var highestPriorityPathItem = {};
            var highestPriorityStatus = 0;

            var self = this;
            tab.path.forEach(function (pathItem, index)
            {

                pathItem.statusObject = self.getStatusObject(pathItem);
                tab.path[index] = pathItem;

                if (pathItem.statusObject.priority > highestPriorityStatus)
                {
                    highestPriorityStatus = pathItem.statusObject.priority;
                    highestPriorityPathItem = pathItem;
                }
            });

            this.setBadge(tabId, highestPriorityPathItem, tab.path.length);
            this.setTab(tabId, tab);

            if (this.rand(1, 100) <= 30)
            {
                console.log('RANDOM GC STARTED');
                this.garbageCollect();
            }

            return;
        }
    },
    setBadge : function(tabId, pathItem, pathItemCount)
    {
        chrome.browserAction.setIcon({path: "assets/images/rpath19.png", tabId: tabId}, this.callback);

        if (parseInt(pathItem.status_code) >= 300 || pathItem.type == 'client_redirect')
        {
            var badgeText = pathItem.status_code.toString();

            var badgeColour = this.warningColorMap[pathItem.statusObject.level];

            if (pathItem.type == 'client_redirect')
            {
                badgeText = (pathItem.redirect_type == 'javascript') ? 'JS' : 'Meta';
            }

            
            this.checkTabIDIsValid(tabId, 'getBadgeText', function(res){
                if (res) {
                    chrome.browserAction.setBadgeText({text: badgeText, tabId: tabId});
                }
            });

            this.checkTabIDIsValid(tabId, 'getBadgeBackgroundColor', function(res){
                if (res) {
                    chrome.browserAction.setBadgeBackgroundColor({color: badgeColour, tabId: tabId});
                }
            });
        }
    },
    tabRemoved: function (tabId, removeInfo)
    {
        console.log('Tab ' + tabId + ' is being removed');

        if (typeof(RedirectPath.tabs[tabId]) != 'undefined')
        {
            console.log('We had data for ' + tabId + ', freeing now', RedirectPath.tabs);

            delete RedirectPath.tabs[tabId];
        }
        else
        {
            console.log('We had no data for tab ' + tabId, RedirectPath.tabs);
        }

        RedirectPath.garbageCollect();
    },
    garbageCollect: function ()
    {
        chrome.windows.getAll({populate: true}, function (windows)
        {
            var visibleTabs = [];

            for (var i = 0; i < windows.length; i++)
            {
                var windowscan = windows[i];

                for (var ii = 0; ii < windowscan.tabs.length; ii++)
                {
                    var tab = windowscan.tabs[ii];
                    visibleTabs.push(tab.id.toString());
                }
            }

            var stamp = new Date().getTime();

            for (var tabId in this.tabs)
            {
                var age = (stamp - this.tabs[tabId].lastactive);

                if (visibleTabs.indexOf(tabId) == -1 && age > 30000) // 30 seconds
                {
                    delete this.tabs[tabId];

                    console.log('GC: tab ' + tabId + ' wasnt visible and is stale, so was freed', this.tabs);
                }

            }
        });
    },
    getTab: function (tabId)
    {
        if (typeof(this.tabs[tabId]) != 'undefined')
        {
            return this.tabs[tabId];
        }

        return {
            path: [],
            meta: {},
            serverClientSyncPath: {
                client: {},
                server: {}
            },
            previousClientRequest: null
        };
    },
    setTab: function (tabId, tab)
    {
        this.tabs[tabId] = tab;
    },
    rand: function (min, max)
    {
        return Math.random() * (max - min) + min;
    },
    onInstall: function ()
    {
        //console.log("Extension Installed");
    },
    onUpdate: function ()
    {
        //console.log("Extension Updated");
    },
    getVersion: function ()
    {
        return chrome.runtime.getManifest().version;
    },
    versionCheck: function ()
    {
        var currVersion = this.getVersion();
        var prevVersion = localStorage['version'];

        if (currVersion != prevVersion)
        {
            if (typeof prevVersion == 'undefined')
            {
                this.onInstall();
            }
            else
            {
                this.onUpdate();
            }

            localStorage['version'] = currVersion;
        }

        console.log('Current version is: ' + localStorage['version']);
    },
    outputDebugPath: function (tabId)
    {
        var path = this.getTab(tabId).path;
        var debugPath = [];

        path.forEach(function (pathItem)
        {
            debugPath.push({
                url: pathItem.url,
                status: pathItem.status_line,
                redirect_type: pathItem.redirect_type,
                redirect_url: pathItem.redirect_url,
                meta_timer: pathItem.meta_timer
            });
        });

        console.table(debugPath);
    }
};

RedirectPath.init();
