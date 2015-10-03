chrome.devtools.panels.create(chrome.i18n.getMessage('extensionTabText'), 'img/icon-48.png', 'panel.html', function (panel) {

    'use strict';

    // Create your panel buttons etc here...

    // When the panel is first shown run any init code
    panel.onShown.addListener(function init(/* panelWindow */) {
        
        // Remove this listener after first run
        panel.onShown.removeListener(init);

        // Your extension startup code goes here...
        // Note: You can access the "Core API" using `panelWindow.CoreAPI`

    });
});