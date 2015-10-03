/* global EventEmitter, promise, ViewHelpers, CoreAPI */
/* exported startup, shutdown */

const { utils: Cu } = Components;

const STRINGS_URI = 'chrome://<%= pkg.name %>/locale/strings.properties';

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource:///modules/devtools/ViewHelpers.jsm');

XPCOMUtils.defineLazyModuleGetter(this, 'EventEmitter', 'resource://gre/modules/devtools/event-emitter.js');
XPCOMUtils.defineLazyModuleGetter(this, 'promise', 'resource://gre/modules/commonjs/sdk/core/promise.js', 'Promise');

function startup(/*target*/) {
	document.getElementById('extension-title').setAttribute('value', L10N.getStr('extensionName'));
	document.getElementById('extension-greeting').setAttribute('value', CoreAPI.getGreeting());
    return promise.resolve();
}

function shutdown() {
    return promise.resolve();
}

/**
 * Localization convenience methods.
 */
var L10N = new ViewHelpers.L10N(STRINGS_URI);

/**
 * Convenient way of emitting events from the panel window.
 */
EventEmitter.decorate(this);
