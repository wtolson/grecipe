var util = {};
var gdocs = {};

var bgPage = chrome.extension.getBackgroundPage();

/**
 * A helper for constructing the raw Atom xml send in the body of an HTTP post.
 * @param {XMLHttpRequest} xhr The xhr request that failed.
 * @param {string} docTitle A title for the document.
 * @param {string} docType The type of document to create.
 *     (eg. 'document', 'spreadsheet', etc.)
 * @param {boolean?} opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructAtomXml_ = function(docTitle, docType, opt_starred) {
    var starred = opt_starred || null;

    var starCat = ['<category scheme="http://schemas.google.com/g/2005/labels" ',
                   'term="http://schemas.google.com/g/2005/labels#starred" ',
                   'label="starred"/>'].join('');

    var atom = ["<?xml version='1.0' encoding='UTF-8'?>", 
                '<entry xmlns="http://www.w3.org/2005/Atom">',
                '<category scheme="http://schemas.google.com/g/2005#kind"', 
                ' term="http://schemas.google.com/docs/2007#', docType, '"/>',
                starred ? starCat : '',
                '<title>', docTitle, '</title>',
                '</entry>'].join('');
    return atom;
};

/**
 * A helper for constructing the body of a mime-mutlipart HTTP request.
 * @param {string} title A title for the new document.
 * @param {string} docType The type of document to create.
 *     (eg. 'document', 'spreadsheet', etc.)
 * @param {string} body The body of the HTTP request.
 * @param {string} contentType The Content-Type of the (non-Atom) portion of the
 *     http body.
 * @param {boolean?} opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructContentBody_ = function(title, docType, body, contentType,
                                       opt_starred) {
    var body = ['--END_OF_PART\r\n',
                'Content-Type: application/atom+xml;\r\n\r\n',
                gdocs.constructAtomXml_(title, docType, opt_starred), '\r\n',
                '--END_OF_PART\r\n',
                'Content-Type: ', contentType, '\r\n\r\n',
                body, '\r\n',
                '--END_OF_PART--\r\n'].join('');
    return body;
};

util.openTab = function(url) {
    chrome.tabs.create( {
        "url": url
    });
};

/**
 * Utility for displaying a message to the user.
 * @param {string} msg The message.
 */
util.displayMsg = function(msg) {
    $('#messagetxt').text(msg);
};

var handleSuccess = function(resp, xhr) {
    util.displayMsg('Recipe Saved!');
    var respObject = eval('(' + resp + ')');
    if (bgPage.shouldOpenOnSave()) {
        util.openTab(respObject.entry.link[0].href);
    }
    //https://docs.google.com/
    var openMsg = 'View your new recipe in <a title="Google Documents" onclick="util.openTab(\x27https://docs.google.com/\x27)" href="javascript:null()">Google Documents</a> or open it <a title="' + respObject.entry.title.$t +'" onclick="util.openTab(\x27' + respObject.entry.link[0].href + '\x27)" href="javascript:null()">here</a>.';
    
    $('#message').append('<p>' + openMsg + '</p>');
};

/**
 * Creates a new document in Google Docs.
 */
var createDoc = function(tab) {
    recipe = bgPage.getRecipe(tab.id);
  
    var content = '<html><head><style type="text/css">body{font-size:11pt;font-family:Arial;line-height:115%}h1{padding-top:14.0pt;padding-bottom:4.0pt;font-size:24pt;font-weight:bold}h2{padding-top:14.0pt;padding-bottom:0.0pt;font-size:18pt;font-weight:bold}h3{padding-top:0.0pt;padding-bottom:-8.0pt;font-size:14pt;font-weight:bold}ol{list-style-type:disc}li{margin-left:6.0pt}</style></head><body><h1>' + recipe.title + '</h1><p>' + recipe.summary + '</p><h2>Ingredients</h2>' + recipe.ingredients + '<h2>Instructions</h2>' + recipe.instructions + '</body></html>';
  

    var params = {
        'method': 'POST',
        'headers': {
            'GData-Version': '3.0',
            'Content-Type': 'multipart/related; boundary=END_OF_PART',
        },
        'parameters': {'alt': 'json'},
        'body': gdocs.constructContentBody_(recipe.title, 'document', content,
                                            'text/html', false)
    };

    bgPage.oauth.sendSignedRequest(bgPage.DOCLIST_FEED, handleSuccess, params);
};

function authorize() {
    bgPage.oauth.authorize(function() {
        chrome.tabs.getCurrent( function(tab) {
            chrome.tabs.remove(tab.id);
        });
    });            
}

function onload() {
    if ( bgPage.oauth.hasToken() ) {
        $('#message').show();
        chrome.tabs.getSelected( null, createDoc);                
    } else {
        $('#oauthbutton').show();
        $('#optionslink').live('click', function(e) {
            util.openTab(chrome.extension.getURL("options.html"));
        });
        $('#googlesettingslink').live('click', function(e) {
            util.openTab("https://www.google.com/accounts/b/0/IssuedAuthSubTokens");
        });
    }
}
