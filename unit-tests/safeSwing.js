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
  describe('Success states', function() {
    it('should return proper values on a basic happy path', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });
    
    it('should return proper values and generate a single limitOrder (purchase)', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });

    it('should return proper values and generate multiple limitOrders (purchase)', function () {
      assert.equal([1, 2, 3].indexOf(4), 99);
    });
  })
});