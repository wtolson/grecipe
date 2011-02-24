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

(function(window, $, grecipe, undefined) {

function logout(event) {
  grecipe.logout();
  event.target.disabled = true;
}

function setOpenOnSave(event) {
  grecipe.setOpenOnSave(event.target.checked);
}

function setSendAnalytics(event) {
  grecipe.setSendAnalytics(event.target.checked);
}

function initUI() {
  $('#revoke').get(0).disabled = !grecipe.oauth.hasToken();
  $('#openonsave').get(0).checked = grecipe.shouldOpenOnSave();
  $('#analytics').get(0).checked = grecipe.shouldSendAnalytics();
}

$(function() {
  initUI();
  $("#revokeButton").click(logout);
  $("#openonsaveOption").click(setOpenOnSave);
  $("#analyticsOption").click(logout);
});

})(window, window.jQuery, window.chrome.extension.getBackgroundPage().grecipe);
