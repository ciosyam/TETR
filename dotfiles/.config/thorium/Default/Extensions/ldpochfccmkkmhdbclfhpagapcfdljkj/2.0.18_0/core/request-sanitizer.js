/**
 * Request Sanitizer
 * Belongs to Decentraleyes.
 *
 * @author      Thomas Rientjes
 * @since       2018-01-10
 * @license     MPL 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/**
 * Request Sanitizer
 */

let requestSanitizer = {};

/**
 * Public Methods
 */

requestSanitizer.enable = function () {

    chrome.webRequest.onBeforeSendHeaders.addListener(requestSanitizer._stripMetadata, {
        'urls': stateManager.validHosts
    }, [WebRequest.BLOCKING, WebRequest.HEADERS]);
};

requestSanitizer.disable = function () {
    chrome.webRequest.onBeforeSendHeaders.removeListener(requestSanitizer._stripMetadata);
};

/**
 * Private Methods
 */

requestSanitizer._stripMetadata = function (requestDetails) {

    let sensitiveHeaders = [Header.COOKIE, Header.ORIGIN, Header.REFERER];

    for (let i = 0; i < requestDetails.requestHeaders.length; ++i) {

        if (sensitiveHeaders.indexOf(requestDetails.requestHeaders[i].name) > -1) {
            requestDetails.requestHeaders.splice(i--, 1);
        }
    }

    return {
        [WebRequest.HEADERS]: requestDetails.requestHeaders
    };
};

/**
 * Initializations
 */

helpers.getStoredSettings(Setting.STRIP_METADATA, function (items) {

    if (items === null || items.stripMetadata !== false) {
        requestSanitizer.enable();
    }
});
