var CoreAPI = (function() {

    'use strict';
    
    function getGreeting() {
        return 'Hello from the Core API';
    }

    return {
        getGreeting: getGreeting
    };

}());

// Expose the CoreAPI for node unit testing
if (typeof module !== 'undefined') {
    module.exports = CoreAPI;
}
