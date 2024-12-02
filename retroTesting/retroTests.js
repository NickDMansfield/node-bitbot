const { testRetroactively } = require('./runRetro');
var assert = require('assert');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
        const result = testRetroactively([],[]);
        assert.ok(result);
    });
  });
});