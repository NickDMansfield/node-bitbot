var assert = require('assert');
const safeSwing = require('../philosophies/safe-swing');

describe('SafeSwing', function () {
  describe('Failure states', function () {
    
    it('should throw an error when no processSettings are provided', function () {
      assert.throws(() => {
        safeSwing.processData(null, [], []); 
      }, Error('You must provide a processSettings arg object'));
    });
    
    it('should throw an error when no purchaseHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, []); 
      }, Error('You must provide a purchaseHistory array arg'));
    });
    
    it('should throw an error when no priceHistory is provided', function () {
      assert.throws(() => {
        safeSwing.processData({}, null ,[]); 
      }, Error('You must provide a priceHistory array arg'));
    });

  });
});