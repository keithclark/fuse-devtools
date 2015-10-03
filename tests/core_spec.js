/* jshint node: true */

'use strict';

var CoreAPI = require('../src/core/core.js');

describe('CoreAPI', function () {
    it('getGreeting() should return a greeting', function() {
        expect(CoreAPI.getGreeting()).toBe('Hello from the Core API');
    });
});