var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';
var recipes = [];

if(typeof localStorage.openOnSave == "undefined") {
    localStorage.openOnSave = false;
}

if(typeof localStorage["sendAnalytics"] == "undefined") {
    localStorage.sendAnalytics = true;
}

var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key': 'anonymous',
    'consumer_secret': 'anonymous',
    'scope': DOCLIST_SCOPE,
    'app_name': 'gRecipe',
    'callback_page': 'lib/chrome_ex_oauth.html'
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if ( request.hasRecipe ) {
            chrome.pageAction.show(sender.tab.id);
            recipes[sender.tab.id + ''] = request.recipe;
        }
});

chrome.tabs.onRemoved.addListener(
    function(tabId) {
        recipes[tabId + ''] = '';
    }
);

function toBool(str) {
    if (str == 'false') {
        return false;
    } else {
        return str;
    }    
};

function shouldOpenOnSave () {
    return toBool(localStorage.openOnSave);
}

function shouldSendAnalytics () {
    return toBool(localStorage.sendAnalytics);
}

function setOpenOnSave (value) {
    localStorage.openOnSave = value;
}

function setSendAnalytics (value) {
    localStorage.sendAnalytics = value;
}

function logout() {
    chrome.tabs.create( {
        'url': 'https://www.google.com/accounts/b/0/RevokeAuthSubAccess?authsub_tokens=' + encodeURIComponent(oauth.getToken()) + '&authsub_target_label=moodkncdncfpjbcaofoibalkmchnnfja&authsub_scope_label=Google+Docs'
    });
    oauth.clearTokens();
};
