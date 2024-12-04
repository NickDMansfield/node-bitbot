
var assert = require('assert');
const funcs = require('../funcs/funcs');

describe('isLimitOrderRunnable', function () {
  describe('Success states', function () {
    it('should return true for a limit sell at price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToSell: 11, price: 100 }, 100);
      assert.equal(true, result);
    });
    it('should return true for a limit sell above price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToSell: 11, price: 100 }, 120);
      assert.equal(true, result);
    });
    it('should return false for a limit sell above price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToSell: 11, price: 100 }, 80);
      assert.equal(false, result);
    });

    it('should return true for a limit buy at price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToBuy: 11, price: 100 }, 100);
      assert.equal(true, result);
    });
    it('should return true for a limit buy below price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToBuy: 11, price: 100 }, 90);
      assert.equal(true, result);
    });
    it('should return false for a limit buy above price point', function () {
      const result = funcs.isLimitOrderRunnable({ amountToBuy: 11, price: 100 }, 110);
      assert.equal(false, result);
    });
  });

  describe('Failure states', function () {
    it('should throw an error if no args are provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable(); 
        }, Error('You must provide a limitOrder object'));
    });

    it('should throw an error if no limitOrder is provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable(null, []); 
        }, Error('You must provide a limitOrder object'));
    });

    it('should throw an error if a non-object limitOrder is provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable(77.70, 12.13); 
        }, Error('You must provide a limitOrder object'));
    });

    it('should throw an error if no amountToSell and no amountToBuy are provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable({}, 77.70); 
        }, Error('You must provide either an amountToSell or an amountToBuy'));
    });

    it('should throw an error if no currentPrice provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable({ amountToBuy: 45.23, price: 13.24 }); 
        }, Error('No currentPrice number provided'));
    });

    it('should throw an error if a non-numeric currentPrice is provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable({ amountToBuy: 45.23, price: 13.24 }, 'oopsie'); 
        }, Error('No currentPrice number provided'));
    });

    it('should throw an error if no limitOrder.price is provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable({ amountToBuy: 45.23 }, 77); 
        }, Error('You must provide a price property on the limitOrder'));
    });

    it('should throw an error if a non-numeric limitOrder.price is provided', function () {
        assert.throws(() => {
          funcs.isLimitOrderRunnable({ amountToBuy: 45.23, price: 'hello' }, 77); 
        }, Error('limitOrder.price must be a number'));
    });
    
  });
});