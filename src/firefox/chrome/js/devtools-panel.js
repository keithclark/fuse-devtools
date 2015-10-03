/**
 * DevtoolsPanel
 *
 * Implements the `ToolPanel` interface that the `Toolbox` uses to manage the
 * panel of our devtools add-on.
 *
 * see:
 * - https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI#Toolbox
 * - https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI#ToolPanel
 */

function DevtoolsPanel(window, target) {
    this.window = window;
    this.target = target;
}

DevtoolsPanel.prototype = {
   
    /**
     * Called when the toolbox tries to open the devtools panel.
     *
     * @returns {Promise} a Promise that resolves with the ToolPanel when it's
     *                    ready to be used.
     */
    open: function() {
        return this.window.startup(this.target).then(() => this);
    },
    /**
     * Called when the toolbox is closed or the tool is unregistered. If the
     * tool needs to perform asynchronous operations during destruction the
     * method should return a Promise that is resolved once the process is
     * complete.
     *
     * @returns {Promise} a Promise that resolves once the toolbox is destroyed.
     */
    destroy: function() {
        return this.window.shutdown();
    }
};

this.EXPORTED_SYMBOLS = ['DevtoolsPanel'];
