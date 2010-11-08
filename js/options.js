/***********************************************************************
 * 
 *     This file is part of gRecipes.
 *
 *     gRecipes is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     gRecipes is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with gRecipes.  If not, see <http://www.gnu.org/licenses/>.
 * 
 **********************************************************************/


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
