var bgPage = chrome.extension.getBackgroundPage();

function logout() {
    bgPage.logout();
    $('#revoke').get(0).disabled = true;
}

function setOpenOnSave() {
    bgPage.setOpenOnSave($('#openonsave').get(0).checked);
}

function setSendAnalytics() {
    bgPage.setSendAnalytics($('#analytics').get(0).checked);
}

function initUI() {
    $('#revoke').get(0).disabled = !bgPage.oauth.hasToken();
    $('#openonsave').get(0).checked = bgPage.shouldOpenOnSave();
    $('#analytics').get(0).checked = bgPage.shouldSendAnalytics();
}
