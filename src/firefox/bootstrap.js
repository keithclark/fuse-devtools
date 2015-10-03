/* globals DevtoolsPanel, toolDefinition, toolStrings */
/* exported startup, shutdown, install, uninstall */

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource:///modules/devtools/gDevTools.jsm');

XPCOMUtils.defineLazyGetter(this, 'osString', () => Cc['@mozilla.org/xre/app-info;1'].getService(Ci.nsIXULRuntime).OS);
XPCOMUtils.defineLazyGetter(this, 'toolStrings', () => Services.strings.createBundle('chrome://<%= pkg.name %>/locale/strings.properties'));
XPCOMUtils.defineLazyGetter(this, 'toolDefinition', () => ({
    id: '<%= pkg.name %>',
    icon: 'chrome://<%= pkg.name %>/skin/img/icon-16.png',
    url: 'chrome://<%= pkg.name %>/content/panel.xul',
    label: toolStrings.GetStringFromName('extensionTabText'),
    tooltip: toolStrings.GetStringFromName('extensionName'),
    invertIconForLightTheme: true,
    inMenu: true,
    ordinal: 99,
    isTargetSupported: function(target) {
        return target.isLocalTab;
    },
    build: function(window, toolbox) {
        Cu.import('chrome://<%= pkg.name %>/content/js/devtools-panel.js');
        let panel = new DevtoolsPanel(window, toolbox);
        return panel.open();
    }
}));

/**
 * Called when the extension is first installed, when the extension becomes 
 * enabled using the add-ons manager window and when Firefox is started, 
 * provied the add-on is enabled and compatible with the current version of
 * Firefox.
 *
 * https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions#startup
 */
function startup() {
    gDevTools.registerTool(toolDefinition);
}

/**
 * Called if the extension is enabled and: it is uninstalled, it is disabled 
 * using the add-ons manager window and if the user quits Firefox.
 *
 * https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions#shutdown
 */
function shutdown() {
    gDevTools.unregisterTool(toolDefinition);
    Services.obs.notifyObservers(null, 'startupcache-invalidate', null);
}

/**
 * Called before the first call to startup() after the extension is installed,
 * upgraded, or downgraded.
 *
 * https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions#install
 */
function install() {}

/**
 * This function is called after the last call to shutdown() before a particular
 * version of an extension is uninstalled. This will not be called if install()
 * was never called.
 *
 * https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions#uninstall
 */
function uninstall() {}
